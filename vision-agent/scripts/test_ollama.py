#!/usr/bin/env python3
"""Quick check that Ollama is reachable via the OpenAI-compatible API."""

from __future__ import annotations

import sys
from pathlib import Path

# Allow `uv run python scripts/test_ollama.py` from vision-agent/
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import teacher.config  # noqa: F401 — load .env
from teacher.config import OLLAMA_API_KEY, OLLAMA_BASE_URL, OLLAMA_MODEL

from openai import OpenAI


def main() -> None:
    client = OpenAI(base_url=OLLAMA_BASE_URL, api_key=OLLAMA_API_KEY)

    print(f"Ollama base URL: {OLLAMA_BASE_URL}")
    print(f"Model: {OLLAMA_MODEL}")
    print("Sending test prompt…\n")

    response = client.chat.completions.create(
        model=OLLAMA_MODEL,
        messages=[{"role": "user", "content": "Teach me one Spanish greeting in one short sentence."}],
    )

    content = response.choices[0].message.content
    print(content or "(empty response)")
    print("\nOllama OK — you can run: uv run agent.py serve")


if __name__ == "__main__":
    main()
