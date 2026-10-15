"""Response shapes for the web dashboard. Amounts are Decimals, which
serialize as plain decimal strings in JSON.
"""

from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel

from app.models.enums import IncomeExpenseType, TransactionSource, TransactionStatus


class DailyPointOut(BaseModel):
    date: date
    income: Decimal
    expense: Decimal


class TopProductOut(BaseModel):
    product_id: int
    name: str
    unit: str
    quantity_sold: Decimal
    revenue: Decimal
    stock_qty: Decimal


class OverviewOut(BaseModel):
    business_name: str
    period_start: date
    period_end: date
    income: Decimal
    expense: Decimal
    net_profit: Decimal
    daily: list[DailyPointOut]
    top_products: list[TopProductOut]


class TaxMeterOut(BaseModel):
    year: int
    annual_income: Decimal
    threshold: Decimal
    ratio: Decimal
    color: Literal["green", "yellow", "red"]
    registration_required: bool


class TransactionOut(BaseModel):
    id: int
    type: IncomeExpenseType
    amount: Decimal
    description: str | None
    category: str | None
    txn_date: date
    status: TransactionStatus
    source: TransactionSource
    product_name: str | None
    quantity: Decimal | None


class ProductOut(BaseModel):
    id: int
    name: str
    unit: str
    unit_cost: Decimal | None
    stock_qty: Decimal
