"""Thai copy for bot messages and Flex Messages. Keep all user-facing
Thai strings here rather than inline in services/routers.
"""

from decimal import Decimal

from app.core.formatting import format_thb

INCOME_LABEL = "รายรับ"
EXPENSE_LABEL = "รายจ่าย"

TRANSACTION_CONFIRM_BUTTON = "ยืนยัน"
TRANSACTION_EDIT_BUTTON = "แก้ไข"
TRANSACTION_CANCEL_BUTTON = "ยกเลิก"
LOW_CONFIDENCE_BADGE = "โปรดตรวจสอบอีกครั้ง"

TRANSACTION_CONFIRMED_REPLY = "บันทึกเรียบร้อยแล้วค่ะ ✅"
TRANSACTION_CANCELLED_REPLY = "ยกเลิกรายการแล้วค่ะ"
TRANSACTION_ALREADY_RESOLVED_REPLY = "รายการนี้ถูกดำเนินการไปแล้วค่ะ"
TRANSACTION_NOT_FOUND_REPLY = "ไม่พบรายการนี้ค่ะ"

NO_TRANSACTIONS_PARSED_REPLY = "ไม่พบรายการที่สามารถบันทึกได้ค่ะ ลองพิมพ์ใหม่อีกครั้งได้ไหมคะ"
UNSUPPORTED_MESSAGE_TYPE_REPLY = "ตอนนี้รองรับข้อความ รูปสลิป/ใบเสร็จ และข้อความเสียงค่ะ ลองส่งแบบนั้นมาได้เลยนะคะ"
GENERIC_ERROR_REPLY = "ขอโทษค่ะ ตอนนี้ระบบขัดข้อง กรุณาลองใหม่อีกครั้งค่ะ"


def vat_warning_message(ratio_percent: str) -> str:
    return (
        f"⚠️ รายได้สะสมปีนี้ถึง {ratio_percent} ของเกณฑ์จดทะเบียน VAT (1.8 ล้านบาท/ปี) แล้วนะคะ "
        "ลองดูรายละเอียดเพิ่มเติมที่หน้า Dashboard ได้ค่ะ"
    )


def tax_status_reply(annual_income: Decimal, ratio_percent: str, required: bool) -> str:
    status = "ถึงเกณฑ์ต้องจดทะเบียน VAT แล้วค่ะ" if required else "ยังไม่ถึงเกณฑ์ VAT ค่ะ"
    return f"รายได้สะสมปีนี้ {format_thb(annual_income)} ({ratio_percent} ของเกณฑ์ 1.8 ล้านบาท) {status}"


def daily_summary_reply(income_total: Decimal, expense_total: Decimal) -> str:
    net = income_total - expense_total
    return (
        "สรุปวันนี้ค่ะ\n"
        f"รายรับ: {format_thb(income_total)}\n"
        f"รายจ่าย: {format_thb(expense_total)}\n"
        f"กำไรสุทธิ: {format_thb(net)}"
    )


def stock_remaining_line(product_name: str, stock_qty: Decimal, unit: str) -> str:
    qty = f"{stock_qty.normalize():f}"
    if stock_qty <= 0:
        return f"📦 {product_name} หมดสต็อกแล้วค่ะ (คงเหลือ {qty} {unit})"
    return f"📦 {product_name} คงเหลือ {qty} {unit}"
