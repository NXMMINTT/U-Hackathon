from fastapi import FastAPI

from app.core.logging import configure_logging
from app.routers import line_webhook

configure_logging()

app = FastAPI(title="U-Ledger AI API")

app.include_router(line_webhook.router, prefix="/api/v1")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
