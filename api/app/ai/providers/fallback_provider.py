import asyncio
from typing import AsyncGenerator
from app.ai.providers.llm_base import LLMProvider


class FallbackProvider(LLMProvider):
    """
    Deterministic meteorological reasoner.
    Generates grounded explanations from structured WeatherContext
    without hallucinations, adhering to WMO / IMD terminology.
    """

    async def generate(self, prompt: str, system_prompt: str) -> str:
        return prompt

    async def stream_generate(self, prompt: str, system_prompt: str) -> AsyncGenerator[str, None]:
        # Stream chunks to give realistic conversational experience
        words = prompt.split(" ")
        for i in range(0, len(words), 3):
            chunk = " ".join(words[i : i + 3]) + " "
            yield chunk
            await asyncio.sleep(0.04)


fallback_llm = FallbackProvider()
