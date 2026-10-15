# U-Ledger AI Backend (FastAPI)

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

แก้ `.env` ใส่ `GEMINI_API_KEY` ของตัวเอง (ขอได้จาก KKU IntelSphere — gen.ai.kku.ac.th/chat) — ไฟล์นี้ไม่ถูก commit เข้า git

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Endpoints

### My Business
- `GET /api/products` — รายการสินค้า
- `GET /api/products/{product_id}` — สินค้ารายชิ้น
- `GET /api/transactions` — รายรับ/รายจ่าย
- `GET /api/tax-status` — Tax Meter

### Market Radar
- `GET /api/market/platforms` — รายชื่อแพลตฟอร์มทั้งหมด (~60)
- `GET /api/market/competitor-prices` — ราคาคู่แข่งข้ามแพลตฟอร์ม
- `GET /api/market/trend` — ยอดขายรายสัปดาห์ Omni-channel
- `GET /api/market/keyword-volume` — คำค้นหายอดฮิต
- `GET /api/market/eu-arbitrage` — โอกาสตลาดยุโรป

### Insights (U-Bot)
- `GET /api/insights?tab=&product_id=` — insight ตัวอย่างแบบ static (filter ได้)
- `POST /api/ubot/ask` — ถาม U-Bot จริงผ่าน Gemini (KKU IntelSphere) โดยอัตโนมัติประกอบ context จาก mock data ทั้งหมด (ภาษี, ราคาคู่แข่ง, คำค้นหา) ให้ก่อนส่งคำถาม
  ```bash
  curl -X POST http://localhost:8000/api/ubot/ask \
    -H "Content-Type: application/json" \
    -d '{"question":"ตอนนี้ควรปรับราคาน้ำพริกไหม","product_id":"P001"}'
  ```
  ถ้ายังไม่ตั้งค่า `GEMINI_API_KEY` ใน `.env` จะตอบ 503 กลับมาแทน

### B2B Sponsored Placements
- `GET /api/b2b/sponsors` — รายการสินค้า sponsor ทั้งหมด (เช่น Thai Mart) เรียงตามที่มีในไฟล์
- `GET /api/b2b/sponsors/match?product_id=&keyword=` — กรองเฉพาะ listing ที่ตรงกับสินค้า/คีย์เวิร์ดที่กำลังดูอยู่ เรียงตาม `sponsored_rank` — ไม่ใส่ query เลยจะได้ทั้งหมด
- `POST /api/b2b/sponsors/{listing_id}/click` — บันทึกคลิกโฆษณา (เก็บ in-memory ไม่เขียนทับไฟล์ mock data, รีสตาร์ท server แล้วรีเซ็ต)

ข้อมูลทั้งหมดอ่านจากไฟล์ใน `../mock-data/` โดยตรง — แก้ schema ที่ไฟล์ mock data แล้ว API จะได้ตามนั้นทันที ไม่ต้อง sync ซ้ำ
