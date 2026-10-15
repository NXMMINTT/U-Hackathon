import { UserBubble } from "@/components/home/phone/UserBubble";

export function SavedReply({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserBubble>ถูกต้อง</UserBubble>
      <span className="max-w-[210px] self-start rounded-[14px] rounded-bl-sm bg-white px-2.5 py-1.5">
        <b className="text-income">บันทึกแล้ว ✓</b> {children}
      </span>
    </>
  );
}
