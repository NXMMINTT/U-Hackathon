import logging
from datetime import date
from decimal import Decimal

from fastapi import APIRouter, BackgroundTasks, Header, HTTPException, Request
from linebot.v3.webhook import InvalidSignatureError, WebhookParser
from linebot.v3.webhooks import Event, MessageEvent, PostbackEvent, TextMessageContent, UserSource
from sqlalchemy.orm import Session

from app.core.db import SessionLocal
from app.core.settings import settings
from app.line_messages.transaction_confirm import build_transaction_confirmation_message
from app.locales import th
from app.models import Business
from app.models.enums import TransactionSource, TransactionStatus
from app.schemas.gemini import ParsedIntent
from app.services import gemini_service, line_service, transaction_service, user_service
from app.tax_engine import vat

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/line", tags=["line"])

_parser = WebhookParser(settings.line_channel_secret)


@router.post("/webhook")
async def line_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    x_line_signature: str = Header(...),
) -> dict[str, str]:
    body = (await request.body()).decode("utf-8")
    try:
        events = _parser.parse(body, x_line_signature)
    except InvalidSignatureError as exc:
        raise HTTPException(status_code=400, detail="invalid signature") from exc

    for event in events:
        background_tasks.add_task(_handle_event, event)

    return {"status": "ok"}


def _handle_event(event: Event) -> None:
    db = SessionLocal()
    try:
        if isinstance(event, MessageEvent):
            _handle_message_event(db, event)
        elif isinstance(event, PostbackEvent):
            _handle_postback_event(db, event)
    except Exception:
        logger.exception("failed to handle LINE event")
        reply_token = getattr(event, "reply_token", None)
        if reply_token:
            try:
                line_service.reply_text(reply_token, th.GENERIC_ERROR_REPLY)
            except Exception:
                logger.exception("failed to send error reply")
    finally:
        db.close()


def _resolve_business(db: Session, line_user_id: str) -> Business:
    user = user_service.get_or_create_user(db, line_user_id)
    business = user_service.get_or_create_default_business(db, user)
    db.commit()
    return business


def _handle_message_event(db: Session, event: MessageEvent) -> None:
    if not isinstance(event.source, UserSource) or event.source.user_id is None:
        return
    line_user_id = event.source.user_id

    if not isinstance(event.message, TextMessageContent):
        line_service.reply_text(event.reply_token, th.UNSUPPORTED_MESSAGE_TYPE_REPLY)
        return

    line_service.show_loading_animation(line_user_id)
    business = _resolve_business(db, line_user_id)

    parsed = gemini_service.parse_user_message(event.message.text)

    if parsed.intent == ParsedIntent.RECORD_TRANSACTIONS and parsed.transactions:
        created = transaction_service.create_pending_transactions(
            db, business, parsed, source=TransactionSource.TEXT, raw_input=event.message.text
        )
        db.commit()
        line_service.reply_messages(
            event.reply_token, [build_transaction_confirmation_message(created)]
        )
        return

    if parsed.intent == ParsedIntent.TAX_QUESTION:
        line_service.reply_text(event.reply_token, _tax_status_reply(db, business))
        return

    if parsed.intent == ParsedIntent.SUMMARY_REQUEST:
        line_service.reply_text(event.reply_token, _daily_summary_reply(db, business))
        return

    line_service.reply_text(
        event.reply_token, parsed.clarification_question or th.NO_TRANSACTIONS_PARSED_REPLY
    )


def _handle_postback_event(db: Session, event: PostbackEvent) -> None:
    if not isinstance(event.source, UserSource) or event.source.user_id is None:
        return
    line_user_id = event.source.user_id

    params = dict(pair.split("=", 1) for pair in event.postback.data.split("&") if "=" in pair)
    action = params.get("action")
    txn_id_raw = params.get("id")
    if action not in {"confirm", "cancel"} or txn_id_raw is None or not txn_id_raw.isdigit():
        return
    txn_id = int(txn_id_raw)

    business = _resolve_business(db, line_user_id)

    try:
        txn = transaction_service.get_owned_transaction(db, txn_id, business.id)
    except transaction_service.TransactionNotFoundError:
        line_service.reply_text(event.reply_token, th.TRANSACTION_NOT_FOUND_REPLY)
        return

    if txn.status != TransactionStatus.PENDING:
        line_service.reply_text(event.reply_token, th.TRANSACTION_ALREADY_RESOLVED_REPLY)
        return

    if action == "confirm":
        transaction_service.confirm_transaction(db, txn_id, business.id)
        db.commit()
        line_service.reply_text(event.reply_token, th.TRANSACTION_CONFIRMED_REPLY)
        _maybe_push_vat_warning(db, business, line_user_id)
    else:
        transaction_service.cancel_transaction(db, txn_id, business.id)
        db.commit()
        line_service.reply_text(event.reply_token, th.TRANSACTION_CANCELLED_REPLY)


def _tax_status_reply(db: Session, business: Business) -> str:
    annual_income = transaction_service.current_year_confirmed_income(db, business.id)
    ratio = vat.vat_threshold_ratio(annual_income)
    required = vat.is_vat_registration_required(annual_income)
    return th.tax_status_reply(annual_income, _percent(ratio), required)


def _daily_summary_reply(db: Session, business: Business) -> str:
    income_total, expense_total = transaction_service.day_totals(db, business.id, date.today())
    return th.daily_summary_reply(income_total, expense_total)


def _maybe_push_vat_warning(db: Session, business: Business, line_user_id: str) -> None:
    annual_income = transaction_service.current_year_confirmed_income(db, business.id)
    level = vat.vat_warning_level(annual_income)
    if level is None:
        return
    ratio = vat.vat_threshold_ratio(annual_income)
    line_service.push_text(line_user_id, th.vat_warning_message(_percent(ratio)))


def _percent(ratio: Decimal) -> str:
    return f"{ratio * 100:.0f}%"
