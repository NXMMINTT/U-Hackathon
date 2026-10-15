from typing import Optional

from fastapi import APIRouter, HTTPException

from app.data_loader import load_json

router = APIRouter(prefix="/api/premium", tags=["premium"])


def _find_user(user_id: str) -> dict:
    data = load_json("subscription.json")
    if data["current_user"]["user_id"] == user_id:
        return data["current_user"]
    user = next((u for u in data["demo_users"] if u["user_id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/plans")
def get_plans():
    data = load_json("subscription.json")
    return data["plans"]


@router.get("/status-rules")
def get_status_rules():
    data = load_json("subscription.json")
    return data["status_rules"]


@router.get("/status")
def get_status(user_id: Optional[str] = None):
    """สถานะ subscription ของ user คนเดียว — ไม่ใส่ user_id จะได้ current_user (ร้านของฉัน)"""
    data = load_json("subscription.json")
    if not user_id:
        return data["current_user"]
    return _find_user(user_id)


@router.get("/users")
def list_users():
    """รายชื่อ user ตัวอย่างครบทุกสถานะ (free/trialing/active/past_due/canceled/expired) ไว้สลับทดสอบ UI"""
    data = load_json("subscription.json")
    return [data["current_user"], *data["demo_users"]]


@router.get("/billing-history")
def billing_history(user_id: Optional[str] = None):
    data = load_json("subscription.json")
    history = data["billing_history"]
    if user_id:
        history = [h for h in history if h["user_id"] == user_id]
    return history
