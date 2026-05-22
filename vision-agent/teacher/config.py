"""Load Stream and LLM credentials from the repo root or local .env."""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parents[2]
VISION_AGENT_ROOT = Path(__file__).resolve().parents[1]

# Parent app secrets first, then vision-agent/.env overrides.
load_dotenv(REPO_ROOT / ".env")
load_dotenv(VISION_AGENT_ROOT / ".env", override=True)

# getstream Python SDK expects STREAM_API_SECRET; NeuroLingo uses STREAM_SECRET_KEY.
if not os.getenv("STREAM_API_SECRET") and os.getenv("STREAM_SECRET_KEY"):
    os.environ["STREAM_API_SECRET"] = os.environ["STREAM_SECRET_KEY"]

DEFAULT_CALL_TYPE = os.getenv("STREAM_AUDIO_CALL_TYPE", "audio_room")
AGENT_USER_ID = os.getenv("NEUROLINGO_AGENT_USER_ID", "neuro-lingo-teacher")
AGENT_USER_NAME = os.getenv("NEUROLINGO_AGENT_USER_NAME", "NeuroLingo Teacher")

# ollama (default) | openai_realtime
LLM_BACKEND = os.getenv("LLM_BACKEND", "ollama").strip().lower()

# Ollama OpenAI-compatible API (https://github.com/ollama/ollama/blob/main/docs/openai.md)
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY", "ollama")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen3:8b")

# Optional: OpenAI Realtime (needs paid OpenAI credits)
OPENAI_REALTIME_MODEL = os.getenv("OPENAI_REALTIME_MODEL", "gpt-realtime-2")
OPENAI_REALTIME_VOICE = os.getenv("OPENAI_REALTIME_VOICE", "marin")

# Local voice pipeline (used with ollama backend)
WHISPER_MODEL_SIZE = os.getenv("WHISPER_MODEL_SIZE", "tiny")
WHISPER_LANGUAGE = os.getenv("WHISPER_LANGUAGE", "en")
KOKORO_VOICE = os.getenv("KOKORO_VOICE", "af_heart")

SERVER_HOST = os.getenv("VISION_AGENT_HOST", "127.0.0.1")
SERVER_PORT = int(os.getenv("VISION_AGENT_PORT", "8000"))


def validate_required_env() -> None:
    """Fail fast with a clear message before AgentLauncher warmup."""
    missing: list[str] = []
    if not os.getenv("STREAM_API_KEY"):
        missing.append("STREAM_API_KEY")
    if not os.getenv("STREAM_API_SECRET"):
        missing.append("STREAM_API_SECRET (or STREAM_SECRET_KEY in the repo root .env)")

    if LLM_BACKEND == "openai_realtime":
        if not os.getenv("OPENAI_API_KEY"):
            missing.append("OPENAI_API_KEY")
    elif LLM_BACKEND != "ollama":
        raise SystemExit(
            f"Unknown LLM_BACKEND={LLM_BACKEND!r}. Use 'ollama' or 'openai_realtime'."
        )

    if missing:
        raise SystemExit(
            "Missing required environment variables for the vision agent:\n  - "
            + "\n  - ".join(missing)
            + "\n\nSet them in the repo root .env or vision-agent/.env. See vision-agent/.env.example."
        )
