from datetime import date, timedelta
from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.analytics import business_overview
from app.core.db import get_db
from app.main import app
from app.models import Base, Business, Product, Transaction, User
from app.models.enums import (
    ExpenseMethod,
    IncomeExpenseType,
    TaxStatus,
    TransactionSource,
    TransactionStatus,
)
from app.routers import deps
from app.services import auth_service, user_service


@pytest.fixture()
def session() -> Session:
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    db = sessionmaker(bind=engine)()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def client(session: Session, monkeypatch: pytest.MonkeyPatch) -> TestClient:
    monkeypatch.setattr(deps.settings, "liff_id", "")
    monkeypatch.setattr(deps.settings, "dashboard_line_user_id", "")
    app.dependency_overrides[get_db] = lambda: session
    yield TestClient(app)
    app.dependency_overrides.clear()


def _shop(db: Session, line_user_id: str, name: str) -> Business:
    user = User(line_user_id=line_user_id, display_name=name)
    db.add(user)
    db.flush()
    biz = Business(
        owner_id=user.id,
        name=name,
        business_type="ของฝาก",
        tax_status=TaxStatus.INDIVIDUAL,
        vat_registered=False,
        expense_method=ExpenseMethod.FLAT_RATE,
    )
    db.add(biz)
    db.flush()
    return biz


def _txn(
    db: Session,
    biz: Business,
    type_: IncomeExpenseType,
    amount: str,
    day: date,
    product: Product | None = None,
    quantity: str | None = None,
    status: TransactionStatus = TransactionStatus.CONFIRMED,
    is_personal: bool = False,
) -> None:
    db.add(
        Transaction(
            business_id=biz.id,
            type=type_,
            amount=Decimal(amount),
            txn_date=day,
            description="x",
            product_id=product.id if product else None,
            quantity=Decimal(quantity) if quantity else None,
            is_personal=is_personal,
            source=TransactionSource.TEXT,
            status=status,
        )
    )
    db.flush()


@pytest.mark.parametrize(
    ("annual_income", "color", "required"),
    [
        ("1000000", "green", False),
        ("1440000", "yellow", False),
        ("1620000", "red", False),
        ("1800000", "red", True),
    ],
)
def test_tax_meter_color(annual_income: str, color: str, required: bool):
    meter = business_overview.tax_meter(Decimal(annual_income), 2026)
    assert meter.color == color
    assert meter.registration_required is required
    assert meter.threshold == Decimal("1800000")


def test_overview_counts_only_confirmed_shop_transactions_this_month(client: TestClient, session: Session):
    biz = _shop(session, user_service.DEMO_LINE_USER_ID, "ร้านสาธิต")
    today = date.today()
    chili = Product(business_id=biz.id, name="น้ำพริกเผา", unit="กระปุก", stock_qty=Decimal("12"))
    banana = Product(business_id=biz.id, name="กล้วยตาก", unit="ถุง", stock_qty=Decimal("3"))
    soap = Product(business_id=biz.id, name="สบู่", unit="ก้อน", stock_qty=Decimal("0"))
    tea = Product(business_id=biz.id, name="ชาไทย", unit="ถุง", stock_qty=Decimal("8"))
    session.add_all([chili, banana, soap, tea])
    session.flush()

    _txn(session, biz, IncomeExpenseType.INCOME, "1000", today, chili, "10")
    _txn(session, biz, IncomeExpenseType.INCOME, "600", today, banana, "6")
    _txn(session, biz, IncomeExpenseType.INCOME, "300", today, soap, "3")
    _txn(session, biz, IncomeExpenseType.INCOME, "100", today, tea, "1")
    _txn(session, biz, IncomeExpenseType.EXPENSE, "400", today)
    # Excluded: pending, personal, and anything before this month.
    _txn(session, biz, IncomeExpenseType.INCOME, "9999", today, tea, "50", status=TransactionStatus.PENDING)
    _txn(session, biz, IncomeExpenseType.EXPENSE, "777", today, is_personal=True)
    _txn(session, biz, IncomeExpenseType.INCOME, "5000", today.replace(day=1) - timedelta(days=1))

    response = client.get("/api/v1/dashboard/overview")
    assert response.status_code == 200
    body = response.json()

    assert body["business_name"] == "ร้านสาธิต"
    assert Decimal(body["income"]) == Decimal("2000")
    assert Decimal(body["expense"]) == Decimal("400")
    assert Decimal(body["net_profit"]) == Decimal("1600")
    assert [p["name"] for p in body["top_products"]] == ["น้ำพริกเผา", "กล้วยตาก", "สบู่"]
    assert Decimal(body["top_products"][0]["quantity_sold"]) == Decimal("10")
    assert Decimal(body["top_products"][1]["stock_qty"]) == Decimal("3")
    assert len(body["daily"]) == 30
    assert body["daily"][-1]["date"] == today.isoformat()
    assert Decimal(body["daily"][-1]["income"]) == Decimal("2000")


def test_tax_meter_endpoint(client: TestClient, session: Session):
    biz = _shop(session, user_service.DEMO_LINE_USER_ID, "ร้านสาธิต")
    _txn(session, biz, IncomeExpenseType.INCOME, "1500000", date.today())

    body = client.get("/api/v1/tax/meter").json()

    assert Decimal(body["annual_income"]) == Decimal("1500000")
    assert Decimal(body["ratio"]) == Decimal("0.8333")
    assert body["color"] == "yellow"
    assert body["registration_required"] is False


def test_transactions_and_products_lists(client: TestClient, session: Session):
    biz = _shop(session, user_service.DEMO_LINE_USER_ID, "ร้านสาธิต")
    chili = Product(business_id=biz.id, name="น้ำพริกเผา", unit="กระปุก", stock_qty=Decimal("12"))
    banana = Product(business_id=biz.id, name="กล้วยตาก", unit="ถุง", stock_qty=Decimal("2"))
    session.add_all([chili, banana])
    session.flush()
    _txn(session, biz, IncomeExpenseType.INCOME, "100", date.today() - timedelta(days=1))
    _txn(session, biz, IncomeExpenseType.INCOME, "500", date.today(), chili, "5", status=TransactionStatus.PENDING)

    txns = client.get("/api/v1/transactions").json()
    assert [t["amount"] for t in txns] == ["500.00", "100.00"]
    assert txns[0]["product_name"] == "น้ำพริกเผา"
    assert txns[0]["status"] == "pending"

    products = client.get("/api/v1/products").json()
    assert [p["name"] for p in products] == ["กล้วยตาก", "น้ำพริกเผา"]


def test_bearer_jwt_selects_that_users_shop(client: TestClient, session: Session):
    _shop(session, user_service.DEMO_LINE_USER_ID, "ร้านสาธิต")
    _shop(session, "Ureal", "ร้านจริง")

    token = auth_service.issue_jwt("Ureal")
    body = client.get("/api/v1/dashboard/overview", headers={"Authorization": f"Bearer {token}"}).json()
    assert body["business_name"] == "ร้านจริง"


def test_dashboard_line_user_id_replaces_demo_shop_without_liff(
    client: TestClient, session: Session, monkeypatch: pytest.MonkeyPatch
):
    _shop(session, user_service.DEMO_LINE_USER_ID, "ร้านสาธิต")
    _shop(session, "Ureal", "ร้านจริง")
    monkeypatch.setattr(deps.settings, "dashboard_line_user_id", "Ureal")

    body = client.get("/api/v1/dashboard/overview").json()
    assert body["business_name"] == "ร้านจริง"


def test_invalid_jwt_returns_error_contract(client: TestClient, session: Session):
    response = client.get("/api/v1/tax/meter", headers={"Authorization": "Bearer garbage"})
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "invalid_token"


def test_liff_configured_requires_login(client: TestClient, session: Session, monkeypatch: pytest.MonkeyPatch):
    _shop(session, user_service.DEMO_LINE_USER_ID, "ร้านสาธิต")
    monkeypatch.setattr(deps.settings, "liff_id", "1234567890-abcdefgh")

    response = client.get("/api/v1/tax/meter")
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "unauthenticated"


def test_missing_demo_shop_returns_404(client: TestClient):
    response = client.get("/api/v1/products")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "business_not_found"


def test_line_login_exchanges_id_token_for_jwt(
    client: TestClient, session: Session, monkeypatch: pytest.MonkeyPatch
):
    monkeypatch.setattr(deps.settings, "liff_id", "1234567890-abcdefgh")
    monkeypatch.setattr(
        auth_service,
        "verify_line_id_token",
        lambda token: auth_service.LineProfile(line_user_id="Unew", display_name="แม่ค้าใหม่"),
    )

    response = client.post("/api/v1/auth/line", json={"id_token": "id-token"})
    assert response.status_code == 200
    assert auth_service.decode_jwt(response.json()["access_token"]) == "Unew"
    user = session.query(User).filter_by(line_user_id="Unew").one()
    assert user.display_name == "แม่ค้าใหม่"
    assert len(user.businesses) == 1


def test_liff_channel_id_is_liff_id_prefix(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(auth_service.settings, "liff_id", "1657000000-AbCdEfGh")
    assert auth_service.liff_channel_id() == "1657000000"
