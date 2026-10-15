import os

from dotenv import load_dotenv

load_dotenv()

GEMINI_BASE_URL = os.getenv("GEMINI_BASE_URL", "https://gen.ai.kku.ac.th/api/v1")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")
