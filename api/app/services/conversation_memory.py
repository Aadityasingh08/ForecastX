"""
Conversation Memory & Context Session Store
Manages multi-turn dialogue context across interactions.
Enables seamless pronouns, elliptical queries ("What about the evening?", "How about Jaipur?"),
and retains temporal/spatial frames within an active user session without cross-session leakage.
"""
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple
import uuid


class ConversationTurn:
    def __init__(self, role: str, text: str, timestamp: Optional[datetime] = None):
        self.role = role  # 'user' | 'assistant'
        self.text = text
        self.timestamp = timestamp or datetime.now(timezone.utc)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "role": self.role,
            "text": self.text,
            "timestamp": self.timestamp.isoformat(),
        }


class SessionContext:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.last_location: Optional[str] = None
        self.last_district: Optional[str] = None
        self.last_state: Optional[str] = None
        self.last_coordinates: Optional[Dict[str, float]] = None
        self.last_target_date: Optional[str] = None
        self.last_relative_name: Optional[str] = None
        self.last_time_window: str = "all"
        self.last_intent: Optional[str] = None
        self.turns: List[ConversationTurn] = []
        self.last_active: datetime = datetime.now(timezone.utc)

    def update_activity(self):
        self.last_active = datetime.now(timezone.utc)

    def add_turn(self, role: str, text: str):
        self.turns.append(ConversationTurn(role, text))
        if len(self.turns) > 12:
            self.turns = self.turns[-12:]  # Keep recent history
        self.update_activity()

    def merge_entities(self, new_entities: Dict[str, Any], temporal_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Merges new query entities with previous session context.
        Implements conversational reference resolution.
        """
        merged = dict(new_entities)

        # 1. Location Resolution
        if "location" in new_entities and new_entities["location"]:
            # User specified new location -> update session
            self.last_location = new_entities["location"]
            if "coordinates" in new_entities:
                self.last_coordinates = new_entities["coordinates"]
        elif self.last_location:
            # Elliptical query inheriting previous location
            merged["location"] = self.last_location
            if self.last_coordinates:
                merged["coordinates"] = self.last_coordinates

        # 2. Time & Date Resolution
        # If the user only specified a time window (e.g. "evening"), inherit previous target date
        if temporal_info.get("relative_name") in ["current", "today"] and temporal_info.get("time_window") != "all":
            if self.last_relative_name and self.last_relative_name not in ["current", "today"]:
                temporal_info["relative_name"] = self.last_relative_name
                temporal_info["target_date"] = self.last_target_date

        if temporal_info.get("relative_name") not in ["current", "today"]:
            self.last_relative_name = temporal_info.get("relative_name")
            self.last_target_date = temporal_info.get("target_date")

        self.last_time_window = temporal_info.get("time_window", "all")
        self.update_activity()
        return merged


class ConversationMemoryStore:
    def __init__(self, session_ttl_minutes: int = 45):
        self._sessions: Dict[str, SessionContext] = {}
        self.session_ttl = timedelta(minutes=session_ttl_minutes)

    def get_or_create(self, session_id: Optional[str] = None) -> Tuple[str, SessionContext]:
        self._cleanup_expired()
        sid = session_id or str(uuid.uuid4())
        if sid not in self._sessions:
            self._sessions[sid] = SessionContext(sid)
        return sid, self._sessions[sid]

    def _cleanup_expired(self):
        now = datetime.now(timezone.utc)
        expired_keys = [k for k, v in self._sessions.items() if now - v.last_active > self.session_ttl]
        for k in expired_keys:
            del self._sessions[k]


conversation_memory = ConversationMemoryStore()
