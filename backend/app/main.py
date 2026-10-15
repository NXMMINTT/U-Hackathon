from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import b2b, insights, knowledge, market_radar, my_business, ubot, voice

app = FastAPI(title="U-Ledger AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(my_business.router)
app.include_router(market_radar.router)
app.include_router(insights.router)
app.include_router(ubot.router)
app.include_router(b2b.router)
app.include_router(voice.router)
app.include_router(knowledge.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "U-Ledger AI API"}
