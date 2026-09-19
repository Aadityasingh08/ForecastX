"""
Time Intelligence Service for Meteorological Reasoning
Handles time zones (default Asia/Kolkata / IST UTC+05:30), relative time parsing,
and precise mapping of natural language time queries to meteorological forecast windows.
"""
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple
import re

# IST timezone: UTC+05:30
IST = timezone(timedelta(hours=5, minutes=30))


class TimeIntelligenceService:
    @staticmethod
    def now_ist() -> datetime:
        """Returns current datetime in Indian Standard Time (IST)."""
        return datetime.now(IST)

    @staticmethod
    def get_current_ist_datetime() -> datetime:
        """Returns current datetime in Indian Standard Time (IST)."""
        return datetime.now(IST)

    @staticmethod
    def format_timestamp(dt: Optional[datetime] = None) -> str:
        """Formats timestamp according to Indian Meteorological conventions: '19 Sep 2026, 10:30 IST'."""
        d = dt or TimeIntelligenceService.now_ist()
        return d.strftime("%d %b %Y, %H:%M IST")

    @staticmethod
    def parse_time_query(query: str) -> Dict[str, Any]:
        """
        Parses relative and explicit time references in user queries.
        Returns:
            - target_date: 'YYYY-MM-DD'
            - is_relative: bool
            - relative_name: 'today' | 'tomorrow' | 'tonight' | 'weekend' | 'week' | 'current'
            - time_window: 'all' | 'morning' | 'afternoon' | 'evening' | 'night'
            - hour_range: (start_hour, end_hour)
            - label: Human-readable target period
        """
        q = query.lower().strip()
        now = TimeIntelligenceService.now_ist()
        target_dt = now
        relative_name = "current"
        time_window = "all"
        hour_range = (0, 23)

        # Detect specific time-of-day windows
        if "morning" in q or "सुबह" in q:
            time_window = "morning"
            hour_range = (6, 11)
        elif "afternoon" in q or "दोपहर" in q:
            time_window = "afternoon"
            hour_range = (12, 16)
        elif "evening" in q or "शाम" in q:
            time_window = "evening"
            hour_range = (17, 21)
        elif "tonight" in q or "night" in q or "रात" in q:
            time_window = "night"
            hour_range = (20, 23)

        # Detect date offsets
        if "day after tomorrow" in q or "परसों" in q:
            target_dt = now + timedelta(days=2)
            relative_name = "day_after_tomorrow"
        elif "tomorrow" in q or "कल" in q:
            target_dt = now + timedelta(days=1)
            relative_name = "tomorrow"
        elif "tonight" in q or "आज रात" in q:
            target_dt = now
            relative_name = "tonight"
            time_window = "night"
            hour_range = (20, 23)
        elif "this weekend" in q or "weekend" in q or "सप्ताहांत" in q:
            # Days until next Saturday (5 = Saturday)
            days_to_sat = (5 - now.weekday()) % 7
            if days_to_sat == 0 and now.hour > 18:
                days_to_sat = 7
            target_dt = now + timedelta(days=days_to_sat)
            relative_name = "weekend"
        elif "next week" in q or "अगले हफ्ते" in q or "अगले सप्ताह" in q or "7 days" in q or "7 day" in q:
            relative_name = "next_week"
        elif "today" in q or "आज" in q or "right now" in q or "currently" in q or "now" in q:
            target_dt = now
            relative_name = "today" if time_window != "all" else "current"

        # Check explicit day names
        days_map = {
            "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
            "friday": 4, "saturday": 5, "sunday": 6,
            "सोमवार": 0, "मंगलवार": 1, "बुधवार": 2, "गुरुवार": 3,
            "शुक्रवार": 4, "शनिवार": 5, "रविवार": 6
        }
        for dname, dindex in days_map.items():
            if re.search(rf"\b{dname}\b", q):
                days_ahead = (dindex - now.weekday()) % 7
                if days_ahead == 0 and relative_name != "today":
                    days_ahead = 7
                target_dt = now + timedelta(days=days_ahead)
                relative_name = dname.capitalize()
                break

        target_date_str = target_dt.strftime("%Y-%m-%d")

        # Build user-friendly period label
        label_parts = []
        if relative_name in ["current", "today"]:
            label_parts.append("Today")
        elif relative_name == "tomorrow":
            label_parts.append("Tomorrow")
        elif relative_name == "day_after_tomorrow":
            label_parts.append("Day after tomorrow")
        elif relative_name == "weekend":
            label_parts.append("This Weekend")
        elif relative_name == "next_week":
            label_parts.append("Next 7 Days")
        else:
            label_parts.append(relative_name.capitalize())

        if time_window != "all":
            label_parts.append(time_window.capitalize())

        label = " ".join(label_parts) + f" ({target_dt.strftime('%d %b')})"

        return {
            "target_date": target_date_str,
            "target_datetime": target_dt,
            "relative_name": relative_name,
            "time_window": time_window,
            "hour_range": hour_range,
            "label": label,
            "formatted_now": TimeIntelligenceService.format_timestamp(now),
        }


time_service = TimeIntelligenceService()
