"""Calls Gemini to parse a user's LINE message (text, slip image, or voice
clip) into structured transaction data. Gemini never computes tax or
totals — see app/tax_engine for that.

NOTE: this currently goes through the KKU IntelSphere OpenAI-compatible
proxy (same account as app/routers/ubot.py) instead of a native Google AI
Studio key, since that's the only Gemini access the team has for testing
right now. Swap back to google-genai + settings.gemini_api_key once a real
Google API key is available — the google-genai client's response_schema
support is stricter than the JSON-mode fallback used here.
"""

import base64
import json
from datetime import date
from functools import lru_cache
from pathlib import Path

from openai import OpenAI

from app.config import GEMINI_BASE_URL, GEMINI_API_KEY, GEMINI_MODEL
from app.schemas.gemini import GeminiParseResult

_PROMPT_PATH = Path(__file__).resolve().parent.parent / "prompts" / "transaction_parser_system.md"


@lru_cache(maxsize=1)
def _system_prompt() -> str:
    return _PROMPT_PATH.read_text(encoding="utf-8")


@lru_cache(maxsize=1)
def _client() -> OpenAI:
    return OpenAI(base_url=GEMINI_BASE_URL, api_key=GEMINI_API_KEY)


def _context(today: date | None, known_products: list[str] | None) -> str:
    today = today or date.today()
    context = f"วันที่ปัจจุบัน: {today.isoformat()}"
    if known_products:
        context += f"\nสินค้าในร้าน: {', '.join(known_products)}"
    return context


def parse_user_message(
    text: str, today: date | None = None, known_products: list[str] | None = None
) -> GeminiParseResult:
    prompt = f"{_context(today, known_products)}\n\nข้อความจากผู้ใช้:\n{text}"
    return _generate([{"type": "text", "text": prompt}])


def parse_user_media(
    data: bytes, mime_type: str, today: date | None = None, known_products: list[str] | None = None
) -> GeminiParseResult:
    """Parses a slip/receipt image or a voice clip downloaded from LINE."""
    prompt = (
        f"{_context(today, known_products)}\n\n"
        "ไฟล์แนบจากผู้ใช้ (รูปสลิป/ใบเสร็จ หรือข้อความเสียง) อยู่ด้านบน"
    )
    b64 = base64.b64encode(data).decode("ascii")

    if mime_type.startswith("audio/"):
        media_part = {
            "type": "input_audio",
            "input_audio": {"data": b64, "format": mime_type.split("/")[-1]},
        }
    else:
        media_part = {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{b64}"}}

    return _generate([media_part, {"type": "text", "text": prompt}])


def _generate(content: list[dict]) -> GeminiParseResult:
    schema = GeminiParseResult.model_json_schema()
    response = _client().chat.completions.create(
        model=GEMINI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    f"{_system_prompt()}\n\n"
                    "ตอบเป็น JSON object ล้วนๆ เท่านั้น ตรงตาม JSON schema นี้ "
                    f"ห้ามมีข้อความอื่นปนมา:\n{json.dumps(schema, ensure_ascii=False)}"
                ),
            },
            {"role": "user", "content": content},
        ],
        response_format={"type": "json_object"},
    )
    raw = response.choices[0].message.content or "{}"
    return GeminiParseResult.model_validate_json(raw)
