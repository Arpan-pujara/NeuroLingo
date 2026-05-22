# NeuroLingo Vision Agent (voice teacher)

Python service for live **audio-only** language lessons. Uses **Stream Edge** for transport and, by default, **Ollama** for the LLM (no OpenAI credits).

## Prerequisites

- Python 3.12+
- [uv](https://docs.astral.sh/uv/)
- [Ollama](https://ollama.com/) running locally with your model pulled, e.g. `ollama pull qwen3:8b`
- Credentials in the **repo root** `.env` (or `vision-agent/.env`):

| Variable | Source |
|----------|--------|
| `STREAM_API_KEY` | NeuroLingo `.env` |
| `STREAM_SECRET_KEY` | NeuroLingo `.env` (auto-mapped to `STREAM_API_SECRET`) |

**Default LLM (Ollama)** — no `OPENAI_API_KEY` required:

| Variable | Default |
|----------|---------|
| `LLM_BACKEND` | `ollama` |
| `OLLAMA_BASE_URL` | `http://localhost:11434/v1` |
| `OLLAMA_API_KEY` | `ollama` |
| `OLLAMA_MODEL` | `qwen3:8b` |

Voice uses local **faster-whisper** (STT) and **Kokoro** (TTS). First agent start downloads model weights.

## Install

```bash
cd vision-agent
uv sync
```

## Test Ollama only

```bash
uv run python scripts/test_ollama.py
```

This uses the same OpenAI-compatible client as the agent:

```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
```

## Run (HTTP server — used by the Expo app)

```bash
uv run agent.py serve --host 127.0.0.1 --port 8000
```

Start a session when a learner joins a lesson call:

```bash
curl -X POST http://127.0.0.1:8000/calls/nl-es-es-lesson-1/sessions \
  -H "Content-Type: application/json" \
  -d '{"call_type": "audio_room"}'
```

## Run (console — local testing)

```bash
uv run agent.py run --call-type audio_room --call-id nl-es-es-lesson-1 --no-demo
```

## OpenAI Realtime (optional)

If you have OpenAI credits, set in `.env`:

```
LLM_BACKEND=openai_realtime
OPENAI_API_KEY=sk-...
```

## Teaching behavior

- The teacher **always speaks English** for explanations and feedback.
- Lesson content comes from Stream call `custom` (goals, vocabulary, phrases, `systemPrompt`, `openingLine`).
- The Expo app proxies agent start/stop via `/api/agent/start` and `/api/agent/stop` (`VISION_AGENT_URL` in repo `.env`).

## Verify setup

```bash
uv run python scripts/verify_sdk.py
uv run python scripts/test_ollama.py
```
