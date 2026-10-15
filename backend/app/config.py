"""Config for the U-Bot / Market Radar / daily-knowledge features.

Kept separate from app.core.settings on purpose: that module configures
Gemini with a direct Google AI Studio key for parsing LINE slips
(app/services/gemini_service.py), while U-Bot talks to Gemini through the
KKU IntelSphere OpenAI-compatible proxy with a different key and base URL.
"""

import os

from dotenv import load_dotenv

load_dotenv()

GEMINI_BASE_URL = os.getenv("GEMINI_BASE_URL", "https://gen.ai.kku.ac.th/api/v1")
GEMINI_API_KEY = os.getenv("UBOT_GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("UBOT_GEMINI_MODEL", "gemini-3.5-flash-lite")

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
ELEVENLABS_MODEL_ID = os.getenv("ELEVENLABS_MODEL_ID", "eleven_v3")
