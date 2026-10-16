"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "th" | "en" | "zh";

type Translations = Record<string, Record<Locale, string>>;

const t: Translations = {
  "nav.myShop": { th: "ร้านของฉัน", en: "My Shop", zh: "我的店铺" },
  "nav.marketRadar": { th: "Market Radar", en: "Market Radar", zh: "市场雷达" },
  "nav.home": { th: "หน้าแรก", en: "Home", zh: "首页" },

  "settings.title": { th: "ตั้งค่าร้าน", en: "Shop Settings", zh: "店铺设置" },
  "settings.subtitle": { th: "ชื่อร้านจะขึ้นในคำทักทายของ U-Bot และสรุปใน LINE", en: "Shop name appears in U-Bot greetings and LINE summaries", zh: "店名将出现在U-Bot问候语和LINE摘要中" },
  "settings.shopInfo": { th: "ข้อมูลร้าน", en: "Shop Info", zh: "店铺信息" },
  "settings.shopName": { th: "ชื่อร้าน", en: "Shop Name", zh: "店名" },
  "settings.businessType": { th: "ประเภทธุรกิจ", en: "Business Type", zh: "业务类型" },
  "settings.businessTypePlaceholder": { th: "เช่น ของฝาก อาหาร เสื้อผ้า", en: "e.g. Souvenirs, Food, Clothing", zh: "例如：纪念品、食品、服装" },
  "settings.saving": { th: "กำลังบันทึก…", en: "Saving…", zh: "保存中…" },
  "settings.save": { th: "บันทึก", en: "Save", zh: "保存" },
  "settings.saved": { th: "บันทึกแล้ว ✓", en: "Saved ✓", zh: "已保存 ✓" },
  "settings.tax": { th: "ภาษี", en: "Tax", zh: "税务" },
  "settings.vatStatus": { th: "สถานะ VAT:", en: "VAT Status:", zh: "增值税状态：" },
  "settings.vatRegistered": { th: "จดทะเบียน VAT แล้ว", en: "VAT Registered", zh: "已注册增值税" },
  "settings.vatNotRegistered": { th: "ยังไม่ได้จด VAT", en: "Not VAT Registered", zh: "未注册增值税" },
  "settings.vatReminder": { th: "U-Bot จะเตือนใน LINE เมื่อยอดขายทั้งปีใกล้เพดาน 1.8 ล้านบาท", en: "U-Bot will alert you on LINE when annual sales approach the 1.8M baht VAT threshold", zh: "当年销售额接近180万泰铢增值税门槛时，U-Bot将在LINE上提醒您" },
  "settings.plan": { th: "แพ็กเกจ", en: "Plan", zh: "套餐" },
  "settings.currentPlan": { th: "ตอนนี้ใช้:", en: "Current plan:", zh: "当前套餐：" },
  "settings.trialing": { th: " (ช่วงทดลองใช้)", en: " (Trial)", zh: " (试用期)" },
  "settings.changePlan": { th: "เปลี่ยนแพ็กเกจ >", en: "Change plan >", zh: "更换套餐 >" },
  "settings.line": { th: "LINE", en: "LINE", zh: "LINE" },
  "settings.lineDesc": { th: "จดบัญชีด้วยการส่งข้อความ สลิป หรือเสียงในแชท U-Bot", en: "Record transactions by sending messages, receipts, or voice in U-Bot chat", zh: "通过在U-Bot聊天中发送消息、收据或语音来记账" },
  "settings.openLineChat": { th: "เปิดแชท U-Bot ใน LINE", en: "Open U-Bot Chat in LINE", zh: "在LINE中打开U-Bot聊天" },
  "settings.language": { th: "ภาษา", en: "Language", zh: "语言" },
  "settings.theme": { th: "ธีม", en: "Theme", zh: "主题" },
  "settings.themeLight": { th: "สว่าง", en: "Light", zh: "浅色" },
  "settings.themeDark": { th: "มืด", en: "Dark", zh: "深色" },
  "settings.themeSystem": { th: "ตามระบบ", en: "System", zh: "跟随系统" },
  "settings.appearance": { th: "การแสดงผล", en: "Appearance", zh: "外观" },

  "knowledge.title": { th: "ความรู้ & ข่าวสารการตลาด", en: "Knowledge & Marketing News", zh: "知识与营销新闻" },
  "knowledge.subtitle": { th: "เกร็ดความรู้เรื่องภาษี การตลาด และแพลตฟอร์ม สำหรับร้านออนไลน์ โดย U-Bot", en: "Tax, marketing, and platform tips for online shops by U-Bot", zh: "U-Bot为网店提供的税务、营销和平台知识" },
  "knowledge.all": { th: "ทั้งหมด", en: "All", zh: "全部" },
  "knowledge.readSummary": { th: "อ่านสรุปโดย U-Bot ✨", en: "Read U-Bot Summary ✨", zh: "阅读U-Bot摘要 ✨" },
  "knowledge.hideSummary": { th: "ซ่อนสรุป", en: "Hide Summary", zh: "隐藏摘要" },
  "knowledge.listen": { th: "🔊 ฟังเสียง U-Bot", en: "🔊 Listen to U-Bot", zh: "🔊 收听U-Bot" },
  "knowledge.generating": { th: "⏳ กำลังสร้างเสียง…", en: "⏳ Generating audio…", zh: "⏳ 正在生成音频…" },
  "knowledge.pause": { th: "⏸ หยุดชั่วคราว", en: "⏸ Pause", zh: "⏸ 暂停" },
  "knowledge.resume": { th: "▶ เล่นต่อ", en: "▶ Resume", zh: "▶ 继续" },
  "knowledge.stop": { th: "⏹ หยุด", en: "⏹ Stop", zh: "⏹ 停止" },
  "knowledge.summarizing": { th: "U-Bot กำลังเรียบเรียง…", en: "U-Bot is summarizing…", zh: "U-Bot正在整理…" },
  "knowledge.summaryError": { th: "สร้างสรุปไม่สำเร็จ:", en: "Failed to generate summary:", zh: "生成摘要失败：" },
  "knowledge.loadError": { th: "โหลดความรู้ไม่สำเร็จ:", en: "Failed to load knowledge:", zh: "加载知识失败：" },
  "knowledge.loading": { th: "กำลังโหลด…", en: "Loading…", zh: "加载中…" },

  "cat.ภาษี": { th: "ภาษี", en: "Tax", zh: "税务" },
  "cat.การตลาด": { th: "การตลาด", en: "Marketing", zh: "营销" },
  "cat.แพลตฟอร์ม": { th: "แพลตฟอร์ม", en: "Platforms", zh: "平台" },
  "cat.ส่งออก": { th: "ส่งออก", en: "Export", zh: "出口" },
  "cat.การจัดการร้าน": { th: "การจัดการร้าน", en: "Shop Management", zh: "店铺管理" },

  "common.loadError": { th: "โหลดข้อมูลร้านไม่สำเร็จ:", en: "Failed to load shop data:", zh: "加载店铺数据失败：" },
  "common.loading": { th: "กำลังโหลด…", en: "Loading…", zh: "加载中…" },
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  tr: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue>({
  locale: "th",
  setLocale: () => {},
  tr: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("u-locale") as Locale | null;
      if (saved && (saved === "th" || saved === "en" || saved === "zh")) setLocaleState(saved);
    } catch {}
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem("u-locale", l); } catch {}
    document.documentElement.lang = l === "zh" ? "zh-CN" : l;
  }, []);

  const tr = useCallback((key: string) => t[key]?.[locale] ?? key, [locale]);

  return <I18nContext.Provider value={{ locale, setLocale, tr }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export const LOCALE_LABELS: Record<Locale, string> = { th: "ไทย", en: "English", zh: "中文" };
