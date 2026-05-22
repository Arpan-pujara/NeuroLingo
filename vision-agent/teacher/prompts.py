"""System prompts for the English-speaking language teacher."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

LANGUAGE_NAMES: dict[str, str] = {
    "es": "Spanish",
    "fr": "French",
    "zh": "Chinese (Mandarin)",
}

DEFAULT_TARGET_LANGUAGE = "Spanish"


@dataclass(frozen=True)
class LessonContext:
    """Lesson metadata from a Stream call's custom fields."""

    language_id: str
    target_language: str
    lesson_title: str
    system_prompt: str
    opening_line: str | None
    goals: tuple[str, ...]
    focus_areas: tuple[str, ...]
    vocabulary_lines: tuple[str, ...]
    phrase_lines: tuple[str, ...]


def target_language_name(language_id: str | None, language_name: str | None = None) -> str:
    if language_name and language_name.strip():
        return language_name.strip()
    if language_id and language_id in LANGUAGE_NAMES:
        return LANGUAGE_NAMES[language_id]
    return DEFAULT_TARGET_LANGUAGE


def _normalize_string_list(value: Any) -> list[str]:
    if not value:
        return []
    if isinstance(value, list):
        items: list[str] = []
        for entry in value:
            if isinstance(entry, str) and entry.strip():
                items.append(entry.strip())
            elif isinstance(entry, dict):
                text = (
                    entry.get("description")
                    or entry.get("text")
                    or entry.get("term")
                    or entry.get("translation")
                )
                if text and str(text).strip():
                    items.append(str(text).strip())
        return items
    return []


def _format_vocabulary(custom: dict[str, Any]) -> tuple[str, ...]:
    raw = custom.get("vocabulary") or custom.get("vocabulary_items") or []
    if not isinstance(raw, list):
        return ()

    lines: list[str] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        term = str(item.get("term") or "").strip()
        translation = str(item.get("translation") or "").strip()
        pronunciation = str(item.get("pronunciation") or "").strip()
        if not term:
            continue
        line = f"- {term}"
        if translation:
            line += f" ({translation})"
        if pronunciation:
            line += f" [{pronunciation}]"
        lines.append(line)
    return tuple(lines)


def _format_phrases(custom: dict[str, Any]) -> tuple[str, ...]:
    raw = custom.get("phrases") or []
    if not isinstance(raw, list):
        return ()

    lines: list[str] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        text = str(item.get("text") or "").strip()
        translation = str(item.get("translation") or "").strip()
        context = str(item.get("context") or "").strip()
        if not text:
            continue
        line = f"- {text}"
        if translation:
            line += f" — {translation}"
        if context:
            line += f" ({context})"
        lines.append(line)
    return tuple(lines)


def _format_goals(custom: dict[str, Any]) -> tuple[str, ...]:
    raw = custom.get("goals") or []
    if not isinstance(raw, list):
        return ()

    lines: list[str] = []
    for item in raw:
        if isinstance(item, str) and item.strip():
            lines.append(f"- {item.strip()}")
        elif isinstance(item, dict):
            description = str(item.get("description") or "").strip()
            if description:
                lines.append(f"- {description}")
    return tuple(lines)


def build_teacher_instructions(
    target_language: str,
    *,
    lesson_title: str = "",
    extra_system_prompt: str = "",
    goals: tuple[str, ...] = (),
    focus_areas: tuple[str, ...] = (),
    vocabulary_lines: tuple[str, ...] = (),
    phrase_lines: tuple[str, ...] = (),
) -> str:
    """English-only teacher that introduces the target language through English."""
    lesson_line = f"\nLesson focus: {lesson_title}." if lesson_title else ""
    extra = f"\n\nLesson-specific guidance from the app:\n{extra_system_prompt.strip()}" if extra_system_prompt.strip() else ""

    sections: list[str] = [
        "You are NeuroLingo, a warm and patient AI language teacher in a live audio-only lesson.\n"
        "RULE: Always speak in English. Use English for explanations, feedback, and instructions.\n"
        f"Teach {target_language} to an absolute beginner through English — say words and short "
        f"phrases in {target_language}, then explain meaning and pronunciation in English.\n"
        "Keep replies short (about 2–3 sentences) unless leading a brief repeat-after-me drill.\n"
        "Encourage the learner to repeat target-language words aloud. Correct gently in English."
        f"{lesson_line}{extra}",
    ]

    if goals:
        sections.append("\nLearning goals for this session:\n" + "\n".join(goals))
    if focus_areas:
        sections.append("\nEmphasize these focus areas:\n" + "\n".join(f"- {area}" for area in focus_areas))
    if vocabulary_lines:
        sections.append("\nVocabulary to practice:\n" + "\n".join(vocabulary_lines))
    if phrase_lines:
        sections.append("\nPhrases to practice:\n" + "\n".join(phrase_lines))

    return "".join(sections)


def lesson_context_from_call_custom(custom: dict[str, Any] | None) -> LessonContext | None:
    if not custom:
        return None

    language_id = str(custom.get("languageId") or custom.get("language_id") or "").strip()
    lesson_title = str(custom.get("lessonTitle") or custom.get("lesson_title") or "").strip()
    language_name = str(custom.get("languageName") or custom.get("language_name") or "").strip()
    extra_prompt = str(
        custom.get("systemPrompt") or custom.get("system_prompt") or ""
    ).strip()
    opening_line = str(
        custom.get("openingLine") or custom.get("opening_line") or ""
    ).strip() or None

    goals = _format_goals(custom)
    focus_areas = tuple(_normalize_string_list(custom.get("focusAreas") or custom.get("focus_areas")))
    vocabulary_lines = _format_vocabulary(custom)
    phrase_lines = _format_phrases(custom)

    target = target_language_name(language_id or None, language_name or None)
    system_prompt = build_teacher_instructions(
        target,
        lesson_title=lesson_title,
        extra_system_prompt=extra_prompt,
        goals=goals,
        focus_areas=focus_areas,
        vocabulary_lines=vocabulary_lines,
        phrase_lines=phrase_lines,
    )

    return LessonContext(
        language_id=language_id,
        target_language=target,
        lesson_title=lesson_title,
        system_prompt=system_prompt,
        opening_line=opening_line,
        goals=goals,
        focus_areas=focus_areas,
        vocabulary_lines=vocabulary_lines,
        phrase_lines=phrase_lines,
    )


def default_lesson_context() -> LessonContext:
    target = DEFAULT_TARGET_LANGUAGE
    return LessonContext(
        language_id="es",
        target_language=target,
        lesson_title="",
        system_prompt=build_teacher_instructions(target),
        opening_line=(
            "Hi! I'm your NeuroLingo teacher. I'll explain everything in English "
            f"while we practice {target}. Let's start with a simple greeting — repeat after me: hola."
        ),
        goals=(),
        focus_areas=(),
        vocabulary_lines=(),
        phrase_lines=(),
    )
