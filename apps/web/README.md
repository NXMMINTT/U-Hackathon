# U-Ledger AI — Web (frontend)

Next.js (App Router) + TypeScript + Tailwind CSS. สถานะปัจจุบัน: **โครงร่างคร่าวๆ (Phase 4 เริ่มต้น)**
ส่วนใหญ่ยังเป็นข้อมูลตัวอย่าง (ระบุไว้บนหน้าจอชัดเจน) เพราะ backend ยังมีแค่ `/health`
กับ `/api/v1/line/webhook` — endpoint สำหรับ dashboard/tax/macro จะมาใน Phase 3 ของ backend

## เริ่มต้นใช้งาน

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

เปิด http://localhost:3000 — มุมบนขวาของหน้าหลักจะแสดงสถานะเชื่อมต่อ backend จริง
(เรียก `GET /health` ของ `apps/api`) ส่วนตัวเลขอื่นๆ ในหน้านี้เป็นข้อมูลตัวอย่างทั้งหมด

## หน้าที่มี

- `/` — Financial Health Check (หน้าหลัก)
- `/transactions` — รายการบันทึก (placeholder, รอ API)
- `/tax` — ความเสี่ยงภาษี / ความคืบหน้าสู่เกณฑ์ VAT (placeholder, รอ API)
- `/trends` — แนวโน้มตลาด/เศรษฐกิจ (placeholder, รอ API)

## Generate API types จาก backend

```bash
# ใน apps/api: สร้าง openapi.json จากสคีมาปัจจุบันของ FastAPI
source .venv/Scripts/activate && python scripts/export_openapi.py

# ใน apps/web: generate TypeScript types
pnpm gen:api
```

ไฟล์ที่ได้คือ `src/types/api.gen.ts` — **ห้ามแก้ไขด้วยมือ** รัน `pnpm gen:api` ใหม่แทน
(ตอนนี้ยังไม่มีหน้าไหนใช้ type ที่ generate มา เพราะ backend มี endpoint จริงแค่ `/health`
กับ webhook เท่านั้น — จะเริ่มใช้งานจริงเมื่อ dashboard API ใน Phase 3 เสร็จ)

## ที่ยังไม่ได้ทำ (รอ phase ถัดไป)

- `POST /api/v1/auth/liff` ฝั่ง backend ยังไม่มี → `lib/liff.ts` เตรียม `ensureLoggedIn()`/`getIdToken()`
  ไว้แล้ว แต่ยังไม่มีปลายทางให้แลก JWT จริง
- Vitest / Playwright ยังไม่ตั้งค่า
- Dockerfile ฝั่ง frontend ยังไม่มี (ตามแผนอยู่ phase 6)
