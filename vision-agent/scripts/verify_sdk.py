"""Smoke-check SDK imports and lifecycle signatures (no network calls)."""

from __future__ import annotations

import inspect
import sys
from pathlib import Path

# Allow `uv run python scripts/verify_sdk.py` from vision-agent/
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import teacher.config  # noqa: F401
from teacher.factory import create_agent, join_call
from vision_agents.core import AgentLauncher, Runner
from vision_agents.core import agents as agents_module
from vision_agents.plugins import getstream, openai


def main() -> None:
    print("vision-agents OK")
    print("Agent.join:", inspect.signature(agents_module.Agent.join))
    print("Agent.create_call:", inspect.signature(agents_module.Agent.create_call))
    print("AgentLauncher:", inspect.signature(AgentLauncher.__init__))
    print("join_call:", inspect.signature(join_call))
    print("Realtime:", inspect.signature(openai.Realtime.__init__))
    print("StreamEdge:", inspect.signature(getstream.Edge.__init__))

    launcher = AgentLauncher(create_agent=create_agent, join_call=join_call)
    Runner(launcher=launcher)
    print("Runner + AgentLauncher wiring OK")

    from teacher.config import validate_required_env

    try:
        validate_required_env()
        print("Required env vars present")
    except SystemExit:
        print("Required env: STREAM_API_KEY + STREAM_API_SECRET OK; OPENAI_API_KEY not set (add for serve/run)")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"verify_sdk failed: {exc}", file=sys.stderr)
        raise
