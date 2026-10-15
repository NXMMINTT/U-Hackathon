# U-Ledger AI

MVP สำหรับ U-Hackathon 2026 — ผู้ช่วยบันทึกบัญชีและภาษีสำหรับร้านค้ารายย่อยผ่าน LINE (Zero-UI)
พร้อม Web Dashboard (Next.js + LIFF) สำหรับดูสุขภาพการเงิน ความเสี่ยงภาษี และข้อมูลเศรษฐกิจมหภาค

> สถานะปัจจุบัน: **Phase 1 — Scaffold** (โครงโปรเจกต์, docker-compose, models + migration,
> `tax_engine` พร้อม unit tests, seed script ตัวอย่าง). ส่วน LINE webhook, Gemini parsing,
> dashboard และ U-Bot analytics จะตามมาใน phase ถัดไป

## โครงสร้างโปรเจกต์

```
u-ledger-ai/
├── docker-compose.yml   # PostgreSQL
├── .env.example
└── apps/
    ├── api/             # FastAPI backend
    │   ├── app/
    │   │   ├── core/        # settings, db session, logging
    │   │   ├── models/      # SQLAlchemy models
    │   │   ├── tax_engine/  # pure functions, config-driven ผ่าน config/tax_rules.yaml
    │   │   ├── schemas/ routers/ services/ analytics/ line_messages/ prompts/  (phase ถัดไป)
    │   │   └── main.py
    │   ├── alembic/
    │   ├── config/tax_rules.yaml
    │   ├── scripts/seed_demo.py
    │   └── tests/
    └── web/             # Next.js + LIFF (ยังไม่สร้าง — phase 4)
```

## เริ่มต้นใช้งาน (Phase 1)

1. คัดลอกไฟล์ environment:
   ```bash
   cp .env.example .env
   ```
2. สตาร์ท PostgreSQL:
   ```bash
   docker compose up -d
   ```
3. ติดตั้ง dependencies ของ API (ใช้ Python 3.12):
   ```bash
   cd apps/api
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -e ".[dev]"
   ```
4. รัน migration:
   ```bash
   alembic upgrade head
   ```
5. สร้างข้อมูลตัวอย่าง (ร้านสาธิต + รายการย้อนหลัง 6 เดือน):
   ```bash
   python scripts/seed_demo.py
   ```
6. รันเทส `tax_engine`:
   ```bash
   pytest -q
   ```
7. รัน API (health check ที่ `/health`):
   ```bash
   uvicorn app.main:app --reload
   ```

## หมายเหตุ

- ตัวเลขภาษีทั้งหมดอยู่ใน `apps/api/config/tax_rules.yaml` — ห้าม hardcode logic ภาษีในโค้ด
- `tax_engine/` เป็น pure functions ล้วน ไม่ติดต่อฐานข้อมูลหรือ side effects
- LINE Messaging API, Gemini parsing, Next.js dashboard, macro-data และ U-Bot analytics จะเพิ่มใน phase ถัดไปตามที่ระบุใน spec
