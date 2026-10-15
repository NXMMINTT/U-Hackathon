"""Calls Gemini to parse a user's LINE message (text, slip image, or voice
clip) into structured transaction data. Gemini never computes tax or
totals — see app/tax_engine for that.
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


def _context(today: date | None, known_products: list[str] | None) -> str:
    today = today or date.today()
    context = f"วันที่ปัจจุบัน: {today.isoformat()}"
    if known_products:
        context += f"\nสินค้าในร้าน: {', '.join(known_products)}"
    return context


def parse_user_message(
    text: str, today: date | None = None, known_products: list[str] | None = None
) -> GeminiParseResult:
    return _generate(f"{_context(today, known_products)}\n\nข้อความจากผู้ใช้:\n{text}")


def parse_user_media(
    data: bytes, mime_type: str, today: date | None = None, known_products: list[str] | None = None
) -> GeminiParseResult:
    """Parses a slip/receipt image or a voice clip downloaded from LINE."""
    return _generate(
        [
            types.Part.from_bytes(data=data, mime_type=mime_type),
            f"{_context(today, known_products)}\n\nไฟล์แนบจากผู้ใช้ (รูปสลิป/ใบเสร็จ หรือข้อความเสียง) อยู่ด้านบน",
        ]
    )


def _generate(contents: str | list) -> GeminiParseResult:
    response = _client().models.generate_content(
        model=settings.gemini_model,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=_system_prompt(),
            response_mime_type="application/json",
            response_schema=GeminiParseResult,
        ),
    )
    return GeminiParseResult.model_validate_json(response.text)
