import asyncio
import json
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from app.ai.pipeline import ai_pipeline
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.conversation_memory import conversation_memory

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def handle_chat_message(req: ChatRequest):
    session_id, session = conversation_memory.get_or_create(req.session_id)
    session.add_turn("user", req.message)

    intent, entities = ai_pipeline.detect_intent_and_entities(req.message, session=session)
    if req.language and req.language != "en":
        entities["language"] = req.language

    context = await ai_pipeline.build_context(intent, entities)
    response_text, meta = await ai_pipeline.generate_grounded_response(intent, entities, context, session=session)
    followups = ai_pipeline.generate_dynamic_followups(intent, entities, context)

    return ChatResponse(
        response=response_text,
        session_id=session_id,
        intent=intent,
        entities=entities,
        risk_level=meta.get("risk_level", "LOW"),
        advisory=meta.get("advisory"),
        action=meta.get("action"),
        weather_context=context,
        sources=context.sources,
        suggested_followups=followups,
        language=entities.get("language", "en")
    )


@router.post("/stream")
async def handle_chat_stream(req: ChatRequest):
    session_id, session = conversation_memory.get_or_create(req.session_id)
    session.add_turn("user", req.message)

    async def event_generator():
        # Stage 1: Intent & Location
        yield {"event": "stage", "data": json.dumps({"stage": "locating", "text": "Analyzing query & conversational memory..."})}
        await asyncio.sleep(0.15)

        intent, entities = ai_pipeline.detect_intent_and_entities(req.message, session=session)
        if req.language and req.language != "en":
            entities["language"] = req.language

        # Stage 2: Weather Data Retrieval
        loc = entities.get("location", "New Delhi")
        yield {"event": "stage", "data": json.dumps({"stage": "retrieving", "text": f"Retrieving verified meteorological data for {loc}..."})}
        await asyncio.sleep(0.15)

        context = await ai_pipeline.build_context(intent, entities)

        # Stage 3: Risk Evaluation
        yield {"event": "stage", "data": json.dumps({"stage": "analyzing", "text": "Calculating deterministic weather risk & safety thresholds..."})}
        await asyncio.sleep(0.15)

        response_text, meta = await ai_pipeline.generate_grounded_response(intent, entities, context, session=session)
        followups = ai_pipeline.generate_dynamic_followups(intent, entities, context)

        # Stage 4: Grounded Generation
        yield {"event": "stage", "data": json.dumps({"stage": "generating", "text": "Synthesizing grounded meteorological advisory..."})}
        await asyncio.sleep(0.1)

        # Stream words smoothly
        words = response_text.split(" ")
        chunk_size = 3
        for i in range(0, len(words), chunk_size):
            chunk = " ".join(words[i : i + chunk_size]) + " "
            yield {"event": "token", "data": json.dumps({"token": chunk})}
            await asyncio.sleep(0.03)

        # Final completion event with full metadata
        yield {
            "event": "done",
            "data": json.dumps({
                "response": response_text,
                "session_id": session_id,
                "intent": intent,
                "risk_level": meta.get("risk_level", "LOW"),
                "advisory": meta.get("advisory"),
                "action": meta.get("action"),
                "sources": [s.model_dump() for s in context.sources],
                "suggested_followups": followups,
                "weather_context": context.model_dump()
            })
        }

    return EventSourceResponse(event_generator())
