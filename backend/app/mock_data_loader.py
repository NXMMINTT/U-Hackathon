import json
from functools import lru_cache
from pathlib import Path

MOCK_DATA_DIR = Path(__file__).resolve().parents[2] / "mock-data"


@lru_cache(maxsize=None)
def load_json(filename: str):
    path = MOCK_DATA_DIR / filename
    with path.open(encoding="utf-8") as f:
        return json.load(f)
