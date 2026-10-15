"""Seed demo data: one business with 6 months of transactions trending
toward the VAT registration threshold, for dashboard/forecast demos.
"""

import random
from datetime import date, timedelta
from decimal import Decimal

from app.core.db import SessionLocal
from app.models import Business, Category, Transaction, User
from app.models.enums import (
    ExpenseMethod,
    IncomeExpenseType,
    TaxStatus,
    TransactionSource,
    TransactionStatus,
)

DEMO_LINE_USER_ID = "demo-user-001"

INCOME_CATEGORIES = ["ขายหน้าร้าน", "ขายออนไลน์", "รับจ้างบริการ"]
EXPENSE_CATEGORIES = ["ค่าวัตถุดิบ", "ค่าเช่าร้าน", "ค่าแรงพนักงาน", "ค่าสาธารณูปโภค", "ค่าขนส่ง"]


def _month_starts(months_back: int) -> list[date]:
    today = date.today()
    first_of_this_month = today.replace(day=1)
    starts = []
    for i in range(months_back, 0, -1):
        year = first_of_this_month.year
        month = first_of_this_month.month - i
        while month <= 0:
            month += 12
            year -= 1
        starts.append(date(year, month, 1))
    return starts


def seed() -> None:
    db = SessionLocal()
    try:
        existing_user = db.query(User).filter_by(line_user_id=DEMO_LINE_USER_ID).one_or_none()
        if existing_user is not None:
            print("Demo user already exists, skipping seed.")
            return

        user = User(line_user_id=DEMO_LINE_USER_ID, display_name="ร้านสาธิต U-Ledger")
        db.add(user)
        db.flush()

        business = Business(
            owner_id=user.id,
            name="ร้านสาธิต U-Ledger",
            business_type="ร้านอาหาร",
            tax_status=TaxStatus.INDIVIDUAL,
            vat_registered=False,
            expense_method=ExpenseMethod.FLAT_RATE,
        )
        db.add(business)
        db.flush()

        income_categories = {
            name: Category(business_id=business.id, name_th=name, type=IncomeExpenseType.INCOME)
            for name in INCOME_CATEGORIES
        }
        expense_categories = {
            name: Category(business_id=business.id, name_th=name, type=IncomeExpenseType.EXPENSE)
            for name in EXPENSE_CATEGORIES
        }
        db.add_all([*income_categories.values(), *expense_categories.values()])
        db.flush()

        rng = random.Random(42)
        transactions: list[Transaction] = []
        # Trend monthly revenue upward from ~120k to ~170k, approaching the
        # 1.8M/year (~150k/month) VAT threshold in the most recent month.
        for month_index, month_start in enumerate(_month_starts(6)):
            monthly_target = Decimal(120_000 + month_index * 10_000)
            days_in_month = 28
            daily_income_count = 3
            remaining = monthly_target
            for day_offset in range(days_in_month):
                txn_date = month_start + timedelta(days=day_offset)
                for _ in range(daily_income_count):
                    amount = (remaining / Decimal(days_in_month * daily_income_count)) * Decimal(
                        rng.uniform(0.5, 1.5)
                    )
                    amount = amount.quantize(Decimal("0.01"))
                    category_name = rng.choice(INCOME_CATEGORIES)
                    transactions.append(
                        Transaction(
                            business_id=business.id,
                            type=IncomeExpenseType.INCOME,
                            amount=amount,
                            category_id=income_categories[category_name].id,
                            description=category_name,
                            txn_date=txn_date,
                            is_personal=False,
                            source=TransactionSource.WEB,
                            status=TransactionStatus.CONFIRMED,
                        )
                    )

                if day_offset % 3 == 0:
                    category_name = rng.choice(EXPENSE_CATEGORIES)
                    amount = Decimal(rng.uniform(300, 3000)).quantize(Decimal("0.01"))
                    transactions.append(
                        Transaction(
                            business_id=business.id,
                            type=IncomeExpenseType.EXPENSE,
                            amount=amount,
                            category_id=expense_categories[category_name].id,
                            description=category_name,
                            txn_date=txn_date,
                            is_personal=False,
                            source=TransactionSource.WEB,
                            status=TransactionStatus.CONFIRMED,
                        )
                    )

        db.add_all(transactions)
        db.commit()
        print(f"Seeded demo user, business, {len(transactions)} transactions.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
