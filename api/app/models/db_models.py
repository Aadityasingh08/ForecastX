"""
SQLAlchemy Database Models for ForecastX
Persists registered users, favorite weather locations, search history, and audit records.
"""
from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text
from app.core.database import Base, engine


class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(128), unique=True, index=True, nullable=False)
    name = Column(String(128), nullable=False)
    password_hash = Column(String(256), nullable=False)
    role = Column(String(64), default="Meteorological Analyst")
    organization = Column(String(128), default="National Weather Monitoring System")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class FavoriteLocationModel(Base):
    __tablename__ = "favorite_locations"

    id = Column(String(64), primary_key=True, index=True)
    user_email = Column(String(128), index=True, nullable=False)
    name = Column(String(128), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    state = Column(String(128), default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class SearchHistoryModel(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    query = Column(String(256), nullable=False)
    city_name = Column(String(128))
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))


def init_db():
    """Initializes database tables."""
    Base.metadata.create_all(bind=engine)
