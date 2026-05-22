"""
NeuroLingo AI language teacher — voice-only Vision Agent (Ollama + local STT/TTS by default).

Run locally:
  uv run agent.py run --call-type audio_room --call-id nl-es-es-lesson-1
  uv run agent.py serve --host 127.0.0.1 --port 8000

HTTP (production):
  POST /calls/{call_id}/sessions  {"call_type": "audio_room"}
"""

from __future__ import annotations

import teacher.config  # noqa: F401 — load .env before SDK imports
from teacher.config import validate_required_env
from teacher.factory import create_agent, join_call
from vision_agents.core import AgentLauncher, Runner

launcher = AgentLauncher(
    create_agent=create_agent,
    join_call=join_call,
    max_sessions_per_call=1,
    agent_idle_timeout=120.0,
)

runner = Runner(launcher=launcher)


def main() -> None:
    import sys

    # Allow `agent.py --help` without keys; validate before run/serve.
    if len(sys.argv) > 1 and sys.argv[1] in ("run", "serve"):
        validate_required_env()
    runner.cli()


if __name__ == "__main__":
    main()
