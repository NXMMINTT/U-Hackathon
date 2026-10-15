"use client";

import { useEffect, useRef, useState } from "react";

import { Card } from "@/components/ui/Card";
import { useAskUBot, useCompetitorPrices } from "@/hooks/useMarket";
import { apiFetchBlob } from "@/lib/api-client";
import th from "@/locales/th.json";

const t = th.marketRadar.chat;
type Message = { role: "user" | "bot" | "error"; text: string };

/** U-Bot answers use Markdown **bold** for the key recommendation; render just that. */
function BotText({ text }: { text: string }) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) => (part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part));
}

/** Plays a U-Bot answer through ElevenLabs (/api/voice/speak); audio is fetched once and reused. */
function SpeakButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function play() {
    if (state === "playing") {
      audioRef.current?.pause();
      setState("idle");
      return;
    }
    try {
      if (!audioRef.current) {
        setState("loading");
        const blob = await apiFetchBlob("/api/voice/speak", {
          method: "POST",
          body: JSON.stringify({ text: text.replace(/\*\*/g, "") }),
        });
        audioRef.current = new Audio(URL.createObjectURL(blob));
        audioRef.current.onended = () => setState("idle");
      }
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setState("playing");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setState("error");
    }
  }

  return (
    <div className="mt-1.5 flex flex-col gap-1">
      <button
        type="button"
        onClick={play}
        disabled={state === "loading"}
        aria-label={t.listen}
        className="inline-flex min-h-[32px] items-center gap-1.5 self-start rounded-full border border-line px-3 text-xs font-semibold text-brand disabled:opacity-50"
      >
        <span aria-hidden="true">{state === "playing" ? "⏸" : "🔊"}</span>
        {state === "loading" ? t.voiceLoading : state === "playing" ? t.stop : t.listen}
      </button>
      {state === "error" && <span className="text-xs text-[#991B1B]">{error}</span>}
    </div>
  );
}

export default function UBotChatPage() {
  const prices = useCompetitorPrices();
  const ask = useAskUBot();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, ask.isPending]);

  function send(question: string) {
    const text = question.trim();
    if (!text || ask.isPending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setDraft("");
    ask.mutate(
      { question: text, product_id: prices.data?.product_id },
      {
        onSuccess: (res) => setMessages((m) => [...m, { role: "bot", text: res.answer }]),
        onError: (err) => setMessages((m) => [...m, { role: "error", text: err.message }]),
      },
    );
  }

  const p = prices.data;

  return (
    <div className="flex flex-wrap items-start gap-[22px]">
      <Card className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <p className="text-sm text-ink-muted">{t.subtitle}</p>
        </div>

        <div className="flex min-h-[320px] flex-col gap-3 rounded-xl bg-[#F5F7FA] p-4">
          {messages.length === 0 && (
            <div className="m-auto flex flex-col items-center gap-1 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-lg font-bold text-white">U</span>
              <p className="font-semibold">{t.empty}</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "self-end bg-brand text-white"
                  : m.role === "error"
                    ? "self-start bg-[#FEF2F2] text-[#991B1B]"
                    : "self-start border border-line bg-white text-navy"
              }`}
            >
              {m.role === "bot" ? (
                <>
                  <BotText text={m.text} />
                  <SpeakButton text={m.text} />
                </>
              ) : (
                m.text
              )}
            </div>
          ))}
          {ask.isPending && <div className="self-start text-sm text-ink-muted">{t.thinking}</div>}
          <div ref={endRef} />
        </div>

        <div className="flex flex-wrap gap-2">
          {t.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              disabled={ask.isPending}
              className="inline-flex min-h-[36px] items-center rounded-full border border-line bg-white px-3.5 text-sm text-ink-body hover:border-brand hover:text-brand disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t.placeholder}
            aria-label={t.placeholder}
            className="min-h-[46px] min-w-0 flex-1 rounded-xl border border-line px-4 text-base"
          />
          <button
            type="submit"
            disabled={ask.isPending || !draft.trim()}
            className="min-h-[46px] rounded-xl bg-brand px-5 font-semibold text-white disabled:opacity-50"
          >
            {t.send}
          </button>
        </form>
        <p className="text-xs text-ink-muted">{t.disclaimer}</p>
      </Card>

      {p && (
        <Card className="flex min-w-0 flex-[1_1_280px] flex-col gap-3">
          <h2 className="text-lg font-semibold">{t.contextTitle}</h2>
          <div className="text-sm font-semibold">{p.product_name}</div>
          <dl className="flex flex-col gap-2 text-sm">
            {[
              [th.marketRadar.overview.myCost, `฿${p.my_cost_price}`],
              [th.marketRadar.overview.myPrice, `฿${p.my_selling_price}`],
              [th.marketRadar.overview.median, `฿${p.price_distribution_thb.median}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-t border-line-subtle pt-2 first:border-t-0 first:pt-0">
                <dt className="text-ink-muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}
    </div>
  );
}
