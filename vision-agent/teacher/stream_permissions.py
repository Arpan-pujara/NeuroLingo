"""Stream call permissions for the AI teacher in audio_room lessons."""

from __future__ import annotations

import logging
from typing import Any

from getstream.models import MemberRequest

from teacher.config import AGENT_USER_ID

logger = logging.getLogger(__name__)

LESSON_SPEAKER_ROLE = "host"
SEND_AUDIO = "send-audio"


async def grant_agent_audio_publish(call: Any) -> None:
    """
    audio_room listeners cannot publish; hosts need send-audio.

    Run after create_call and before agent.join() so SetPublisher succeeds.
    """
    update_members = getattr(call, "update_call_members", None)
    if callable(update_members):
        await update_members(
            update_members=[
                MemberRequest(user_id=AGENT_USER_ID, role=LESSON_SPEAKER_ROLE)
            ]
        )

    update_permissions = getattr(call, "update_user_permissions", None)
    if callable(update_permissions):
        await update_permissions(
            user_id=AGENT_USER_ID,
            grant_permissions=[SEND_AUDIO],
        )
        logger.info("Granted %s to agent %s", SEND_AUDIO, AGENT_USER_ID)
