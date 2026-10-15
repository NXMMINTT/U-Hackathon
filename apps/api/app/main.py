from fastapi import FastAPI

from app.core.logging import configure_logging

configure_logging()

app = FastAPI(title="U-Ledger AI API")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
