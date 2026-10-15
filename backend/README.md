# U-Ledger AI Backend (FastAPI)

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

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
- `GET /api/insights?tab=&product_id=` — insight ตามเงื่อนไข filter

ข้อมูลทั้งหมดอ่านจากไฟล์ใน `../mock-data/` โดยตรง — แก้ schema ที่ไฟล์ mock data แล้ว API จะได้ตามนั้นทันที ไม่ต้อง sync ซ้ำ
