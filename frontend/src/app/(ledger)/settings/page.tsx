"use client";

import Link from "next/link";
import { useState } from "react";

import { LineAddFriendButton } from "@/components/brand/LineAddFriendButton";
import { UBot } from "@/components/brand/UBot";
import { useBusiness } from "@/hooks/dashboard/useBusiness";
import { useUpdateBusiness } from "@/hooks/dashboard/useUpdateBusiness";
import { useSubscription } from "@/hooks/market/useSubscription";
import type { BusinessInfo } from "@/types/dashboard";

const inputClass = "min-h-[48px] w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink";

function ShopForm({ business }: { business: BusinessInfo }) {
  const update = useUpdateBusiness();
  const [name, setName] = useState(business.name);
  const [businessType, setBusinessType] = useState(business.business_type);
  const changed = name.trim() !== business.name || businessType.trim() !== business.business_type;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        update.mutate({ name, business_type: businessType });
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-[14px] font-semibold text-ink-body">ชื่อร้าน</span>
        <input required maxLength={255} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[14px] font-semibold text-ink-body">ประเภทธุรกิจ</span>
        <input
          required
          maxLength={255}
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          placeholder="เช่น ของฝาก อาหาร เสื้อผ้า"
          className={inputClass}
        />
      </label>
      {update.error && <p className="m-0 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-expense">{update.error.message}</p>}
      {update.isSuccess && !changed && <p className="m-0 text-sm text-income">บันทึกแล้ว ✓</p>}
      <button
        type="submit"
        disabled={!changed || update.isPending || !name.trim() || !businessType.trim()}
        className="min-h-[48px] self-start rounded-full bg-brand px-7 font-bold text-white disabled:opacity-50"
      >
        {update.isPending ? "กำลังบันทึก…" : "บันทึก"}
      </button>
    </form>
  );
}

export default function SettingsPage() {
  const business = useBusiness();
  const subscription = useSubscription();
  const plan = subscription.data?.plans.find((p) => p.plan_id === subscription.data?.current_user.plan_id);

  return (
    <div className="flex flex-col gap-5">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#E0F2FE] to-[#F0F7FF] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="m-0 text-[22px] font-bold text-navy">ตั้งค่าร้าน</h1>
            <p className="m-0 mt-1 text-[14px] text-ink-muted">ชื่อร้านจะขึ้นในคำทักทายของ U-Bot และสรุปใน LINE</p>
          </div>
          <UBot size={80} pose="proud" className="shrink-0" />
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h2 className="m-0 mb-4 text-[18px] font-bold text-navy">ข้อมูลร้าน</h2>
        {business.error && <p className="m-0 text-expense">โหลดข้อมูลร้านไม่สำเร็จ: {business.error.message}</p>}
        {business.isLoading && <p className="m-0 text-ink-muted">กำลังโหลด…</p>}
        {business.data && <ShopForm key={business.data.name + business.data.business_type} business={business.data} />}
      </section>

      <section className="flex flex-col gap-3 rounded-[28px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h2 className="m-0 text-[18px] font-bold text-navy">ภาษี</h2>
        <p className="m-0 text-ink-body">
          สถานะ VAT:{" "}
          <b>{business.data ? (business.data.vat_registered ? "จดทะเบียน VAT แล้ว" : "ยังไม่ได้จด VAT") : "…"}</b>
        </p>
        <p className="m-0 text-[14px] text-ink-muted">U-Bot จะเตือนใน LINE เมื่อยอดขายทั้งปีใกล้เพดาน 1.8 ล้านบาท</p>
      </section>

      <section className="flex flex-col gap-3 rounded-[28px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h2 className="m-0 text-[18px] font-bold text-navy">แพ็กเกจ</h2>
        <p className="m-0 text-ink-body">
          ตอนนี้ใช้: <b>{plan?.name ?? "…"}</b>
          {subscription.data?.current_user.status === "trialing" && " (ช่วงทดลองใช้)"}
        </p>
        <Link href="/market/plans" className="self-start text-[15px] font-semibold text-brand no-underline">
          เปลี่ยนแพ็กเกจ &gt;
        </Link>
      </section>

      <section className="flex flex-col gap-3 rounded-[28px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h2 className="m-0 text-[18px] font-bold text-navy">LINE</h2>
        <p className="m-0 text-[14px] text-ink-muted">จดบัญชีด้วยการส่งข้อความ สลิป หรือเสียงในแชท U-Bot</p>
        <LineAddFriendButton label="เปิดแชท U-Bot ใน LINE" className="self-start" />
      </section>
    </div>
  );
}
