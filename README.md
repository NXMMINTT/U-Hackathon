# U-Ledger AI

MVP สำหรับ U-Hackathon 2026 — Market Intelligence Platform สำหรับ SME
ใช้บัญชี Zero-UI ผ่าน LINE เป็นตัวดึงผู้ใช้เข้าระบบ แล้วต่อยอดเป็น Web Dashboard (Next.js + LIFF) แบบ 2 Tabs

> สถานะปัจจุบัน: **Tab 1 — My Business เสร็จแล้ว**
> - LINE: บันทึกรายรับ-รายจ่ายจาก **ข้อความ / รูปสลิป-ใบเสร็จ / ข้อความเสียง** (Gemini) → การ์ดยืนยัน →
>   **ตัดสต็อกอัตโนมัติ** เมื่อยืนยันการขาย และเพิ่มสต็อกพร้อมบันทึกต้นทุนเมื่อยืนยันการซื้อ
> - Dashboard: Tax Meter (เขียว/เหลือง/แดง), รายรับ-รายจ่าย-กำไรสุทธิ, สินค้าขายดี 3 อันดับ, สต็อก
> - Tab 2 Market Radar, U-Bot Market Analyst และ B2B Sponsored ยังไม่ได้ทำ

## โครงสร้างโปรเจกต์

```
u-ledger-ai/
├── backend/             # FastAPI + PostgreSQL + LINE Bot (Python 3.12)
│   ├── app/
│   │   ├── core/          # settings, db session, errors
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic request/response
│   │   ├── routers/       # API endpoints + LINE webhook
│   │   ├── services/      # business logic (Gemini, LINE, สต็อก, auth)
│   │   ├── analytics/     # สรุปภาพรวมสำหรับ dashboard
│   │   ├── line_messages/ # Flex message templates
│   │   ├── prompts/       # system prompts ของ Gemini
│   │   ├── locales/       # ข้อความภาษาไทย
│   │   ├── tax_engine/    # pure functions, config-driven ผ่าน config/tax_rules.yaml
│   │   └── main.py
│   ├── alembic/           # migrations
│   ├── config/tax_rules.yaml
│   ├── scripts/           # seed_demo.py, export_openapi.py
│   ├── tests/
│   └── .env.example
├── frontend/            # Next.js + LIFF dashboard (ดู frontend/README.md)
│   ├── src/
│   │   ├── app/           # หน้าเว็บ (App Router)
│   │   ├── components/    # UI components
│   │   └── hooks/ lib/ locales/ types/
│   └── .env.example
└── docker-compose.yml   # PostgreSQL
```

## Backend

1. สตาร์ท PostgreSQL (ที่ root ของโปรเจกต์):
   ```bash
   docker compose up -d
   ```
2. เข้าโฟลเดอร์ backend แล้วคัดลอกไฟล์ environment:
   ```bash
   cd backend
   cp .env.example .env
   ```
3. ติดตั้ง dependencies (ใช้ Python 3.12):
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -e ".[dev]"
   ```
4. รัน migration:
   ```bash
   alembic upgrade head
   ```
5. สร้างข้อมูลตัวอย่าง (ร้านของฝากสาธิต + สินค้า/สต็อก + รายการตั้งแต่ต้นปี ให้ Tax Meter อยู่โซนเหลือง):
   ```bash
   python scripts/seed_demo.py          # เพิ่ม --reset เพื่อลบร้านสาธิตเดิมแล้วสร้างใหม่
   ```
6. รันเทส `tax_engine`:
   ```bash
   pytest -q
   ```
7. รัน API (health check ที่ `/health`, เอกสาร API ที่ `/docs`):
   ```bash
   uvicorn app.main:app --reload
   ```
   ถ้าไม่ได้ตั้ง `LIFF_ID` endpoint ของ dashboard จะคืนข้อมูลร้านสาธิตโดยไม่ต้อง login (สำหรับ dev/เดโม)
   — **ก่อนใช้งานจริงต้องตั้ง `LIFF_ID` และ `JWT_SECRET` ที่ยาวอย่างน้อย 32 ตัวอักษร**

## Frontend

```bash
cd frontend
cp .env.example .env.local
pnpm install
pnpm dev        # http://localhost:3000
```

รายละเอียดเพิ่มเติม: [frontend/README.md](frontend/README.md)

## หมายเหตุ

- ตัวเลขภาษีทั้งหมดอยู่ใน `backend/config/tax_rules.yaml` — ห้าม hardcode logic ภาษีในโค้ด
- `tax_engine/` เป็น pure functions ล้วน ไม่ติดต่อฐานข้อมูลหรือ side effects
- รูปสลิป/ไฟล์เสียงจาก LINE เก็บไว้ที่ `backend/uploads/` (อยู่ใน .gitignore)
