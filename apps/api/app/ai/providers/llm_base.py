from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, Optional


class LLMProvider(ABC):
    """Abstract interface for LLM backends."""

    @abstractmethod
    async def generate(self, prompt: str, system_prompt: str) -> str:
        """Generate a complete text response."""
        pass

    @abstractmethod
    async def stream_generate(self, prompt: str, system_prompt: str) -> AsyncGenerator[str, None]:
        """Stream chunks of response text."""
        pass
