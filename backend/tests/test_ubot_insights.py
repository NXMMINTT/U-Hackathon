import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.routers import ubot_insights


class _FakeCompletions:
    def __init__(self, content: str | None, fail: bool = False):
        self._content = content
        self._fail = fail

    def create(self, **kwargs):
        if self._fail:
            raise RuntimeError("KKU down")
        message = type("M", (), {"content": self._content})()
        choice = type("C", (), {"message": message})()
        return type("R", (), {"choices": [choice]})()


def _fake_client(content: str | None = None, fail: bool = False):
    completions = _FakeCompletions(content, fail)
    return type("Client", (), {"chat": type("Chat", (), {"completions": completions})()})()


@pytest.fixture(autouse=True)
def _clear_cache():
    ubot_insights._cache.clear()
    yield
    ubot_insights._cache.clear()


client = TestClient(app)


def test_rule_price_is_median_of_in_stock_thai_competitors_floored_at_margin():
    # competitor-prices.json: in-stock THB prices median = 82, cost 45 × 1.3 = 58.5
    assert ubot_insights.rule_price("P001") == 82


def test_gemini_answer_in_markdown_fences_is_used(monkeypatch: pytest.MonkeyPatch):
    answer = '```json\n{"suggested_price": 85, "reason": "ใกล้ราคากลาง", "insights": ["ข้อ 1", "ข้อ 2"]}\n```'
    monkeypatch.setattr(ubot_insights, "get_client", lambda: _fake_client(answer))

    body = client.get("/api/ubot/insights").json()

    assert body["generated_by"] == "gemini"
    assert body["suggested_price"] == 85
    assert body["insights"] == ["ข้อ 1", "ข้อ 2"]


def test_unsafe_ai_price_falls_back_to_rules(monkeypatch: pytest.MonkeyPatch):
    answer = '{"suggested_price": 30, "reason": "ขายถูก", "insights": ["ลดราคา"]}'  # below cost × 1.3
    monkeypatch.setattr(ubot_insights, "get_client", lambda: _fake_client(answer))

    body = client.get("/api/ubot/insights").json()

    assert body["generated_by"] == "rules"
    assert body["suggested_price"] == 82
    assert body["insights"]  # static insights.json for P001


def test_ai_failure_falls_back_to_rules(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(ubot_insights, "get_client", lambda: _fake_client(fail=True))

    body = client.get("/api/ubot/insights").json()

    assert body["generated_by"] == "rules"
    assert body["suggested_price"] == body["rule_price"] == 82
