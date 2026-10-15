"""Product lookup and stock movements. Stock only moves when a transaction
is confirmed: a sale deducts stock, a purchase adds stock and records the
latest unit cost.
"""

from decimal import ROUND_HALF_UP, Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Product, Transaction
from app.models.enums import IncomeExpenseType


def list_product_names(db: Session, business_id: int) -> list[str]:
    return list(
        db.execute(select(Product.name).where(Product.business_id == business_id).order_by(Product.name))
        .scalars()
        .all()
    )


def get_or_create_product(db: Session, business_id: int, name: str) -> Product:
    name = name.strip()
    existing = db.execute(
        select(Product).where(Product.business_id == business_id, func.lower(Product.name) == name.lower())
    ).scalars().first()
    if existing is not None:
        return existing

    product = Product(business_id=business_id, name=name, stock_qty=Decimal("0"))
    db.add(product)
    db.flush()
    return product


def apply_stock_movement(db: Session, txn: Transaction) -> None:
    """Call once, when `txn` becomes confirmed."""
    if txn.product is None or txn.quantity is None or txn.is_personal:
        return

    if txn.type == IncomeExpenseType.INCOME:
        txn.product.stock_qty -= txn.quantity
    else:
        txn.product.stock_qty += txn.quantity
        if txn.quantity > 0:
            txn.product.unit_cost = (txn.amount / txn.quantity).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    db.flush()
