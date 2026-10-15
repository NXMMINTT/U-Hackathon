from fastapi import APIRouter

from app.data_loader import load_json

router = APIRouter(prefix="/api/market", tags=["market-radar"])


@router.get("/platforms")
def get_platforms():
    return load_json("platforms.json")


@router.get("/competitor-prices")
def get_competitor_prices():
    return load_json("competitor-prices.json")


@router.get("/trend")
def get_market_trend():
    return load_json("market-trend.json")


@router.get("/keyword-volume")
def get_keyword_volume():
    return load_json("keyword-volume.json")


@router.get("/eu-arbitrage")
def get_eu_arbitrage():
    return load_json("eu-arbitrage.json")
