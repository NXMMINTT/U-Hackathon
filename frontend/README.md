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
  สินค้าขายดี 3 อันดับ, กราฟ 30 วัน, แจ้งเตือนเทรนด์, แพ็กเกจปัจจุบัน
- `/transactions` — รายการบันทึกล่าสุด; รายการที่รอยืนยันกด แก้ไข / ยกเลิก / ยืนยัน ได้
  (`?edit=<id>` เปิดฟอร์มแก้ไข — ปุ่ม "แก้ไข" ใน Flex card ลิงก์มาที่นี่เมื่อตั้ง LIFF แล้ว)
- `/stock` — สต็อกสินค้าคงเหลือและต้นทุนต่อหน่วย
- `/market` — **Market Radar** (mock data จาก `mock-data/` ผ่าน backend):
  - `/market` ภาพรวม: Price Radar + ราคาแนะนำ/คำแนะนำจาก U-Bot (Gemini), เทรนด์ข้ามแพลตฟอร์ม, คีย์เวิร์ด, ตลาดยุโรป, B2B Sponsored
  - `/market/trends`, `/market/products/[id]` — เทรนด์ตลาดและหน้าสินค้า (ย้ายมาจาก branch NIGHT)
  - `/market/compare` — เทียบราคาคู่แข่ง + คำนวณกำไร
  - `/market/chat` — แชทกับ U-Bot พร้อมปุ่มฟังเสียง (ElevenLabs)
  - `/market/platforms`, `/market/plans` — เลือกแพลตฟอร์ม, แพ็กเกจ Free/Premium
- `/welcome` — หน้าแรก (landing)

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

- **LIFF login**: สร้าง Channel + LIFF app แล้ว (Provider "U-renger" → "U-Ledger AI Web" → LIFF app
  "U-Ledger AI Dashboard") ทดสอบแล้วว่า backend อ่านค่า `LIFF_ID` ถูกต้อง (error เปลี่ยนจาก
  `liff_not_configured` เป็น `invalid_id_token` ตามที่ควรจะเป็นเมื่อยังไม่มี id_token จริง) —
  **เหลือ**: deploy เว็บขึ้นจริง แล้วกลับไปแก้ **Endpoint URL** ของ LIFF app (ตอนนี้เป็น
  placeholder `https://example.com`) ให้เป็น URL จริง ถึงจะ login ผ่านแอป LINE บนมือถือได้
  (จนกว่าจะ deploy เสร็จ dev ใช้ `DASHBOARD_LINE_USER_ID` ใน backend/.env แทนการ login ได้ตามปกติ)
- Dark mode (มีใน branch NIGHT แต่สีในโปรเจกต์ยังเป็นค่าตายตัว)
- Vitest / Playwright ยังไม่ตั้งค่า
- Dockerfile ฝั่ง frontend ยังไม่มี (ตามแผนอยู่ phase 6)
