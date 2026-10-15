from datetime import date

import pytest

from app.services import gemini_service


class _FakeMessage:
    def __init__(self, content: str):
        self.content = content


class _FakeChoice:
    def __init__(self, content: str):
        self.message = _FakeMessage(content)


class _FakeCompletionResponse:
    def __init__(self, content: str):
        self.choices = [_FakeChoice(content)]


class _FakeCompletions:
    def __init__(self, response_text: str):
        self._response_text = response_text
        self.last_call: dict | None = None

    def create(self, *, model: str, messages: list, response_format: dict) -> _FakeCompletionResponse:
        self.last_call = {"model": model, "messages": messages, "response_format": response_format}
        return _FakeCompletionResponse(self._response_text)


class _FakeChat:
    def __init__(self, response_text: str):
        self.completions = _FakeCompletions(response_text)


class _FakeClient:
    def __init__(self, response_text: str):
        self.chat = _FakeChat(response_text)


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
    last_call = fake.chat.completions.last_call
    assert last_call["model"] == gemini_service.GEMINI_MODEL
    user_message = last_call["messages"][1]
    assert "2026-10-15" in user_message["content"][0]["text"]


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
