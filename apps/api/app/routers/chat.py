import asyncio
import json
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from app.ai.pipeline import ai_pipeline
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def handle_chat_message(req: ChatRequest):
    intent, entities = ai_pipeline.detect_intent_and_entities(req.message)
    if entities.get("language") != "hi" and req.language and req.language != "en":
        entities["language"] = req.language

    context = await ai_pipeline.build_context(intent, entities)
    response_text = ai_pipeline.generate_grounded_response(intent, entities, context)

    followups = [
        "Will it rain in Kanpur tomorrow?",
        "Is there any cyclone threat to Odisha?",
        "Show me the weather along Delhi to Jaipur route",
        "Give agricultural advisory for Punjab",
        "Explain today's weather in simple terms"
    ]

    return ChatResponse(
        response=response_text,
        intent=intent,
        entities=entities,
        weather_context=context,
        sources=context.sources,
        suggested_followups=followups,
        language=entities.get("language", "en")
    )


@router.post("/stream")
async def handle_chat_stream(req: ChatRequest):
    async def event_generator():
        yield {"event": "stage", "data": json.dumps({"stage": "locating", "text": "Understanding location & intent..."})}
        await asyncio.sleep(0.2)

        intent, entities = ai_pipeline.detect_intent_and_entities(req.message)
        if req.language:
            entities["language"] = req.language

        yield {"event": "stage", "data": json.dumps({"stage": "retrieving", "text": "Retrieving authoritative data from IMD..."})}
        await asyncio.sleep(0.2)

        context = await ai_pipeline.build_context(intent, entities)

        yield {"event": "stage", "data": json.dumps({"stage": "warnings", "text": "Checking CAP warnings & radar..."})}
        await asyncio.sleep(0.2)

        yield {"event": "stage", "data": json.dumps({"stage": "analyzing", "text": "Analyzing meteorological rules engine..."})}
        await asyncio.sleep(0.2)

        yield {"event": "stage", "data": json.dumps({"stage": "generating", "text": "Generating validated response..."})}
        await asyncio.sleep(0.1)

        response_text = ai_pipeline.generate_grounded_response(intent, entities, context)

        # Stream words
        words = response_text.split(" ")
        for i in range(0, len(words), 3):
            chunk = " ".join(words[i : i + 3]) + " "
            yield {"event": "token", "data": json.dumps({"token": chunk})}
            await asyncio.sleep(0.04)

        # Send final completion with context and sources
        yield {
            "event": "done",
            "data": json.dumps({
                "response": response_text,
                "intent": intent,
                "sources": [s.model_dump() for s in context.sources],
                "weather_context": context.model_dump()
            })
        }

    return EventSourceResponse(event_generator())
