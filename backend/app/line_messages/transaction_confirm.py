"""Flex Message for confirming AI-parsed transactions. Every transaction
starts as `pending` and must be confirmed, edited, or cancelled by the user
before it counts toward any total (see tax_engine / transaction_service).
"""

from decimal import Decimal

from linebot.v3.messaging import (
    FlexBox,
    FlexBubble,
    FlexButton,
    FlexCarousel,
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
from app.models.enums import IncomeExpenseType, TransactionSource

LOW_CONFIDENCE_THRESHOLD = Decimal("0.70")

INCOME_COLOR = "#16A34A"
EXPENSE_COLOR = "#DC2626"
MUTED_TEXT = "#8B98A8"
BODY_TEXT = "#33415A"

SOURCE_ICON = {
    TransactionSource.TEXT: "📝",
    TransactionSource.VOICE: "🎙️",
    TransactionSource.IMAGE: "🧾",
    TransactionSource.WEB: "🖥️",
}
SOURCE_LABEL = {
    TransactionSource.TEXT: "ข้อความ",
    TransactionSource.VOICE: "เสียง",
    TransactionSource.IMAGE: "รูปสลิป",
    TransactionSource.WEB: "เว็บ",
}


def _build_bubble(txn: Transaction) -> FlexBubble:
    is_income = txn.type == IncomeExpenseType.INCOME
    type_label = th.INCOME_LABEL if is_income else th.EXPENSE_LABEL
    accent = INCOME_COLOR if is_income else EXPENSE_COLOR
    sign = "+" if is_income else "−"

    header = FlexBox(
        layout="vertical",
        background_color=accent,
        padding_all="16px",
        corner_radius="12px",
        contents=[
            FlexBox(
                layout="horizontal",
                contents=[
                    FlexText(text=f"{'📈' if is_income else '📉'} {type_label}", color="#FFFFFF", weight="bold", size="sm", flex=1),
                    FlexText(
                        text=f"{SOURCE_ICON[txn.source]} {SOURCE_LABEL[txn.source]}",
                        color="#FFFFFF",
                        size="xs",
                        align="end",
                    ),
                ],
            ),
            FlexText(
                text=f"{sign}{format_thb(txn.amount)}",
                weight="bold",
                size="3xl",
                color="#FFFFFF",
                margin="sm",
            ),
        ],
    )

    detail_rows: list = [
        FlexText(text=txn.description or "-", size="md", color=BODY_TEXT, wrap=True, weight="bold"),
    ]
    if txn.product is not None:
        qty = f" × {txn.quantity:g}" if txn.quantity is not None else ""
        detail_rows.append(
            FlexBox(
                layout="baseline",
                margin="sm",
                contents=[
                    FlexText(text="📦", size="sm", flex=0),
                    FlexText(text=f"{txn.product.name}{qty}", size="sm", color=MUTED_TEXT, margin="sm", wrap=True),
                ],
            )
        )
    if txn.category is not None:
        detail_rows.append(
            FlexBox(
                layout="baseline",
                margin="sm",
                contents=[
                    FlexText(text="🏷️", size="sm", flex=0),
                    FlexText(text=txn.category.name_th, size="sm", color=MUTED_TEXT, margin="sm"),
                ],
            )
        )
    detail_rows.append(
        FlexBox(
            layout="baseline",
            margin="sm",
            contents=[
                FlexText(text="📅", size="sm", flex=0),
                FlexText(text=format_thai_date(txn.txn_date), size="sm", color=MUTED_TEXT, margin="sm"),
            ],
        )
    )

    body_contents: list = []
    if txn.ai_confidence is not None and txn.ai_confidence < LOW_CONFIDENCE_THRESHOLD:
        body_contents.append(
            FlexText(text=f"⚠ {th.LOW_CONFIDENCE_BADGE}", size="xs", color="#E09000", weight="bold")
        )
        body_contents.append(FlexSeparator(margin="md"))
    body_contents.append(
        FlexBox(layout="vertical", contents=detail_rows, margin="md" if body_contents else "none")
    )

    buttons = [
        FlexButton(
            style="primary",
            color=accent,
            height="sm",
            action=PostbackAction(
                label=f"✓ {th.TRANSACTION_CONFIRM_BUTTON}",
                data=f"action=confirm&id={txn.id}",
                display_text=th.TRANSACTION_CONFIRM_BUTTON,
            ),
        ),
    ]
    # With LIFF, edit in the web form; without it, edit in chat (cancel + re-send).
    edit_action = (
        URIAction(label=th.TRANSACTION_EDIT_BUTTON, uri=f"https://liff.line.me/{settings.liff_id}/transactions?edit={txn.id}")
        if settings.liff_id
        else PostbackAction(label=th.TRANSACTION_EDIT_BUTTON, data=f"action=edit&id={txn.id}", display_text=th.TRANSACTION_EDIT_BUTTON)
    )
    buttons.append(FlexButton(style="secondary", height="sm", action=edit_action))
    buttons.append(
        FlexButton(
            style="secondary",
            height="sm",
            action=PostbackAction(
                label=th.TRANSACTION_CANCEL_BUTTON,
                data=f"action=cancel&id={txn.id}",
                display_text=th.TRANSACTION_CANCEL_BUTTON,
            ),
        )
    )

    return FlexBubble(
        size="mega",
        header=header,
        body=FlexBox(layout="vertical", contents=body_contents, padding_all="16px"),
        footer=FlexBox(layout="vertical", spacing="sm", padding_all="16px", padding_top="0px", contents=buttons),
    )


def build_transaction_confirmation_message(transactions: list[Transaction]) -> FlexMessage:
    bubbles = [_build_bubble(txn) for txn in transactions]
    alt_text = f"พบ {len(transactions)} รายการ กรุณายืนยัน"
    return FlexMessage(alt_text=alt_text, contents=FlexCarousel(contents=bubbles))
