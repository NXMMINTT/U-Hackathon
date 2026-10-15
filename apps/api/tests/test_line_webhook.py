import base64
import hashlib
import hmac
import json
from datetime import date
from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from linebot.v3.webhook import WebhookParser
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.models import Base
from app.routers import line_webhook
from app.schemas.gemini import GeminiParseResult, ParsedIntent, ParsedTransaction, ParsedTransactionType

TEST_SECRET = "test-channel-secret"


def _sign(body: bytes) -> str:
    mac = hmac.new(TEST_SECRET.encode("utf-8"), body, hashlib.sha256).digest()
    return base64.b64encode(mac).decode("utf-8")


def _message_event_body(text: str, user_id: str = "Utestuser1") -> bytes:
    payload = {
        "destination": "xxxxxxxxxx",
        "events": [
            {
                "type": "message",
                "message": {"type": "text", "id": "1", "text": text, "quoteToken": "test-quote-token"},
                "timestamp": 1462629479859,
                "source": {"type": "user", "userId": user_id},
                "replyToken": "test-reply-token",
                "mode": "active",
                "webhookEventId": "wh-1",
                "deliveryContext": {"isRedelivery": False},
            }
        ],
    }
    return json.dumps(payload).encode("utf-8")


def _postback_event_body(data: str, user_id: str = "Utestuser1") -> bytes:
    payload = {
        "destination": "xxxxxxxxxx",
        "events": [
            {
                "type": "postback",
                "postback": {"data": data},
                "timestamp": 1462629479859,
                "source": {"type": "user", "userId": user_id},
                "replyToken": "test-reply-token",
                "mode": "active",
                "webhookEventId": "wh-2",
                "deliveryContext": {"isRedelivery": False},
            }
        ],
    }
    return json.dumps(payload).encode("utf-8")


@pytest.fixture()
def client(monkeypatch: pytest.MonkeyPatch) -> TestClient:
    monkeypatch.setattr(line_webhook, "_parser", WebhookParser(TEST_SECRET))

    # Background tasks run in a worker thread; a plain sqlite:///:memory: engine
    # hands each thread its own private database, so share one connection via
    # StaticPool instead.
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    test_session_local = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    monkeypatch.setattr(line_webhook, "SessionLocal", test_session_local)

    monkeypatch.setattr(line_webhook.line_service, "show_loading_animation", lambda *a, **k: None)
    monkeypatch.setattr(line_webhook.line_service, "reply_text", lambda *a, **k: None)
    monkeypatch.setattr(line_webhook.line_service, "reply_messages", lambda *a, **k: None)
    monkeypatch.setattr(line_webhook.line_service, "push_text", lambda *a, **k: None)

    return TestClient(app)


def test_invalid_signature_returns_400(client: TestClient):
    body = _message_event_body("ขายของได้ 100")
    response = client.post(
        "/api/v1/line/webhook", content=body, headers={"x-line-signature": "not-a-valid-signature"}
    )
    assert response.status_code == 400


def test_valid_signature_returns_200(client: TestClient):
    body = _message_event_body("ขายของได้ 100")
    response = client.post("/api/v1/line/webhook", content=body, headers={"x-line-signature": _sign(body)})
    assert response.status_code == 200


def test_text_message_creates_pending_transaction(client: TestClient, monkeypatch: pytest.MonkeyPatch):
    parsed = GeminiParseResult(
        intent=ParsedIntent.RECORD_TRANSACTIONS,
        transactions=[
            ParsedTransaction(
                type=ParsedTransactionType.INCOME,
                amount=Decimal("3500"),
                category_hint="ขายหน้าร้าน",
                description="ขายหน้าร้าน",
                txn_date=date(2026, 10, 15),
                is_personal=False,
                confidence=Decimal("0.9"),
            )
        ],
        clarification_question=None,
    )
    sent_messages = []
    monkeypatch.setattr(line_webhook.gemini_service, "parse_user_message", lambda text: parsed)
    monkeypatch.setattr(
        line_webhook.line_service, "reply_messages", lambda token, messages: sent_messages.append(messages)
    )

    body = _message_event_body("ขายของได้ 3500")
    response = client.post("/api/v1/line/webhook", content=body, headers={"x-line-signature": _sign(body)})

    assert response.status_code == 200
    assert len(sent_messages) == 1
    assert len(sent_messages[0][0].contents.contents) == 1


def test_confirm_postback_marks_transaction_confirmed(client: TestClient, monkeypatch: pytest.MonkeyPatch):
    parsed = GeminiParseResult(
        intent=ParsedIntent.RECORD_TRANSACTIONS,
        transactions=[
            ParsedTransaction(
                type=ParsedTransactionType.INCOME,
                amount=Decimal("3500"),
                category_hint="ขายหน้าร้าน",
                description="ขายหน้าร้าน",
                txn_date=date(2026, 10, 15),
                is_personal=False,
                confidence=Decimal("0.9"),
            )
        ],
        clarification_question=None,
    )
    monkeypatch.setattr(line_webhook.gemini_service, "parse_user_message", lambda text: parsed)

    body = _message_event_body("ขายของได้ 3500")
    client.post("/api/v1/line/webhook", content=body, headers={"x-line-signature": _sign(body)})

    session = line_webhook.SessionLocal()
    from app.models import Transaction
    from app.models.enums import TransactionStatus

    txn = session.query(Transaction).one()
    assert txn.status == TransactionStatus.PENDING
    session.close()

    confirm_body = _postback_event_body(f"action=confirm&id={txn.id}")
    response = client.post(
        "/api/v1/line/webhook", content=confirm_body, headers={"x-line-signature": _sign(confirm_body)}
    )
    assert response.status_code == 200

    session = line_webhook.SessionLocal()
    refreshed = session.query(Transaction).one()
    assert refreshed.status == TransactionStatus.CONFIRMED
    session.close()


def test_unsupported_message_type_replies_politely(client: TestClient, monkeypatch: pytest.MonkeyPatch):
    sent = []
    monkeypatch.setattr(line_webhook.line_service, "reply_text", lambda token, text: sent.append(text))
    payload = {
        "destination": "xxxxxxxxxx",
        "events": [
            {
                "type": "message",
                "message": {
                    "type": "sticker",
                    "id": "1",
                    "packageId": "1",
                    "stickerId": "1",
                    "stickerResourceType": "STATIC",
                    "quoteToken": "test-quote-token",
                },
                "timestamp": 1462629479859,
                "source": {"type": "user", "userId": "Utestuser1"},
                "replyToken": "test-reply-token",
                "mode": "active",
                "webhookEventId": "wh-3",
                "deliveryContext": {"isRedelivery": False},
            }
        ],
    }
    body = json.dumps(payload).encode("utf-8")
    response = client.post("/api/v1/line/webhook", content=body, headers={"x-line-signature": _sign(body)})
    assert response.status_code == 200
    assert len(sent) == 1
