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


def _build_bubble(txn: Transaction) -> FlexBubble:
    is_income = txn.type == IncomeExpenseType.INCOME
    type_label = th.INCOME_LABEL if is_income else th.EXPENSE_LABEL
    amount_color = "#1DB446" if is_income else "#E03C3C"

    body_contents: list = [
        FlexText(text=type_label, weight="bold", color=amount_color, size="sm"),
        FlexText(
            text=format_thb(txn.amount),
            weight="bold",
            size="xl",
            margin="sm",
        ),
        FlexText(text=txn.description or "-", size="sm", color="#666666", margin="md", wrap=True),
        FlexText(text=format_thai_date(txn.txn_date), size="xs", color="#999999", margin="sm"),
    ]
    if txn.ai_confidence is not None and txn.ai_confidence < LOW_CONFIDENCE_THRESHOLD:
        body_contents.insert(
            0, FlexText(text=f"⚠ {th.LOW_CONFIDENCE_BADGE}", size="xs", color="#E09000", weight="bold")
        )

    buttons = [
        FlexButton(
            style="primary",
            color=amount_color,
            action=PostbackAction(
                label=th.TRANSACTION_CONFIRM_BUTTON,
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
    buttons.append(FlexButton(style="secondary", action=edit_action))
    buttons.append(
        FlexButton(
            style="secondary",
            action=PostbackAction(
                label=th.TRANSACTION_CANCEL_BUTTON,
                data=f"action=cancel&id={txn.id}",
                display_text=th.TRANSACTION_CANCEL_BUTTON,
            ),
        )
    )

    return FlexBubble(
        body=FlexBox(layout="vertical", contents=body_contents),
        footer=FlexBox(layout="horizontal", spacing="sm", contents=buttons),
    )


def build_transaction_confirmation_message(transactions: list[Transaction]) -> FlexMessage:
    bubbles = [_build_bubble(txn) for txn in transactions]
    alt_text = f"พบ {len(transactions)} รายการ กรุณายืนยัน"
    return FlexMessage(alt_text=alt_text, contents=FlexCarousel(contents=bubbles))
