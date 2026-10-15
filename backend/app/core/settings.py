from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

API_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://uledger:uledger@localhost:5432/uledger"

    line_channel_secret: str = ""
    line_channel_access_token: str = ""
    liff_id: str = ""
    # Dev/demo only (ignored when LIFF_ID is set): show this LINE user's shop on the dashboard instead of the demo shop.
    dashboard_line_user_id: str = ""

    # KKU IntelSphere (OpenAI-compatible Gemini) — LINE bot parsing and U-Bot
    kku_base_url: str = "https://gen.ai.kku.ac.th/api/v1"
    kku_api_key: str = ""
    kku_model: str = "gemini-3.5-flash-lite"

    elevenlabs_api_key: str = ""
    elevenlabs_voice_id: str = ""
    enable_voice_reply: bool = False

    jwt_secret: str = "change-me"
    public_base_url: str = "http://localhost:8000"
    frontend_origin: str = "http://localhost:3000"
    macro_data_mode: str = "mock"

    tax_rules_path: Path = API_ROOT / "config" / "tax_rules.yaml"
    upload_dir: Path = API_ROOT / "uploads"


settings = Settings()
