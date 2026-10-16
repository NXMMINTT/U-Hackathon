"use client";

import { useState } from "react";

import { UBot } from "@/components/brand/UBot";
import { useKnowledgeTopics, useTopicAudio, useTopicScript } from "@/hooks/knowledge/useKnowledge";
import type { KnowledgeTopic } from "@/types/knowledge";

const CATEGORY_STYLE: Record<string, string> = {
  ภาษี: "bg-[#FFF4E0] text-[#B45309]",
  การตลาด: "bg-[#E3F2FD] text-[#1D4ED8]",
  แพลตฟอร์ม: "bg-[#EDE9FE] text-[#6D28D9]",
  ส่งออก: "bg-[#E8F5E9] text-[#15803D]",
};

function TopicCard({ topic }: { topic: KnowledgeTopic }) {
  const script = useTopicScript();
  const audio = useTopicAudio();
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen((v) => !v);
    if (!open && !script.data && !script.isPending) script.mutate(topic.topic_id);
  }

  function play() {
    audio.mutate(topic.topic_id, {
      onSuccess: (data) => {
        new Audio(`data:${data.audio_mime};base64,${data.audio_base64}`).play().catch(() => {});
      },
    });
  }

  return (
    <article className="flex flex-col gap-3 rounded-[24px] bg-white p-5 shadow-[0_2px_14px_rgba(0,0,0,0.05)]">
      <span className={`self-start rounded-full px-3 py-1 text-[12px] font-bold ${CATEGORY_STYLE[topic.category] ?? "bg-line-subtle text-ink-body"}`}>
        {topic.category}
      </span>
      <h2 className="m-0 text-[18px] font-bold leading-snug text-navy">{topic.title}</h2>
      <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[15px] text-ink-body">
        {topic.outline.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <button type="button" onClick={toggle} className="text-[15px] font-semibold text-brand no-underline">
          {open ? "ซ่อนสรุป" : "อ่านสรุปโดย U-Bot ✨"}
        </button>
        <button
          type="button"
          onClick={play}
          disabled={audio.isPending}
          className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand no-underline disabled:opacity-60"
        >
          🔊 {audio.isPending ? "กำลังสร้างเสียง…" : "ฟังเสียง U-Bot"}
        </button>
      </div>

      {audio.error && <p className="m-0 text-[14px] text-expense">{audio.error.message}</p>}

      {open && (
        <div className="rounded-2xl bg-brand-tint px-4 py-3 text-[15px] leading-relaxed text-ink-body">
          {script.isPending && <p className="m-0 text-ink-muted">U-Bot กำลังเรียบเรียง…</p>}
          {script.error && <p className="m-0 text-expense">สร้างสรุปไม่สำเร็จ: {script.error.message}</p>}
          {script.data && <p className="m-0 whitespace-pre-line">{script.data.script}</p>}
        </div>
      )}
    </article>
  );
}

export default function KnowledgePage() {
  const topics = useKnowledgeTopics();
  const [category, setCategory] = useState<string | null>(null);

  const categories = topics.data ? [...new Set(topics.data.map((t) => t.category))] : [];
  const shown = topics.data?.filter((t) => !category || t.category === category) ?? [];

  return (
    <div className="flex flex-col gap-5 pb-4">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#E0F2FE] to-[#F0F7FF] px-6 py-6">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="m-0 text-[22px] font-bold leading-tight text-navy">ความรู้ & ข่าวสารการตลาด</p>
            <p className="m-0 mt-1 text-[15px] text-ink-body">
              เกร็ดความรู้เรื่องภาษี การตลาด และแพลตฟอร์ม สำหรับร้านออนไลน์ โดย U-Bot
            </p>
          </div>
          <UBot size={90} pose="idea" className="shrink-0" />
        </div>
      </section>

      {topics.error && (
        <p className="m-0 rounded-3xl bg-[#FDECEC] p-6 text-expense">โหลดความรู้ไม่สำเร็จ: {topics.error.message}</p>
      )}
      {topics.isLoading && <p className="m-0 rounded-3xl bg-white p-6 text-center text-ink-muted">กำลังโหลด…</p>}

      {topics.data && (
        <>
          <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={`min-h-[40px] flex-none rounded-full px-4 text-[14px] font-semibold ${!category ? "bg-navy text-white" : "border-2 border-[#C7DEFC] bg-white text-ink-body"}`}
            >
              ทั้งหมด
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`min-h-[40px] flex-none rounded-full px-4 text-[14px] font-semibold ${category === c ? "bg-navy text-white" : "border-2 border-[#C7DEFC] bg-white text-ink-body"}`}
              >
                {c}
              </button>
            ))}
          </nav>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
            {shown.map((topic) => (
              <TopicCard key={topic.topic_id} topic={topic} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
