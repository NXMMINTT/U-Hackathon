"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useSubscription } from "@/hooks/useMarket";
import { formatThaiDate } from "@/lib/format";
import th from "@/locales/th.json";

const t = th.marketRadar.plans;
const FEATURES = t.features as Record<string, string>;
const STATUS = t.statusLabel as Record<string, string>;

export default function PlansPage() {
  const { data, error, isLoading } = useSubscription();

  if (error) return <Card className="border-[#FECACA] bg-[#FEF2F2] text-sm text-[#991B1B]">{error.message}</Card>;
  if (isLoading || !data) return <Card className="text-center text-sm text-ink-muted">{th.myBusiness.loading}</Card>;

  const user = data.current_user;

  return (
    <div className="flex flex-col gap-[22px]">
      <h2 className="text-xl font-semibold md:text-2xl">{t.title}</h2>

      <Card className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
        <div>
          <div className="text-xs text-ink-muted">{t.current}</div>
          <div className="font-semibold">
            {data.plans.find((p) => p.plan_id === user.plan_id)?.name ?? user.plan_id} · {user.shop_name}
          </div>
        </div>
        <div>
          <div className="text-xs text-ink-muted">{t.status}</div>
          <Badge tone={user.is_premium ? "success" : "neutral"}>{STATUS[user.status] ?? user.status}</Badge>
        </div>
        {user.next_billing_date && (
          <div>
            <div className="text-xs text-ink-muted">{t.nextBilling}</div>
            <div className="font-semibold">
              {formatThaiDate(user.next_billing_date)}
              {user.next_billing_amount_thb ? ` · ฿${user.next_billing_amount_thb}` : ""}
            </div>
          </div>
        )}
        {user.payment_method && (
          <div>
            <div className="text-xs text-ink-muted">{t.payment}</div>
            <div className="font-semibold">{user.payment_method.label}</div>
          </div>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {data.plans.map((plan) => {
          const isPremium = plan.price_thb_per_month > 0;
          const isCurrent = plan.plan_id === user.plan_id;
          return (
            <section
              key={plan.plan_id}
              className={`flex flex-col gap-4 rounded-2xl p-6 ${isPremium ? "border-2 border-brand bg-brand-tint" : "border border-line bg-white"}`}
            >
              {isPremium && <span className="text-xs font-semibold text-brand">{t.recommended}</span>}
              <div>
                <div className="text-sm font-semibold tracking-wide text-ink-muted">{plan.name.toUpperCase()}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">฿{plan.price_thb_per_month}</span>
                  <span className="text-sm text-ink-muted">{isPremium ? t.perMonth : t.forever}</span>
                </div>
                {plan.trial_days && (
                  <div className="text-sm text-brand">{t.trial.replace("{days}", String(plan.trial_days))}</div>
                )}
              </div>
              <ul className="flex flex-1 flex-col gap-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span aria-hidden="true" className="text-brand">
                      ✓
                    </span>
                    {FEATURES[f] ?? f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isCurrent}
                className={`min-h-[44px] rounded-full px-5 text-sm font-semibold ${
                  isCurrent
                    ? "bg-line-subtle text-ink-muted"
                    : isPremium
                      ? "bg-brand text-white"
                      : "border-[1.5px] border-brand text-brand"
                }`}
              >
                {isCurrent ? t.using : t.choose}
              </button>
            </section>
          );
        })}
      </div>
    </div>
  );
}
