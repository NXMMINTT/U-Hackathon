"""Read-only endpoints for the web dashboard's My Business tab."""

from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.analytics import business_overview
from app.core.db import get_db
from app.models import Business, Product, Transaction
from app.routers.deps import get_current_business
from app.schemas.dashboard import (
    DailyPointOut,
    OverviewOut,
    ProductOut,
    TaxMeterOut,
    TopProductOut,
    TransactionOut,
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
    return [
        TransactionOut(
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
        for t in txns
    ]


@router.get("/products", response_model=list[ProductOut])
def list_products(
    business: Business = Depends(get_current_business), db: Session = Depends(get_db)
) -> list[ProductOut]:
    products = db.execute(
        select(Product).where(Product.business_id == business.id).order_by(Product.stock_qty, Product.name)
    ).scalars().all()
    return [ProductOut.model_validate(p, from_attributes=True) for p in products]
