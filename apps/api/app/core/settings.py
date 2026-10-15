from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

API_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://uledger:uledger@localhost:5432/uledger"

    line_channel_secret: str = ""
    line_channel_access_token: str = ""
    liff_id: str = ""

    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"

    elevenlabs_api_key: str = ""
    elevenlabs_voice_id: str = ""
    enable_voice_reply: bool = False

    jwt_secret: str = "change-me"
    public_base_url: str = "http://localhost:8000"
    macro_data_mode: str = "mock"

    tax_rules_path: Path = API_ROOT / "config" / "tax_rules.yaml"


settings = Settings()
