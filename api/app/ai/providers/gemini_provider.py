import logging
from typing import AsyncGenerator
import httpx
from app.ai.providers.llm_base import LLMProvider
from app.core.config import settings

logger = logging.getLogger("forecastx.gemini")


class GeminiProvider(LLMProvider):
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

    async def generate(self, prompt: str, system_prompt: str) -> str:
        if not self.api_key:
            return prompt
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(
                    f"{self.endpoint}?key={self.api_key}",
                    json={
                        "system_instruction": {"parts": [{"text": system_prompt}]},
                        "contents": [{"parts": [{"text": prompt}]}]
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            return parts[0].get("text", prompt)
        except Exception as e:
            logger.warning(f"Gemini API request failed: {e}. Falling back to grounded prompt.")
        return prompt

    async def stream_generate(self, prompt: str, system_prompt: str) -> AsyncGenerator[str, None]:
        full_text = await self.generate(prompt, system_prompt)
        words = full_text.split(" ")
        for i in range(0, len(words), 3):
            yield " ".join(words[i : i + 3]) + " "


gemini_llm = GeminiProvider()
