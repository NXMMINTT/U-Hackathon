# Mock Data Schema

Mock data สำหรับ demo U-Ledger AI แบ่งตาม 2 Tab หลักของแดชบอร์ด ทุกไฟล์ผูกกันด้วย `product_id`

## ทุก Tab (เพิ่มเติม)

- `platforms.json` — รายชื่อแพลตฟอร์มอีคอมเมิร์ซ ~60 แพลตฟอร์ม ครอบคลุมไทย/SEA/Global/Europe/เอเชียตะวันออกเฉียงเหนือ/ตะวันออกกลาง-แอฟริกา-อินเดีย ใช้เป็น master list สำหรับ dropdown filter หรือ badge แสดงความครอบคลุมของระบบ (`platform_id` ใช้ผูกกับ `competitor-prices.json`/`market-trend.json`)

## Tab 1: My Business

- `products.json` — แคตตาล็อกสินค้า (ต้นทุน, ราคาขาย, สต็อก)
- `transactions.json` — รายรับ/รายจ่าย ที่มาจาก LINE OCR สลิป, เสียง, หรือกรอกมือ (`source`: `line_slip_ocr` | `line_voice` | `manual`)
- `tax-status.json` — สถานะ Tax Meter เทียบเพดาน VAT 1.8 ล้านบาท (`risk_level`: `green` | `yellow` | `red`)

## Tab 2: Market Radar

- `competitor-prices.json` — ราคาคู่แข่งต่อสินค้า 1 ชิ้น ข้ามแพลตฟอร์ม พร้อม `my_cost_price`/`my_selling_price` ไว้ปักหมุดเทียบ และ `price_distribution_thb` สำหรับกราฟ distribution
- `market-trend.json` — ยอดขายรายสัปดาห์แยกตามแพลตฟอร์ม (Omni-Channel trend)
- `keyword-volume.json` — ปริมาณการค้นหาคำยอดฮิตต่อแพลตฟอร์ม
- `eu-arbitrage.json` — โอกาสตลาดยุโรป (ราคาขายแนะนำ + demand score)

## ทุก Tab

- `insights.json` — ข้อความสรุปจาก U-Bot ต่อ insight หนึ่งเรื่อง ผูกกับ `tab` (`my_business` | `market_radar`) และ `related_product_id` — ทีม AI generate ข้อความใหม่แทนที่ array นี้ได้โดยไม่ต้องเปลี่ยน field
- `b2b-sponsors.json` — สินค้า sponsor จากพาร์ทเนอร์ค้าส่ง B2B (เช่น Thai Mart) ที่จะโชว์แทรกในหน้า Market Radar เมื่อ `target_product_ids`/`target_keywords` ตรงกับสินค้า/เทรนด์ที่ผู้ใช้กำลังดู เรียงการแสดงผลตาม `sponsored_rank` (เลขน้อยแสดงก่อน)
- `daily-knowledge.json` — หัวข้อความรู้ธุรกิจสำหรับฟีเจอร์ "ข่าวธุรกิจ/อบรมฟรีประจำวัน" แต่ละหัวข้อมี `outline` (ประเด็นคร่าวๆ) ให้ Gemini แต่งเป็นสคริปต์พูดแล้วแปลงเป็นเสียงด้วย ElevenLabs ผ่าน `/api/knowledge/*`

## กติกาการแก้ไข

- ถ้าจะเพิ่ม field ใหม่ แจ้งในกลุ่มก่อน กัน frontend/backend/AI ใช้ field คนละชื่อ
- `product_id` ต้องตรงกันทุกไฟล์ (P001, P002, P003 ตาม `products.json`)
