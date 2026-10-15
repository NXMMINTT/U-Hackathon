# U-Ledger AI — Web (frontend)

Next.js (App Router) + TypeScript + Tailwind CSS + Recharts แบ่งเป็น 2 Tabs ตาม spec:
**My Business** (ใช้ข้อมูลจริงจาก API แล้ว) และ **Market Radar** (ยังเป็น placeholder)

## เริ่มต้นใช้งาน

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

เปิด http://localhost:3000 — ถ้าไม่ได้ตั้ง `NEXT_PUBLIC_LIFF_ID` (และฝั่ง API ไม่ได้ตั้ง `LIFF_ID`)
หน้าเว็บจะแสดงข้อมูลร้านสาธิตจาก `scripts/seed_demo.py` โดยไม่ต้อง login
ถ้าตั้ง LIFF แล้ว เว็บจะ login ผ่าน LINE แล้วแลก ID token เป็น JWT ที่ `POST /api/v1/auth/line`

## หน้าที่มี

- `/` — **My Business**: Tax Meter (เขียว/เหลือง/แดง), รายรับ-รายจ่าย-กำไรเดือนนี้,
  สินค้าขายดี 3 อันดับ, กราฟ 30 วัน
- `/transactions` — รายการบันทึกล่าสุด (ทั้งที่ยืนยันแล้วและรอยืนยัน)
- `/stock` — สต็อกสินค้าคงเหลือและต้นทุนต่อหน่วย
- `/market` — **Market Radar** (placeholder)

## Generate API types จาก backend

```bash
# ใน backend/: สร้าง openapi.json จากสคีมาปัจจุบันของ FastAPI
source .venv/Scripts/activate && python scripts/export_openapi.py

# ใน frontend/: generate TypeScript types
pnpm gen:api
```

ไฟล์ที่ได้คือ `src/types/api.gen.ts` — **ห้ามแก้ไขด้วยมือ** รัน `pnpm gen:api` ใหม่แทน
(`src/hooks/useDashboard.ts` ใช้ type จากไฟล์นี้)

## ที่ยังไม่ได้ทำ (รอ phase ถัดไป)

- หน้าแก้ไขรายการ (ปุ่ม "แก้ไข" ใน Flex card ลิงก์ไป `/transactions?edit=<id>` แต่ยังไม่มีฟอร์มแก้ไข)
- Tab 2 Market Radar ทั้งหมด
- Vitest / Playwright ยังไม่ตั้งค่า
- Dockerfile ฝั่ง frontend ยังไม่มี (ตามแผนอยู่ phase 6)
