"""Endpoints for the web dashboard's My Business tab (pending transactions can be edited, confirmed or cancelled here too)."""

from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.analytics import business_overview
from app.core.db import get_db
from app.core.errors import ApiError
from app.models import Business, Product, Transaction
from app.models.enums import TransactionStatus
from app.routers.deps import get_current_business
from app.schemas.dashboard import (
    DailyPointOut,
    OverviewOut,
    ProductOut,
    TaxMeterOut,
    TopProductOut,
    TransactionOut,
    TransactionUpdateIn,
)
from app.services import transaction_service

router = APIRouter(tags=["dashboard"])

TREND_DAYS = 30


@router.get("/dashboard/overview", response_model=OverviewOut)
def get_overview(
    business: Business = Depends(get_current_business), db: Session = Depends(get_db)
) -> OverviewOut:
    """Month-to-date income/expense/profit and best sellers, plus a 30-day daily trend."""
    today = date.today()
    month_start = today.replace(day=1)
    income, expense = business_overview.period_totals(db, business.id, month_start, today)
    daily = business_overview.daily_series(db, business.id, today - timedelta(days=TREND_DAYS - 1), today)
    top = business_overview.top_products(db, business.id, month_start, today)
    return OverviewOut(
        business_name=business.name,
        period_start=month_start,
        period_end=today,
        income=income,
        expense=expense,
        net_profit=income - expense,
        daily=[DailyPointOut(date=p.day, income=p.income, expense=p.expense) for p in daily],
        top_products=[
            TopProductOut(
                product_id=t.product.id,
                name=t.product.name,
                unit=t.product.unit,
                quantity_sold=t.quantity_sold,
                revenue=t.revenue,
                stock_qty=t.product.stock_qty,
            )
            for t in top
        ],
    )


@router.get("/tax/meter", response_model=TaxMeterOut)
def get_tax_meter(
    business: Business = Depends(get_current_business), db: Session = Depends(get_db)
) -> TaxMeterOut:
    """Year-to-date confirmed income against the VAT registration threshold."""
    annual_income = transaction_service.current_year_confirmed_income(db, business.id)
    meter = business_overview.tax_meter(annual_income, date.today().year)
    return TaxMeterOut(
        year=meter.year,
        annual_income=meter.annual_income,
        threshold=meter.threshold,
        ratio=meter.ratio,
        color=meter.color,
        registration_required=meter.registration_required,
    )


@router.get("/transactions", response_model=list[TransactionOut])
def list_transactions(
    limit: int = Query(default=50, ge=1, le=200),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> list[TransactionOut]:
    txns = db.execute(
        select(Transaction)
        .options(joinedload(Transaction.category), joinedload(Transaction.product))
        .where(Transaction.business_id == business.id)
        .order_by(Transaction.txn_date.desc(), Transaction.id.desc())
        .limit(limit)
    ).scalars().all()
    return [_transaction_out(t) for t in txns]


def _transaction_out(t: Transaction) -> TransactionOut:
    return TransactionOut(
        id=t.id,
        type=t.type,
        amount=t.amount,
        description=t.description,
        category=t.category.name_th if t.category else None,
        txn_date=t.txn_date,
        status=t.status,
        source=t.source,
        product_name=t.product.name if t.product else None,
        quantity=t.quantity,
    )


def _owned(db: Session, transaction_id: int, business: Business) -> Transaction:
    try:
        return transaction_service.get_owned_transaction(db, transaction_id, business.id)
    except transaction_service.TransactionNotFoundError as exc:
        raise ApiError(404, "transaction_not_found", "ไม่พบรายการนี้") from exc


def _require_pending(txn: Transaction) -> None:
    if txn.status != TransactionStatus.PENDING:
        raise ApiError(409, "transaction_not_pending", "รายการนี้ยืนยันหรือยกเลิกไปแล้ว แก้ไขไม่ได้")


@router.patch("/transactions/{transaction_id}", response_model=TransactionOut)
def update_transaction(
    transaction_id: int,
    body: TransactionUpdateIn,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> TransactionOut:
    _require_pending(_owned(db, transaction_id, business))
    txn = transaction_service.update_pending_transaction(
        db,
        transaction_id,
        business.id,
        type_=body.type,
        amount=body.amount,
        description=body.description,
        txn_date=body.txn_date,
        product_name=body.product_name,
        quantity=body.quantity,
    )
    db.commit()
    return _transaction_out(txn)


@router.post("/transactions/{transaction_id}/confirm", response_model=TransactionOut)
def confirm_transaction(
    transaction_id: int, business: Business = Depends(get_current_business), db: Session = Depends(get_db)
) -> TransactionOut:
    _require_pending(_owned(db, transaction_id, business))
    txn = transaction_service.confirm_transaction(db, transaction_id, business.id)
    db.commit()
    return _transaction_out(txn)


@router.post("/transactions/{transaction_id}/cancel", response_model=TransactionOut)
def cancel_transaction(
    transaction_id: int, business: Business = Depends(get_current_business), db: Session = Depends(get_db)
) -> TransactionOut:
    _require_pending(_owned(db, transaction_id, business))
    txn = transaction_service.cancel_transaction(db, transaction_id, business.id)
    db.commit()
    return _transaction_out(txn)


@router.get("/products", response_model=list[ProductOut])
def list_products(
    business: Business = Depends(get_current_business), db: Session = Depends(get_db)
) -> list[ProductOut]:
    products = db.execute(
        select(Product).where(Product.business_id == business.id).order_by(Product.stock_qty, Product.name)
    ).scalars().all()
    return [ProductOut.model_validate(p, from_attributes=True) for p in products]
