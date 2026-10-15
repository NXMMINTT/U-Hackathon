"""Flex Message for confirming AI-parsed transactions. Styled to match
the U-Fox mascot design with colored headers and structured form layout.
"""

from decimal import Decimal

from linebot.v3.messaging import (
    FlexBox,
    FlexBubble,
    FlexButton,
    FlexCarousel,
    FlexIcon,
    FlexImage,
    FlexMessage,
    FlexSeparator,
    FlexText,
    PostbackAction,
    URIAction,
)

from app.core.formatting import format_thai_date, format_thb
from app.core.settings import settings
from app.locales import th
from app.models import Transaction
from app.models.enums import IncomeExpenseType

LOW_CONFIDENCE_THRESHOLD = Decimal("0.70")

CATEGORY_EMOJI_MAP = {
    "อาหาร": "🍽️",
    "เครื่องดื่ม": "🥤",
    "ช้อปปิ้ง": "🛍️",
    "ขนส่ง": "🚚",
    "ค่าที่พัก": "🏠",
    "ค่าเช่า": "🏠",
    "วัตถุดิบ": "🛒",
    "สินค้า": "🛒",
    "ค่าแรง": "👷",
    "ค่าน้ำ": "💧",
    "ค่าไฟ": "⚡",
    "ค่าเน็ต": "🌐",
    "ค่าโทรศัพท์": "📱",
    "การตลาด": "📣",
    "ขายสินค้า": "💰",
    "รายได้": "💵",
    "เงินเดือน": "💼",
}


def _category_emoji(category_name: str | None) -> str:
    if not category_name:
        return "📋"
    for key, emoji in CATEGORY_EMOJI_MAP.items():
        if key in category_name:
            return emoji
    return "📋"


def _build_bubble(txn: Transaction) -> FlexBubble:
    is_income = txn.type == IncomeExpenseType.INCOME
    type_label = th.INCOME_LABEL if is_income else th.EXPENSE_LABEL
    type_emoji = "💰" if is_income else "💸"

    header_bg = "#1A73E8" if is_income else "#4A90D9"
    accent_color = "#1DB446" if is_income else "#E8547E"
    btn_primary_color = "#1DB446" if is_income else "#E8547E"

    category_name = txn.category.name_th if txn.category else None
    cat_emoji = _category_emoji(category_name)

    header = FlexBox(
        layout="vertical",
        background_color=header_bg,
        padding_all="16px",
        contents=[
            FlexBox(
                layout="horizontal",
                contents=[
                    FlexText(
                        text=f"{type_emoji} {type_label}",
                        color="#FFFFFF",
                        size="lg",
                        weight="bold",
                        flex=0,
                    ),
                ],
            ),
            FlexText(
                text="เลือกหมวดหมู่ แล้วใส่จำนวนเงินได้เลยครับ"
                if not is_income
                else "บันทึกรายรับของคุณครับ",
                color="#FFFFFFCC",
                size="xs",
                margin="sm",
                wrap=True,
            ),
        ],
    )

    body_rows: list = []

    if txn.ai_confidence is not None and txn.ai_confidence < LOW_CONFIDENCE_THRESHOLD:
        body_rows.append(
            FlexBox(
                layout="horizontal",
                background_color="#FFF3E0",
                corner_radius="8px",
                padding_all="8px",
                margin="none",
                contents=[
                    FlexText(
                        text=f"⚠ {th.LOW_CONFIDENCE_BADGE}",
                        size="xs",
                        color="#E09000",
                        weight="bold",
                        wrap=True,
                    ),
                ],
            )
        )

    body_rows.append(
        _field_row("📅 วันที่", format_thai_date(txn.txn_date))
    )
    body_rows.append(FlexSeparator(margin="md"))
    body_rows.append(
        _field_row("📝 รายการ", txn.description or "-")
    )
    body_rows.append(FlexSeparator(margin="md"))
    body_rows.append(
        FlexBox(
            layout="horizontal",
            margin="md",
            contents=[
                FlexText(text="💲 จำนวนเงิน", size="sm", color="#888888", flex=4),
                FlexText(
                    text=format_thb(txn.amount),
                    size="lg",
                    weight="bold",
                    color=accent_color,
                    align="end",
                    flex=6,
                ),
            ],
        )
    )
    body_rows.append(FlexSeparator(margin="md"))

    if category_name:
        body_rows.append(
            _field_row(f"{cat_emoji} หมวดหมู่", category_name)
        )
    else:
        body_rows.append(
            _field_row("📋 หมวดหมู่", "ไม่ระบุ")
        )

    if txn.product is not None:
        body_rows.append(FlexSeparator(margin="md"))
        qty_str = f"{txn.quantity.normalize():f} {txn.product.unit}" if txn.quantity else "-"
        body_rows.append(
            _field_row("📦 สินค้า", f"{txn.product.name} ({qty_str})")
        )

    body = FlexBox(
        layout="vertical",
        padding_all="16px",
        spacing="md",
        contents=body_rows,
    )

    buttons = [
        FlexButton(
            style="primary",
            color=btn_primary_color,
            height="sm",
            action=PostbackAction(
                label=f"✅ {th.TRANSACTION_CONFIRM_BUTTON}",
                data=f"action=confirm&id={txn.id}",
                display_text=th.TRANSACTION_CONFIRM_BUTTON,
            ),
        ),
    ]

    edit_action = (
        URIAction(
            label=f"✏️ {th.TRANSACTION_EDIT_BUTTON}",
            uri=f"https://liff.line.me/{settings.liff_id}/transactions?edit={txn.id}",
        )
        if settings.liff_id
        else PostbackAction(
            label=f"✏️ {th.TRANSACTION_EDIT_BUTTON}",
            data=f"action=edit&id={txn.id}",
            display_text=th.TRANSACTION_EDIT_BUTTON,
        )
    )
    buttons.append(
        FlexButton(style="secondary", height="sm", action=edit_action)
    )
    buttons.append(
        FlexButton(
            style="secondary",
            height="sm",
            action=PostbackAction(
                label=th.TRANSACTION_CANCEL_BUTTON,
                data=f"action=cancel&id={txn.id}",
                display_text=th.TRANSACTION_CANCEL_BUTTON,
            ),
        ),
    )

    footer = FlexBox(
        layout="vertical",
        spacing="sm",
        padding_all="12px",
        contents=buttons,
    )

    return FlexBubble(
        header=header,
        body=body,
        footer=footer,
    )


def _field_row(label: str, value: str) -> FlexBox:
    return FlexBox(
        layout="horizontal",
        margin="md",
        contents=[
            FlexText(text=label, size="sm", color="#888888", flex=4),
            FlexText(
                text=value,
                size="sm",
                color="#333333",
                weight="bold",
                align="end",
                flex=6,
                wrap=True,
            ),
        ],
    )


def build_transaction_confirmation_message(transactions: list[Transaction]) -> FlexMessage:
    bubbles = [_build_bubble(txn) for txn in transactions]
    alt_text = f"พบ {len(transactions)} รายการ กรุณายืนยัน"
    return FlexMessage(alt_text=alt_text, contents=FlexCarousel(contents=bubbles))
