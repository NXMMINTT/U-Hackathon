import Link from "next/link";

import { type FoxPose, LineAddFriendButton, Logo, UBot, UBotFace } from "@/components/brand";
import { ReceiptEdge } from "@/components/doodles";
import { ChatMarquee, TaxPlayground, TypingChat, UBotLive } from "@/components/playful";
import { StepDemo } from "@/components/StepDemo";

// Public home page. Structure follows parnuan.com: a mascot + real LINE chat hero, numbered
// feature steps next to a visual, sections joined by chat bubbles, then pricing, FAQ and a final CTA.
// Kept clean on purpose (no tilts or doodles); U-Bot and the LINE chat carry the personality.

const NAV = [
  { href: "#ledger", label: "จดบัญชี" },
  { href: "#tax", label: "ภาษี" },
  { href: "#radar", label: "Market Radar" },
  { href: "#pricing", label: "ราคา" },
  { href: "#faq", label: "ถามบ่อย" },
];

const THINGS_PEOPLE_TYPE = [
  "ขายน้ำพริก 20 กระปุก 1780",
  "ค่าส่ง Kerry 245",
  "สรุป",
  "ซื้อพริกแห้ง 2 กระสอบ 900",
  "ปีนี้ใกล้ต้องจด VAT ยัง",
  "สบู่มะกรูดเหลือกี่ก้อน",
  "เดือนนี้กำไรเท่าไหร่",
  "ค่ากล่อง 50 ใบ 350",
];

export default function HomePage() {
  return (
    <div className="overflow-x-clip text-ink">
      <header className="sticky top-0 z-20 bg-white/95 shadow-[0_1px_0_#E6EEF9] backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-3">
          <Logo />
          <nav aria-label="เมนูหลัก" className="hidden flex-wrap text-base lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="inline-flex min-h-[44px] items-center px-3.5 font-medium text-ink-body no-underline hover:text-brand">
                {n.label}
              </a>
            ))}
          </nav>
          <Link href="/dashboard" className="inline-flex min-h-[44px] items-center rounded-full bg-brand px-6 font-bold text-white no-underline hover:bg-brand-dark">
            เข้าใช้งาน
          </Link>
        </div>
      </header>

      <Hero />

      <div className="bg-sky">
        <div className="border-y border-sky-line bg-white/60 py-3">
          <ChatMarquee items={THINGS_PEOPLE_TYPE} />
        </div>

        <StepSection
          id="ledger"
          title={<>จดบัญชี<br />แบบคน<span className="text-brand">ขี้เกียจ</span></>}
          intro="ไม่ต้องเปิด Excel ไม่ต้องหาสมุด ทักแชทเหมือนคุยกับเพื่อน U-Bot แปลงเป็นบัญชีและตัดสต็อกให้"
          steps={[
            ["พิมพ์เหมือนแชทปกติ", "“ขายน้ำพริก 20 กระปุก 1780” แล้ว U-Bot แยกรายรับ รายจ่าย และสินค้าให้"],
            ["ถ่ายรูปสลิปส่งมา", "U-Bot อ่านยอดเงินจากรูป แล้วส่งการ์ดมาให้กดยืนยันทีเดียว"],
            ["ขี้เกียจพิมพ์? อัดเสียงเลย", "ขับรถส่งของอยู่ก็จดได้ พูดว่า “ซื้อพริกแห้ง 2 กระสอบ 900”"],
          ]}
          visuals={[<TextScreen key="text" />, <SlipScreen key="slip" />, <VoiceScreen key="voice" />].map((screen) => (
            <Phone key={screen.key}>{screen}</Phone>
          ))}
          decor={<UBot pose="ledger" size={150} className="absolute -bottom-6 -right-20 z-[1] max-sm:-right-2 max-sm:w-[110px]" />}
        />
        <TypingChat bot="ยอดขายเยอะขึ้น กลัวโดนภาษีย้อนหลังไหมคะ?" user="กลัวมาก ช่วยด้วยยย" />
        <StepSection
          id="tax"
          title={<>เพดานภาษี<br /><span className="text-brand">ไม่ต้องลุ้นเอง</span></>}
          intro="แพลตฟอร์มต้องส่งข้อมูลรายได้ให้สรรพากรแล้ว U-Bot คอยเฝ้ายอดขายของคุณเทียบเพดาน VAT 1.8 ล้านบาทให้ทุกวัน"
          steps={[
            ["มิเตอร์ภาษี เขียว เหลือง แดง", "เห็นทันทีว่ายอดขายสะสมใกล้ 1.8 ล้านบาทแค่ไหน"],
            ["เตือนใน LINE ล่วงหน้า", "ทุกครั้งที่ยอดขายข้ามโซน U-Bot ทักไปบอกพร้อมสิ่งที่ต้องเตรียม"],
            ["สรุปกำไร พร้อมยื่น", "รายรับ รายจ่าย กำไรสุทธิ และสินค้าขายดี ดูได้ในหน้าเว็บ"],
          ]}
          visuals={[
            <TaxPlayground key="meter" />,
            <Phone key="alert">
              <TaxAlertScreen />
            </Phone>,
            <ProfitSummary key="summary" />,
          ]}
          visualFirst
        />
        <TypingChat bot="แล้วรู้ไหมคะว่าคู่แข่งขายสินค้าแบบเดียวกันเท่าไหร่?" user="ไม่รู้เลย แอบส่องให้หน่อย" />
        <StepSection
          id="radar"
          premium
          title={<>ส่องราคาคู่แข่ง<br /><span className="text-brand">แบบเนียนๆ</span></>}
          intro="Market Radar เทียบราคาคู่แข่งทุกแพลตฟอร์มกับต้นทุนจริงที่คุณจดไว้ แล้ว U-Bot บอกว่าควรตั้งราคาเท่าไหร่"
          steps={[
            ["ราคาที่ขายออกและยังกำไร", "ปักหมุดต้นทุนของร้านบนกราฟราคาคู่แข่ง เห็นช่องว่างทันที"],
            ["ควรไปขายที่ไหน", "ยอดขายสินค้าแบบเดียวกันบน Shopee, Lazada, TikTok Shop, Amazon และอื่นๆ"],
            ["คำค้นยอดฮิต และโอกาสส่งออกยุโรป", "ใช้ตั้งชื่อสินค้า ยิงโฆษณา หรือหาตลาดใหม่"],
          ]}
          visuals={[<RadarScreen key="price" />, <WhereToSellScreen key="where" />, <KeywordScreen key="keywords" />].map((screen) => (
            <Phone key={screen.key}>{screen}</Phone>
          ))}
          decor={<UBot pose="radar" size={150} className="absolute -bottom-6 -left-24 z-[1] max-sm:-left-6" />}
        />

        <section aria-label="ฟีเจอร์อื่นๆ" className="px-6 pb-24">
          <div className="mx-auto flex max-w-[1100px] flex-col gap-10">
            <div className="flex flex-col items-center gap-4 rounded-[32px] bg-white p-9 text-center">
              <h2 className="m-0 text-[28px] font-bold">
                จดกับ U-Bot วันนี้ แล้วรู้ว่าร้าน<span className="text-brand">กำไรจริง</span>เท่าไหร่
              </h2>
              <LineAddFriendButton />
            </div>
            <div className="flex flex-col gap-8 rounded-[36px] bg-white px-6 py-11 md:px-9">
              <h2 className="m-0 text-center text-[38px] font-bold leading-tight">
                นอกจากนี้ U-Bot <span className="text-brand">ทำได้อีกเยอะ</span>
              </h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-6">
                <FeatureCard fox="commerce" title="ตัดสต็อกอัตโนมัติ" body="ยืนยันการขายแล้วสต็อกลดเอง ซื้อของเข้าก็บันทึกต้นทุนให้" tag="ขายไป 20 · เหลือ 120">
                  <MiniPhone>
                    <b>สต็อกสินค้า</b>
                    <Row k="น้ำพริกตาแดง" v="120" />
                    <Row k="กระเป๋าผ้าทอ" v="40" />
                    <Row k="สบู่มะกรูด" v="300" />
                  </MiniPhone>
                </FeatureCard>
                <FeatureCard fox="idea" title="สรุปยอดทุกวัน" body="พิมพ์ “สรุป” U-Bot ตอบยอดขาย รายจ่าย และกำไรของวันนี้ทันที" tag="พิมพ์คำเดียว" tagLeft>
                  <MiniPhone chat>
                    <span className="self-end rounded-xl bg-chat px-2.5 py-1">สรุป</span>
                    <div className="rounded-xl bg-white px-2.5 py-2">
                      <b>วันนี้</b>
                      <div>รายรับ ฿4,630</div>
                      <div>รายจ่าย ฿1,145</div>
                      <b className="text-brand">กำไร ฿3,485</b>
                    </div>
                  </MiniPhone>
                </FeatureCard>
                <FeatureCard fox="line" title="U-Bot ตอบเป็นเสียง" body="ถามเรื่องกำไร ภาษี หรือราคา แล้วฟังคำตอบได้ ไม่ต้องอ่าน" tag="เดือนนี้กำไรเท่าไหร่?">
                  <div className="grid h-full place-items-center">
                    <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-[0_10px_24px_rgba(26,111,214,.12)]">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                      <span className="flex items-center gap-1" aria-hidden="true">
                        {[12, 24, 16, 30, 18, 26, 12, 20].map((h, i) => (
                          <span key={i} className={`w-1 rounded-sm ${i % 2 ? "bg-brand" : "bg-brand-light"}`} style={{ height: h }} />
                        ))}
                      </span>
                      <b>0:12</b>
                    </div>
                  </div>
                </FeatureCard>
                <FeatureCard fox="global" title="วัตถุดิบราคาส่งจากพาร์ทเนอร์" body="ตอนสินค้าของคุณกำลังมาแรง ร้านค้าส่งอย่าง Thai Mart เสนอวัตถุดิบให้ตุนก่อน">
                  <div className="grid h-full place-items-center">
                    <div className="flex w-[290px] flex-col gap-1 rounded-[20px] bg-white px-5 py-4 text-[15px] shadow-[0_10px_24px_rgba(26,111,214,.12)]">
                      <span className="self-start rounded-full bg-sun-soft px-2.5 py-0.5 text-xs font-bold text-sun-ink">ผู้สนับสนุน · Thai Mart</span>
                      <b>พริกแห้งเกรดเอ 5 กก.</b>
                      <Row k="ขั้นต่ำ 2 กระสอบ" v="฿450" />
                    </div>
                  </div>
                </FeatureCard>
              </div>
            </div>
          </div>
        </section>

        <Pricing />
        <Faq />

        <section aria-label="เริ่มใช้งาน" className="px-6 pb-24">
          <div className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-5 overflow-hidden rounded-[36px] bg-white px-9 py-14 text-center">
            <h2 className="m-0 text-[40px] font-bold leading-tight">
              เริ่มจดกับ U-Bot
              <br />
              แล้วรู้ว่าร้าน<span className="text-brand">ควรขายเท่าไหร่</span>
            </h2>
            <p className="m-0 text-ink-muted">เพิ่มเพื่อน U-Bot บน LINE แล้วส่งรายการแรกได้เลยวันนี้</p>
            <UBotLive size={200} wave bubbleSide="right" />
            <LineAddFriendButton />
          </div>
        </section>
      </div>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-6 py-10 text-[15px]">
          <div className="flex items-center gap-3">
            <UBotFace size={44} />
            <div>
              <div className="text-[22px] font-extrabold text-brand">U-Ledger AI</div>
              <div className="text-ink-muted">“คู่ธุรกิจ SME ที่รู้ทั้งตัวเลข และทั้งโลก”</div>
            </div>
          </div>
          <div className="text-ink-muted">U-Hackathon 2026 · Future of Finance &amp; Community</div>
        </div>
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <section aria-label="U-Ledger AI" className="relative bg-white">
      {/* header + hero fit one screen on desktop */}
      <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-12 px-6 py-8 lg:h-[calc(100svh-68px)] lg:min-h-[520px] lg:flex-nowrap lg:py-6">
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5">
          <span className="self-start rounded-full bg-brand-soft px-3.5 py-1 text-[15px] font-semibold text-brand">
            U-Bot ผู้ช่วยบัญชีประจำร้านใน LINE
          </span>
          <h1 className="m-0 text-[38px] font-extrabold leading-[1.25] tracking-tight md:text-[48px]">
            ขายของอย่างเดียว
            <br />
            เรื่องบัญชีให้ <span className="text-brand">U-Bot จัดการ</span>
          </h1>
          <p className="m-0 max-w-[520px] text-lg text-ink-body">
            ส่งสลิป พิมพ์ หรืออัดเสียงในแชท U-Bot จดบัญชี ตัดสต็อก เฝ้าเพดานภาษี แล้วยังแอบไปส่องราคาคู่แข่งมาให้ด้วย
          </p>
          <div className="flex flex-wrap items-end gap-x-12 gap-y-6">
            <div>
              <div className="text-[15px] text-ink-muted">เฝ้าเพดาน VAT ให้</div>
              <div className="text-[40px] font-extrabold leading-tight text-brand">฿1.8 ล้าน</div>
            </div>
            <div>
              <div className="text-[15px] text-ink-muted">ส่องราคาคู่แข่ง</div>
              <div className="text-[40px] font-extrabold leading-tight text-brand">
                60+ <span className="text-lg font-semibold text-ink">แพลตฟอร์ม</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1.5">
            <LineAddFriendButton label="เพิ่มเพื่อน U-Bot ฟรี" />
            <span className="text-[15px] text-ink-muted">จดบัญชีฟรีตลอด · Market Radar ลองฟรี 7 วัน</span>
          </div>
        </div>

        <div className="relative flex min-w-0 flex-[1_1_520px] justify-center">
          <div className="relative">
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-soft to-white max-lg:hidden" />
            <div className="relative">
              <Phone tall>
                <ChatScreen />
              </Phone>
            </div>
            <UBotLive size={180} wave className="!absolute -bottom-4 -right-[140px] max-md:-right-10 max-md:[&_img]:!h-[150px] max-md:[&_img]:!w-[150px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── phone mockups (illustrations of the LINE chat, aria-hidden) ── */

function Phone({ children, tall = false }: { children: React.ReactNode; tall?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`box-border shrink-0 rounded-[46px] bg-[#1E2B3F] p-2.5 shadow-[0_24px_50px_rgba(21,48,90,.22)] ${tall ? "h-[500px] w-[280px] lg:h-[min(500px,calc(100svh-120px))]" : "h-[570px] w-[280px]"}`}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[37px] bg-[#DCEBFD] text-xs leading-snug">{children}</div>
    </div>
  );
}

function ChatHeader() {
  return <div className="bg-white px-3.5 pb-2 pt-4 text-sm font-bold">U-Bot</div>;
}

function ChatScreen() {
  return (
    <>
      <ChatHeader />
      <div className="flex flex-1 flex-col gap-2 p-2.5">
        <span className="self-end rounded-[14px] rounded-br-sm bg-chat px-3 py-1.5 text-[#0F2A12]">ขายน้ำพริก 20 กระปุก 1780</span>
        <div className="w-[190px] self-start overflow-hidden rounded-[14px] bg-white">
          <div className="px-2.5 pb-1 pt-2">
            <div className="font-bold">จดให้แล้วค่ะ ✓</div>
            <div className="font-bold text-income">รายรับ ฿1,780</div>
            <div className="text-ink-body">ขายน้ำพริกตาแดง · ตัดสต็อกแล้ว เหลือ 120</div>
          </div>
          <div className="flex gap-1.5 px-2.5 pb-2.5 pt-1">
            <span className="flex-1 rounded-lg bg-brand-soft py-1 text-center font-semibold text-brand">แก้ไข</span>
            <span className="flex-1 rounded-lg bg-[#FDECEC] py-1 text-center font-semibold text-expense">ลบ</span>
          </div>
        </div>
        <span className="self-end rounded-[14px] rounded-br-sm bg-chat px-3 py-1.5 text-[#0F2A12]">ปีนี้ใกล้ต้องจด VAT ยัง</span>
        <span className="max-w-[200px] self-start rounded-[14px] rounded-bl-sm bg-sun-soft px-2.5 py-1.5 text-[#5C3E00]">69% แล้วค่ะ ถ้าขายแบบนี้ต่อ จะถึงเพดานราว ก.พ. ปีหน้านะคะ</span>
      </div>
      {/* LINE rich menu */}
      <div className="grid grid-cols-3 grid-rows-[64px_64px] gap-1 bg-brand p-1 font-bold">
        <div className="row-span-2 flex flex-col justify-between rounded-[10px] bg-white p-2">
          <b className="text-[22px] leading-none text-brand">จด</b>
          <span className="text-[11px]">รายรับ/<br />รายจ่าย</span>
        </div>
        <div className="grid place-items-center rounded-[10px] bg-brand-soft">สรุป</div>
        <div className="grid place-items-center rounded-[10px] bg-sun-soft text-[#5C3E00]">ภาษี</div>
        <div className="grid place-items-center rounded-[10px] bg-brand-soft text-center leading-tight">ราคา<br />คู่แข่ง</div>
        <div className="grid place-items-center rounded-[10px] bg-brand-soft">ถาม U-Bot</div>
      </div>
    </>
  );
}

/** LINE chat with the message input bar at the bottom. */
function ChatShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatHeader />
      <div className="flex flex-1 flex-col gap-2.5 overflow-hidden p-2.5">{children}</div>
      <div className="flex items-center gap-2 bg-white px-3 py-2.5 text-ink-muted">
        <span className="text-lg leading-none">+</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="14" rx="3" /><circle cx="12" cy="13" r="3.5" /></svg>
        <span className="flex-1 rounded-full bg-line-subtle px-3 py-1.5">Aa</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
      </div>
    </>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return <span className="self-end rounded-[14px] rounded-br-sm bg-chat px-3 py-1.5 text-[#0F2A12]">{children}</span>;
}

/** Confirmation card U-Bot sends back after reading an entry. */
function ConfirmCard({ title, rows }: { title: string; rows: [string, React.ReactNode][] }) {
  return (
    <div className="w-[200px] self-start overflow-hidden rounded-[14px] bg-white">
      <div className="px-2.5 pb-1 pt-2">
        <div className="font-bold">{title}</div>
        {rows.map(([k, v]) => (
          <Row key={k} k={k} v={v} />
        ))}
      </div>
      <div className="flex gap-1.5 px-2.5 pb-2.5 pt-1.5">
        <span className="flex-1 rounded-lg bg-brand py-1 text-center font-semibold text-white">ถูกต้อง</span>
        <span className="flex-1 rounded-lg bg-brand-soft py-1 text-center font-semibold text-brand">แก้ไข</span>
      </div>
    </div>
  );
}

function SavedReply({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserBubble>ถูกต้อง</UserBubble>
      <span className="max-w-[210px] self-start rounded-[14px] rounded-bl-sm bg-white px-2.5 py-1.5">
        <b className="text-income">บันทึกแล้ว ✓</b> {children}
      </span>
    </>
  );
}

function TextScreen() {
  return (
    <ChatShell>
      <UserBubble>ขายน้ำพริก 20 กระปุก 1780</UserBubble>
      <ConfirmCard
        title="จดให้แล้ว ถูกไหมคะ?"
        rows={[["ประเภท", <span key="t" className="text-income">รายรับ</span>], ["ยอด", "฿1,780"], ["สินค้า", "น้ำพริก ×20"]]}
      />
      <SavedReply>ตัดสต็อกน้ำพริก เหลือ 120</SavedReply>
    </ChatShell>
  );
}

function SlipScreen() {
  return (
    <ChatShell>
      <div className="w-[130px] self-end rounded-[14px] bg-white p-1.5">
        <div className="flex h-[150px] flex-col items-center justify-center gap-0.5 rounded-[10px] bg-brand-tint">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#CDEBD9] font-bold text-income">✓</span>
          <span className="text-[10px] text-ink-muted">โอนเงินสำเร็จ</span>
          <b className="text-base">฿1,780.00</b>
          <span className="text-[10px] text-ink-muted">16 ต.ค. 69 · 14:02</span>
        </div>
      </div>
      <ConfirmCard
        title="อ่านสลิปแล้ว ถูกไหมคะ?"
        rows={[["ประเภท", <span key="t" className="text-income">รายรับ</span>], ["ยอด", "฿1,780"], ["สินค้า", "น้ำพริก ×20"]]}
      />
      <SavedReply>ตัดสต็อกน้ำพริก เหลือ 120</SavedReply>
    </ChatShell>
  );
}

function VoiceScreen() {
  return (
    <ChatShell>
      <span className="flex items-center gap-2 self-end rounded-[14px] rounded-br-sm bg-chat px-3 py-2 text-[#0F2A12]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        <span className="flex items-center gap-[3px]">
          {[6, 12, 8, 14, 10, 16, 7, 12, 9, 5].map((h, i) => (
            <span key={i} className="w-[3px] rounded-sm bg-[#0F2A12]/60" style={{ height: h }} />
          ))}
        </span>
        <b>0:04</b>
      </span>
      <ConfirmCard
        title="ฟังแล้วค่ะ ถูกไหมคะ?"
        rows={[["ประเภท", <span key="t" className="text-expense">รายจ่าย</span>], ["ยอด", "฿900"], ["รายการ", "พริกแห้ง ×2 กระสอบ"]]}
      />
      <SavedReply>บันทึกต้นทุนวัตถุดิบให้แล้วค่ะ</SavedReply>
    </ChatShell>
  );
}

function RadarScreen() {
  const dots = [
    [41, 0], [43, 1], [50, 0], [56, 0], [79, 0], [84, 1],
  ];
  return (
    <div className="flex h-full flex-col gap-2.5 bg-white px-3.5 py-[18px]">
      <b className="text-sm">น้ำพริกตาแดงโบราณ</b>
      <div className="rounded-[14px] bg-sky-deep p-2.5">
        <b className="text-brand">U-Bot แนะนำ</b>
        <div>
          ตั้งราคา <b>฿85</b> แล้วเปิดขายบน Lazada ร้านคู่แข่งที่นั่นของหมด
        </div>
      </div>
      <div className="relative mt-1 h-[110px]">
        <div className="absolute bottom-[22px] left-[55%] top-[18px] w-[15%] rounded-lg bg-[#E3F0FF]" />
        <div className="absolute bottom-[22px] left-0 right-0 h-[3px] rounded bg-brand-soft" />
        <div className="absolute bottom-[22px] left-[7%] top-0 w-0.5 bg-[#F2A48E]" />
        <span className="absolute left-[7%] top-0 ml-1 text-[10px] font-bold text-[#9A3412]">ทุน 45</span>
        {dots.map(([x, lane]) => (
          <span key={x} className="absolute h-3 w-3 rounded-full bg-brand-light" style={{ left: `${x}%`, bottom: 28 + lane * 14 }} />
        ))}
        <span className="absolute bottom-[28px] left-[64%] h-3 w-3 rounded-full bg-brand" />
        <span className="absolute bottom-[28px] left-[70%] h-3.5 w-3.5 rounded-full bg-navy" />
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-ink-muted">
          <span>฿40</span>
          <span>฿80</span>
          <span>฿110</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {[["TikTok Shop", "฿69"], ["Shopee", "฿75"], ["Lazada · ของหมด", "฿82"]].map(([k, v]) => (
          <div key={k} className="flex justify-between rounded-lg bg-brand-tint px-2 py-1.5">
            <span>{k}</span>
            <b>{v}</b>
          </div>
        ))}
        <div className="flex justify-between rounded-lg bg-brand-soft px-2 py-1.5">
          <span>ร้านคุณ</span>
          <b>฿89</b>
        </div>
      </div>
    </div>
  );
}

/** Tax step 2: U-Bot pushes a heads-up when sales cross into the next zone. */
function TaxAlertScreen() {
  return (
    <ChatShell>
      <div className="w-[220px] self-start overflow-hidden rounded-[14px] bg-white">
        <div className="bg-sun-soft px-2.5 py-1.5 font-bold text-sun-ink">แจ้งเตือนภาษี · โซนเหลือง</div>
        <div className="flex flex-col gap-1 px-2.5 py-2">
          <Row k="ยอดขายสะสมปีนี้" v="฿1,262,000" />
          <div className="h-1.5 overflow-hidden rounded-full bg-brand-soft">
            <div className="h-full w-[70%] rounded-full bg-sun" />
          </div>
          <div className="text-ink-muted">70% ของเพดาน VAT ฿1.8 ล้าน</div>
        </div>
      </div>
      <span className="max-w-[220px] self-start rounded-[14px] rounded-bl-sm bg-white px-2.5 py-1.5">
        <b>สิ่งที่ควรเตรียมไว้ค่ะ</b>
        <span className="block">✓ เก็บใบเสร็จค่าวัตถุดิบให้ครบ</span>
        <span className="block">✓ เช็กยอดขายทุกแพลตฟอร์มให้ตรง</span>
        <span className="block">✓ ถ้าเกินเพดาน จด VAT ภายใน 30 วัน</span>
      </span>
      <UserBubble>โอเค ขอบคุณนะ</UserBubble>
    </ChatShell>
  );
}

/** Tax step 3: the yearly summary on the web dashboard. */
function ProfitSummary() {
  return (
    <div aria-hidden="true" className="flex w-[340px] max-w-full flex-col gap-4 rounded-[30px] bg-white p-7 text-[15px] shadow-[0_24px_50px_rgba(21,48,90,.14)]">
      <div className="flex items-center justify-between">
        <b className="text-lg">สรุปปี 2569</b>
        <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">หน้าเว็บ</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Row k="รายรับ" v={<span className="text-income">฿1,262,000</span>} />
        <Row k="รายจ่าย" v={<span className="text-expense">฿748,500</span>} />
        <div className="mt-1 flex items-baseline justify-between border-t border-line pt-2">
          <span className="font-bold">กำไรสุทธิ</span>
          <b className="text-2xl text-brand">฿513,500</b>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <b>สินค้าขายดี</b>
        {[["น้ำพริกตาแดง", 62], ["สบู่มะกรูด", 24], ["กระเป๋าผ้าทอ", 14]].map(([name, pct]) => (
          <div key={name} className="flex flex-col gap-1">
            <Row k={name as string} v={`${pct}%`} />
            <div className="h-1.5 overflow-hidden rounded-full bg-brand-soft">
              <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Radar step 2: where the same product sells. */
function WhereToSellScreen() {
  const platforms: [string, number, string?][] = [
    ["Shopee", 1240],
    ["TikTok Shop", 980],
    ["Lazada", 610, "คู่แข่งของหมด"],
    ["Amazon", 120],
  ];
  return (
    <div className="flex h-full flex-col gap-2.5 bg-white px-3.5 py-[18px]">
      <b className="text-sm">ควรไปขายที่ไหน</b>
      <span className="text-ink-muted">ยอดขายน้ำพริกแบบเดียวกัน / เดือน</span>
      <div className="flex flex-col gap-2.5">
        {platforms.map(([name, sold, note]) => (
          <div key={name} className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span>
                {name}
                {note && <span className="ml-1.5 rounded-full bg-sun-soft px-1.5 text-[10px] font-bold text-sun-ink">{note}</span>}
              </span>
              <b>{sold.toLocaleString("en-US")}</b>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-brand-soft">
              <div className={`h-full rounded-full ${note ? "bg-sun" : "bg-brand"}`} style={{ width: `${(sold / 1240) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto rounded-[14px] bg-sky-deep p-2.5">
        <b className="text-brand">U-Bot แนะนำ</b>
        <div>เปิดร้านบน Lazada ตอนนี้ คู่แข่งของหมด ได้ลูกค้าก่อนใคร</div>
      </div>
    </div>
  );
}

/** Radar step 3: trending search terms and an export opportunity. */
function KeywordScreen() {
  return (
    <div className="flex h-full flex-col gap-2.5 bg-white px-3.5 py-[18px]">
      <b className="text-sm">คำค้นยอดฮิต · 30 วัน</b>
      <div className="flex flex-col gap-1.5">
        {[["น้ำพริกตาแดง", "+38%"], ["น้ำพริกคลีน", "+22%"], ["น้ำพริกกระปุกของฝาก", "+15%"], ["น้ำพริกเผาโบราณ", "+9%"]].map(([k, v], i) => (
          <div key={k} className="flex items-center gap-2 rounded-lg bg-brand-tint px-2 py-1.5">
            <span className="w-4 font-bold text-brand">{i + 1}</span>
            <span className="flex-1">{k}</span>
            <b className="text-income">{v}</b>
          </div>
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-1 rounded-[14px] border border-line p-2.5">
        <span className="self-start rounded-full bg-brand-soft px-2 text-[10px] font-bold text-brand">โอกาสส่งออก · ยุโรป</span>
        <b>“Thai chili paste”</b>
        <Row k="ความต้องการ" v={<span className="text-income">เพิ่มขึ้น</span>} />
        <Row k="ราคาเฉลี่ย" v="€6.50 / กระปุก" />
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-ink-muted">{k}</span>
      <b>{v}</b>
    </div>
  );
}

/* ── sections ── */

function StepSection({
  id,
  title,
  intro,
  steps,
  active = 0,
  visuals,
  decor,
  visualFirst = false,
  premium = false,
}: {
  id: string;
  title: React.ReactNode;
  intro: string;
  steps: [string, string][];
  active?: number;
  /** one visual, or one per step to make the steps clickable */
  visuals: React.ReactNode[];
  decor?: React.ReactNode;
  visualFirst?: boolean;
  premium?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 px-6 pb-16 pt-10">
      <div className={`mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-14 ${visualFirst ? "flex-row-reverse" : ""}`}>
        <StepDemo
          steps={steps}
          active={active}
          visuals={visuals}
          decor={decor}
          reverse={visualFirst}
          badge={premium && <span className="rounded-full bg-sun px-2.5 py-0.5 text-[13px] font-bold text-[#4A3500]">Premium</span>}
          head={
            <>
              <h2 id={`${id}-title`} className="m-0 text-4xl font-extrabold leading-snug">
                {title}
              </h2>
              <p className="m-0 text-ink-body">{intro}</p>
            </>
          }
        />
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  body,
  tag,
  tagLeft = false,
  fox,
  children,
}: {
  title: string;
  body: string;
  tag?: string;
  tagLeft?: boolean;
  fox?: FoxPose;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 overflow-hidden rounded-[26px] border border-line bg-brand-tint px-6 pt-6 transition-transform duration-300 hover:-translate-y-1">
      <h3 className="m-0 text-[21px] font-bold">{title}</h3>
      <p className="m-0 text-[15px] text-ink-muted">{body}</p>
      <div className="relative mt-4 h-[210px]" aria-hidden="true">
        {children}
        {fox && <UBot pose={fox} size={118} className={`absolute bottom-0 ${tagLeft ? "right-0" : "left-0"}`} />}
        {tag && (
          <span
            className={`absolute top-4 rounded-2xl px-3.5 py-2 text-[15px] font-semibold shadow-[0_6px_16px_rgba(0,0,0,.08)] ${
              tagLeft ? "left-2 bg-white text-brand" : "right-2 bg-chat text-[#0F2A12]"
            }`}
          >
            {tag}
          </span>
        )}
      </div>
    </div>
  );
}

function MiniPhone({ children, chat = false }: { children: React.ReactNode; chat?: boolean }) {
  return (
    <div className="absolute -bottom-8 left-1/2 box-border h-[230px] w-[220px] -translate-x-1/2 rounded-t-[34px] bg-[#1E2B3F] p-2.5">
      <div className={`flex h-full flex-col gap-2 rounded-t-[26px] p-3.5 text-xs ${chat ? "bg-[#DCEBFD]" : "bg-white"}`}>{children}</div>
    </div>
  );
}

function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-20 px-6 pb-24">
      <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-9">
        <div className="relative text-center">
          <UBot pose="love" size={120} className="absolute -left-36 -top-6 max-lg:hidden" />
          <h2 id="pricing-title" className="m-0 text-[40px] font-extrabold">
            เริ่ม<span className="text-brand">ฟรี</span> จ่ายเมื่ออยากรู้ใจคู่แข่ง
          </h2>
          <p className="m-0 mt-2 text-ink-muted">ราคาเป็นมิตรเหมือนแม่ค้าข้างบ้าน ยกเลิกเมื่อไหร่ก็ได้</p>
        </div>
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-8">
          <Receipt
            name="Free"
            subtitle="ร้านของฉัน — จดบัญชีผ่าน LINE"
            price="฿0"
            lines={["จดด้วยข้อความ สลิป และเสียง", "ตัดสต็อกอัตโนมัติ", "มิเตอร์ภาษี VAT และแจ้งเตือน", "สรุปรายรับ รายจ่าย กำไร"]}
          />
          <Receipt
            highlight
            name="Premium"
            subtitle="ทุกอย่างใน Free + Market Radar"
            price="฿199"
            per="/ เดือน"
            lines={["ราคาคู่แข่งทุกแพลตฟอร์ม เทียบต้นทุนจริง", "U-Bot แนะนำราคาขาย", "คำค้นยอดฮิต และเทรนด์ข้ามแพลตฟอร์ม", "โอกาสส่งออกตลาดยุโรป"]}
          />
        </div>
        <LineAddFriendButton />
      </div>
    </section>
  );
}

/** A plan drawn as a shop receipt (ใบเสร็จ). */
function Receipt({
  name,
  subtitle,
  price,
  per,
  lines,
  highlight = false,
}: {
  name: string;
  subtitle: string;
  price: string;
  per?: string;
  lines: string[];
  highlight?: boolean;
}) {
  return (
    <div className="relative drop-shadow-[0_14px_24px_rgba(21,48,90,.12)]">
      <div className="flex flex-col gap-3 rounded-t-2xl bg-white px-7 pb-6 pt-7">
        <div className="flex items-center justify-between gap-3">
          <h3 className={`m-0 text-[28px] font-extrabold ${highlight ? "text-brand" : ""}`}>{name}</h3>
          {highlight && <span className="rounded-full bg-sun px-3 py-1 text-sm font-bold text-[#4A3500]">ลองฟรี 7 วัน</span>}
        </div>
        <p className="m-0 text-ink-muted">{subtitle}</p>
        <ul className="m-0 flex list-none flex-col gap-2 border-y-2 border-dashed border-line p-0 py-4">
          {lines.map((l) => (
            <li key={l} className="flex gap-2.5">
              <span className="font-bold text-brand">✓</span>
              {l}
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between">
          <span className="font-bold text-ink-muted">รวม</span>
          <span className="text-[40px] font-extrabold leading-tight">
            {price} {per && <span className="text-[17px] font-medium text-ink-muted">{per}</span>}
          </span>
        </div>
      </div>
      <ReceiptEdge />
    </div>
  );
}

const FAQ = [
  ["U-Ledger AI คืออะไร?", "หนูเป็นผู้ช่วยบัญชีและนักวิเคราะห์ตลาดสำหรับพ่อค้าแม่ค้าออนไลน์ค่ะ จดบัญชีผ่าน LINE และดูราคาคู่แข่งบนเว็บ"],
  ["ต้องโหลดแอปใหม่ไหม?", "ไม่ต้องเลยค่ะ เพิ่มเพื่อน U-Bot ใน LINE แล้วเริ่มส่งรายการได้ทันที หน้าเว็บก็เปิดจาก LINE ได้"],
  ["ตัวเลขภาษีเชื่อได้แค่ไหน?", "เป็นการประมาณจากรายการที่คุณยืนยันแล้ว ใช้วางแผนล่วงหน้าได้ แต่ก่อนยื่นจริงควรตรวจกับผู้สอบบัญชีนะคะ"],
  ["ราคาคู่แข่งมาจากไหน?", "รวบรวมจากแพลตฟอร์มขายของออนไลน์ทั้งในไทยและต่างประเทศค่ะ ในเดโมนี้เป็นข้อมูลตัวอย่าง"],
] as const;

/** FAQ as a LINE chat: the seller asks, U-Bot answers. */
function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 px-6 pb-24">
      <div className="mx-auto flex max-w-[1100px] flex-wrap gap-x-16 gap-y-8">
        <div className="flex flex-[1_1_300px] flex-col items-start gap-3">
          <span className="rounded-full bg-brand-soft px-3.5 py-1 text-[15px] font-semibold text-brand">คำถามที่พบบ่อย</span>
          <h2 id="faq-title" className="m-0 text-[40px] font-extrabold leading-tight">
            เรื่องที่
            <br />
            คนชอบถาม U-Bot
          </h2>
          <UBot pose="question" size={170} className="mt-4 max-md:hidden" />
        </div>
        <dl className="m-0 flex flex-[2_1_520px] flex-col gap-5 rounded-[32px] bg-[#DCEBFD] p-6">
          {FAQ.map(([q, a]) => (
            <div key={q} className="flex flex-col gap-2.5">
              <dt className="max-w-[85%] self-end rounded-[20px] rounded-br-md bg-chat px-[18px] py-2.5 font-semibold text-[#0F2A12]">{q}</dt>
              <dd className="m-0 flex max-w-[90%] items-end gap-2.5 self-start">
                <UBotFace size={36} />
                <span className="rounded-[20px] rounded-bl-md bg-white px-[18px] py-2.5 text-ink-body">{a}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
