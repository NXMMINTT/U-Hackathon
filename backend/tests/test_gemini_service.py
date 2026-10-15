from datetime import date

import pytest

from app.services import gemini_service


class _FakeResponse:
    def __init__(self, text: str):
        self.text = text


class _FakeModels:
    def __init__(self, response_text: str):
        self._response_text = response_text
        self.last_call: dict | None = None

    def generate_content(self, *, model: str, contents: str, config) -> _FakeResponse:
        self.last_call = {"model": model, "contents": contents, "config": config}
        return _FakeResponse(self._response_text)


class _FakeClient:
    def __init__(self, response_text: str):
        self.models = _FakeModels(response_text)


@pytest.fixture(autouse=True)
def _clear_client_cache():
    gemini_service._client.cache_clear()
    yield
    gemini_service._client.cache_clear()


def test_parse_user_message_record_transactions(monkeypatch: pytest.MonkeyPatch):
    fake = _FakeClient(
        """
        {
          "intent": "record_transactions",
          "transactions": [
            {
              "type": "income",
              "amount": 3500,
              "category_hint": "ขายหน้าร้าน",
              "description": "ขายของหน้าร้าน",
              "txn_date": "2026-10-15",
              "is_personal": false,
              "confidence": 0.92
            }
          ],
          "clarification_question": null
        }
        """
    )
    monkeypatch.setattr(gemini_service, "_client", lambda: fake)

    result = gemini_service.parse_user_message("ขายของได้ 3500", today=date(2026, 10, 15))

    assert result.intent.value == "record_transactions"
    assert len(result.transactions) == 1
    assert result.transactions[0].amount == 3500
    assert fake.models.last_call["model"] == gemini_service.settings.gemini_model
    assert "2026-10-15" in fake.models.last_call["contents"]


def test_parse_user_message_other_intent_with_clarification(monkeypatch: pytest.MonkeyPatch):
    fake = _FakeClient(
        """
        {"intent": "other", "transactions": [], "clarification_question": "หมายถึงอะไรคะ"}
        """
    )
    monkeypatch.setattr(gemini_service, "_client", lambda: fake)

    result = gemini_service.parse_user_message("สวัสดี", today=date(2026, 10, 15))

    assert result.intent.value == "other"
    assert result.transactions == []
    assert result.clarification_question == "หมายถึงอะไรคะ"
