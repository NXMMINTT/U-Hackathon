"""Calls Gemini to parse a user's LINE message into structured transaction
data. Gemini never computes tax or totals — see app/tax_engine for that.
"""

from datetime import date
from functools import lru_cache
from pathlib import Path

from google import genai
from google.genai import types

from app.core.settings import settings
from app.schemas.gemini import GeminiParseResult

_PROMPT_PATH = Path(__file__).resolve().parent.parent / "prompts" / "transaction_parser_system.md"


@lru_cache(maxsize=1)
def _system_prompt() -> str:
    return _PROMPT_PATH.read_text(encoding="utf-8")


@lru_cache(maxsize=1)
def _client() -> genai.Client:
    return genai.Client(api_key=settings.gemini_api_key)


def parse_user_message(text: str, today: date | None = None) -> GeminiParseResult:
    today = today or date.today()
    response = _client().models.generate_content(
        model=settings.gemini_model,
        contents=f"วันที่ปัจจุบัน: {today.isoformat()}\n\nข้อความจากผู้ใช้:\n{text}",
        config=types.GenerateContentConfig(
            system_instruction=_system_prompt(),
            response_mime_type="application/json",
            response_schema=GeminiParseResult,
        ),
    )
    return GeminiParseResult.model_validate_json(response.text)
