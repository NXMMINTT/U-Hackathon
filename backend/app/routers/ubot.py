from fastapi import APIRouter, HTTPException
from openai import OpenAI
from pydantic import BaseModel

from app.core.ai_provider_settings import GEMINI_API_KEY, GEMINI_BASE_URL, GEMINI_MODEL
from app.mock_data_loader import load_json

router = APIRouter(prefix="/api/ubot", tags=["ubot"])

SYSTEM_PROMPT = """คุณคือ U-Bot ผู้ช่วย AI นักวิเคราะห์การตลาดของแอป U-Ledger AI
สำหรับพ่อค้าแม่ค้าออนไลน์ SME ไทย ตอบคำถามเรื่องกำไร รายรับรายจ่าย ภาษี
และกลยุทธ์ตั้งราคาแข่งกับคู่แข่งบนแพลตฟอร์มต่างๆ โดยใช้ข้อมูลใน CONTEXT ที่ให้มาเท่านั้น
ตอบเป็นภาษาไทย กระชับ ไม่เกิน 3-4 ประโยค เน้นคำแนะนำที่ลงมือทำได้ทันที (actionable)
ถ้าถามเรื่องภาษี ให้บอกว่าตัวเลขเป็นการประมาณเบื้องต้น ควรตรวจกับผู้สอบบัญชีก่อนยื่นจริง"""


class AskRequest(BaseModel):
    question: str
    product_id: str | None = None


class AskResponse(BaseModel):
    answer: str


def build_context(product_id: str | None) -> str:
    products = load_json("products.json")
    tax = load_json("tax-status.json")
    competitor_prices = load_json("competitor-prices.json")
    keywords = load_json("keyword-volume.json")

    product = None
    if product_id:
        product = next((p for p in products if p["product_id"] == product_id), None)

    parts = [
        f"สถานะภาษี: ยอดขายสะสม {tax['cumulative_revenue']} บาท "
        f"({tax['percent_of_threshold']}% ของเพดาน VAT {tax['vat_threshold']} บาท) "
        f"ระดับความเสี่ยง {tax['risk_level']}",
        f"สินค้าทั้งหมด: {products}",
        f"ราคาคู่แข่งของสินค้า {competitor_prices['product_name']}: "
        f"{competitor_prices['competitors']}, ต้นทุนเรา {competitor_prices['my_cost_price']} บาท, "
        f"ราคาขายเรา {competitor_prices['my_selling_price']} บาท",
        f"คำค้นหายอดฮิต: {keywords}",
    ]
    if product:
        parts.insert(1, f"สินค้าที่กำลังคุยถึง: {product}")

    return "\n".join(parts)


def get_client() -> OpenAI:
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="KKU_API_KEY ยังไม่ได้ตั้งค่า — เพิ่มใน backend/.env ก่อนใช้งาน U-Bot",
        )
    return OpenAI(base_url=GEMINI_BASE_URL, api_key=GEMINI_API_KEY)


@router.post("/ask", response_model=AskResponse)
def ask(req: AskRequest):
    client = get_client()
    context = build_context(req.product_id)

    try:
        completion = client.chat.completions.create(
            model=GEMINI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "system", "content": f"CONTEXT:\n{context}"},
                {"role": "user", "content": req.question},
            ],
        )
    except Exception as exc:  # noqa: BLE001 - surface upstream error to caller
        raise HTTPException(status_code=502, detail=f"เรียก Gemini ไม่สำเร็จ: {exc}") from exc

    answer = completion.choices[0].message.content or ""
    return AskResponse(answer=answer.strip())
