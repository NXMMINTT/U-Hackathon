"""Thin wrapper around the LINE Messaging API: reply/push messages and the
typing/loading animation shown while the webhook processes a message.
"""

from functools import lru_cache

from linebot.v3.messaging import (
    ApiClient,
    Configuration,
    Message,
    MessagingApi,
    PushMessageRequest,
    ReplyMessageRequest,
    ShowLoadingAnimationRequest,
    TextMessage,
)

from app.core.settings import settings


@lru_cache(maxsize=1)
def _configuration() -> Configuration:
    return Configuration(access_token=settings.line_channel_access_token)


def reply_messages(reply_token: str, messages: list[Message]) -> None:
    with ApiClient(_configuration()) as api_client:
        MessagingApi(api_client).reply_message(
            ReplyMessageRequest(reply_token=reply_token, messages=messages)
        )


def reply_text(reply_token: str, text: str) -> None:
    reply_messages(reply_token, [TextMessage(text=text)])


def push_messages(user_id: str, messages: list[Message]) -> None:
    with ApiClient(_configuration()) as api_client:
        MessagingApi(api_client).push_message(PushMessageRequest(to=user_id, messages=messages))


def push_text(user_id: str, text: str) -> None:
    push_messages(user_id, [TextMessage(text=text)])


def show_loading_animation(user_id: str, loading_seconds: int = 5) -> None:
    with ApiClient(_configuration()) as api_client:
        MessagingApi(api_client).show_loading_animation(
            ShowLoadingAnimationRequest(chat_id=user_id, loading_seconds=loading_seconds)
        )
