"""Agent factory and call lifecycle — shapes verified against vision-agents 0.6.1."""

from __future__ import annotations

import logging
from typing import Any

from vision_agents.core import agents
from vision_agents.core.agents.agents import Agent
from vision_agents.core.edge.types import User
from vision_agents.core.instructions import Instructions
from vision_agents.plugins import fast_whisper, getstream, kokoro, openai

from teacher.config import (
    AGENT_USER_ID,
    AGENT_USER_NAME,
    KOKORO_VOICE,
    LLM_BACKEND,
    OLLAMA_API_KEY,
    OLLAMA_BASE_URL,
    OLLAMA_MODEL,
    OPENAI_REALTIME_MODEL,
    OPENAI_REALTIME_VOICE,
    WHISPER_LANGUAGE,
    WHISPER_MODEL_SIZE,
)
from teacher.prompts import (
    default_lesson_context,
    lesson_context_from_call_custom,
)
from teacher.stream_permissions import grant_agent_audio_publish

logger = logging.getLogger(__name__)


def create_agent() -> Agent:
    """
    Build a voice-only agent on Stream Edge.

    Default: Ollama LLM + local faster-whisper STT + Kokoro TTS (no OpenAI credits).
    Set LLM_BACKEND=openai_realtime to use OpenAI speech-to-speech instead.
    """
    if LLM_BACKEND == "openai_realtime":
        logger.info("Using OpenAI Realtime (LLM_BACKEND=openai_realtime)")
        return agents.Agent(
            edge=getstream.Edge(),
            agent_user=User(name=AGENT_USER_NAME, id=AGENT_USER_ID),
            instructions=default_lesson_context().system_prompt,
            llm=openai.Realtime(
                model=OPENAI_REALTIME_MODEL,
                voice=OPENAI_REALTIME_VOICE,
                send_video=False,
            ),
        )

    logger.info(
        "Using Ollama LLM at %s (model=%s) + local STT/TTS",
        OLLAMA_BASE_URL,
        OLLAMA_MODEL,
    )
    return agents.Agent(
        edge=getstream.Edge(),
        agent_user=User(name=AGENT_USER_NAME, id=AGENT_USER_ID),
        instructions=default_lesson_context().system_prompt,
        llm=openai.LLM(
            model=OLLAMA_MODEL,
            api_key=OLLAMA_API_KEY,
            base_url=OLLAMA_BASE_URL,
        ),
        stt=fast_whisper.STT(
            model_size=WHISPER_MODEL_SIZE,  # type: ignore[arg-type]
            language=WHISPER_LANGUAGE,
        ),
        tts=kokoro.TTS(voice=KOKORO_VOICE),
    )


async def _read_call_custom(call: Any) -> dict[str, Any] | None:
    try:
        response = await call.get()
    except Exception:
        logger.warning("Could not load call metadata; using default lesson context", exc_info=True)
        return None

    call_data = getattr(response, "call", None) or getattr(response, "data", None)
    if call_data is None:
        return None

    custom = getattr(call_data, "custom", None)
    if isinstance(custom, dict):
        return custom
    return None


async def join_call(agent: Agent, call_type: str, call_id: str) -> None:
    """
    Join a Stream audio lesson call and run until it ends.

    AgentLauncher.start_session() runs this in a background task with:
      join_call(agent, call_type, call_id)
    """
    call = await agent.create_call(call_type, call_id)

    lesson = lesson_context_from_call_custom(await _read_call_custom(call))
    if lesson is None:
        lesson = default_lesson_context()
        logger.info("Using default lesson context (no call custom data)")
    else:
        logger.info(
            "Loaded lesson context from call custom: %s / %s",
            lesson.language_id,
            lesson.lesson_title or "untitled",
        )

    agent.instructions = Instructions(input_text=lesson.system_prompt)

    await grant_agent_audio_publish(call)

    async with agent.join(call):
        if lesson.opening_line:
            await agent.say(lesson.opening_line, interrupt=False)
        await agent.finish()
