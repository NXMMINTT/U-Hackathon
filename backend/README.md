# U-Ledger AI Backend (FastAPI)

Setup ทั่วไป (DB, LINE webhook, auth, My Business dashboard) ดูที่ [README.md หลัก](../README.md)

ส่วนนี้คือ endpoint ของ **Market Radar / U-Bot / B2B / เสียง / ความรู้ธุรกิจประจำวัน** ซึ่ง**ไม่ต้องมี PostgreSQL** อ่านข้อมูลจาก `../mock-data/*.json` ตรงๆ

## Setup เฉพาะส่วนนี้

```bash
cd backend
cp .env.example .env
```

แก้ `.env` ใส่:
- `UBOT_GEMINI_API_KEY` (ขอได้จาก KKU IntelSphere — gen.ai.kku.ac.th/chat)
- `ELEVENLABS_API_KEY` (สมัครฟรีได้ที่ elevenlabs.io มี free tier — ต้องใช้ voice ID จากแท็บ "My Voices" ของบัญชีตัวเอง ไม่ใช่ library voice) — ถ้าไม่ใส่ endpoint เสียงจะตอบ 503 แต่ endpoint อื่นใช้ได้ปกติ

ไฟล์ `.env` ไม่ถูก commit เข้า git

ติดตั้ง dependencies ตาม [README.md หลัก](../README.md) (`pip install -e ".[dev]"` ครอบคลุมทุก endpoint รวมส่วนนี้ด้วย)

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Endpoints

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
  ถ้ายังไม่ตั้งค่า `UBOT_GEMINI_API_KEY` ใน `.env` จะตอบ 503 กลับมาแทน

### เสียง U-Bot (ElevenLabs)
- `POST /api/voice/speak` — รับข้อความ คืนไฟล์เสียง MP3 ตรงๆ (`{"text": "..."}`)
- `POST /api/voice/ask-and-speak` — ถาม U-Bot แล้วแปลงคำตอบเป็นเสียงในขั้นตอนเดียว คืน JSON `{answer, audio_base64, audio_mime}`

### ความรู้ธุรกิจประจำวัน (Daily Business Briefing)
เนื้อหาให้ความรู้สั้นๆ แบบ "ข่าวธุรกิจ/ความรู้ประจำวัน" พูดโดย U-Bot — สุ่มหัวข้อหมุนเวียนตามวันที่ (deterministic ต่อวัน ทุกคนที่เปิดวันเดียวกันได้หัวข้อเดียวกัน) แล้วให้ Gemini แต่งสคริปต์พูดจากโครงหัวข้อใน `mock-data/daily-knowledge.json`
- `GET /api/knowledge/topics` — ดูหัวข้อทั้งหมด (7 หัวข้อ: ภาษี, การตลาด, แพลตฟอร์ม, ส่งออก, การจัดการร้าน)
- `GET /api/knowledge/daily` — สคริปต์ของวันนี้ (ข้อความอย่างเดียว)
- `GET /api/knowledge/daily/audio` — สคริปต์ของวันนี้ + เสียงพูด (ต้องมี `ELEVENLABS_API_KEY`)
- `GET /api/knowledge/topics/{topic_id}/audio` — เลือกฟังหัวข้อไหนก็ได้ ไม่ต้องรอตามวัน

### B2B Sponsored Placements
- `GET /api/b2b/sponsors` — รายการสินค้า sponsor ทั้งหมด (เช่น Thai Mart) เรียงตามที่มีในไฟล์
- `GET /api/b2b/sponsors/match?product_id=&keyword=` — กรองเฉพาะ listing ที่ตรงกับสินค้า/คีย์เวิร์ดที่กำลังดูอยู่ เรียงตาม `sponsored_rank` — ไม่ใส่ query เลยจะได้ทั้งหมด
- `POST /api/b2b/sponsors/{listing_id}/click` — บันทึกคลิกโฆษณา (เก็บ in-memory ไม่เขียนทับไฟล์ mock data, รีสตาร์ท server แล้วรีเซ็ต)

ข้อมูลทั้งหมดอ่านจากไฟล์ใน `../mock-data/` โดยตรง — แก้ schema ที่ไฟล์ mock data แล้ว API จะได้ตามนั้นทันที ไม่ต้อง sync ซ้ำ

### My Business (DB-backed — ดู MINT)
`/api/v1/dashboard/overview`, `/api/v1/tax/meter` ฯลฯ — ใช้ PostgreSQL จริง ดูรายละเอียดใน `app/routers/dashboard.py` และ [README.md หลัก](../README.md)
