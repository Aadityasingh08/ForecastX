from typing import Dict, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.security import create_access_token, hash_password, verify_password

router = APIRouter(tags=["User & Authentication"])


class UserRegisterRequest(BaseModel):
    email: str
    password: str
    name: str


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserPreferences(BaseModel):
    language: str = "en"
    temperature_unit: str = "C"
    wind_speed_unit: str = "kmh"
    theme: str = "light"
    default_location: str = "New Delhi"
    high_contrast: bool = False
    browser_notifications: bool = True


class FavoriteLocation(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    state: str


# Users registry
USERS_DB: Dict[str, dict] = {
    "james@forecastx.gov.in": {
        "id": "usr-01",
        "name": "James Anderson",
        "email": "james@forecastx.gov.in",
        "role": "Senior Meteorologist",
        "organization": "India Meteorological Department (IMD)",
        "password_hash": hash_password("password123"),
        "preferences": UserPreferences(),
        "favorites": [
            FavoriteLocation(id="fav-1", name="New Delhi", latitude=28.6139, longitude=77.2090, state="Delhi"),
            FavoriteLocation(id="fav-2", name="Mumbai", latitude=19.0760, longitude=72.8777, state="Maharashtra"),
            FavoriteLocation(id="fav-3", name="Kanpur", latitude=26.4499, longitude=80.3319, state="Uttar Pradesh"),
        ]
    }
}


def _process_login(req: UserLoginRequest):
    email = req.email.strip().lower()
    if email in USERS_DB:
        user = USERS_DB[email]
        if verify_password(req.password, user["password_hash"]):
            token = create_access_token({"sub": email, "name": user["name"]})
            return {
                "access_token": token,
                "token_type": "bearer",
                "user": {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                    "role": user.get("role", "Weather Specialist"),
                    "organization": user.get("organization", "Disaster Management Cell")
                }
            }
        raise HTTPException(status_code=401, detail="Invalid credentials. Check your password.")

    # In demo mode, dynamically allow login with demo token
    name = email.split("@")[0].capitalize()
    token = create_access_token({"sub": email, "name": name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": f"usr-{len(USERS_DB) + 1}",
            "name": name,
            "email": email,
            "role": "Meteorological Analyst",
            "organization": "National Weather Monitoring System"
        }
    }


def _process_register(req: UserRegisterRequest):
    email = req.email.strip().lower()
    if email in USERS_DB:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    new_user = {
        "id": f"usr-{len(USERS_DB) + 1}",
        "name": req.name.strip(),
        "email": email,
        "role": "Registered Analyst",
        "organization": "State Weather Operations",
        "password_hash": hash_password(req.password),
        "preferences": UserPreferences(),
        "favorites": []
    }
    USERS_DB[email] = new_user

    token = create_access_token({"sub": email, "name": req.name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user["id"],
            "name": new_user["name"],
            "email": email,
            "role": new_user["role"],
            "organization": new_user["organization"]
        }
    }


# Dual router registration for both /auth and /user/auth
@router.post("/auth/login")
@router.post("/user/auth/login")
async def login(req: UserLoginRequest):
    return _process_login(req)


@router.post("/auth/register")
@router.post("/user/auth/register")
async def register(req: UserRegisterRequest):
    return _process_register(req)


@router.get("/user/preferences", response_model=UserPreferences)
async def get_preferences():
    return USERS_DB["james@forecastx.gov.in"]["preferences"]


@router.post("/user/preferences", response_model=UserPreferences)
async def update_preferences(prefs: UserPreferences):
    USERS_DB["james@forecastx.gov.in"]["preferences"] = prefs
    return prefs


@router.get("/user/favorites", response_model=List[FavoriteLocation])
async def get_favorites():
    return USERS_DB["james@forecastx.gov.in"]["favorites"]


@router.post("/user/favorites", response_model=FavoriteLocation)
async def add_favorite(fav: FavoriteLocation):
    USERS_DB["james@forecastx.gov.in"]["favorites"].append(fav)
    return fav


@router.delete("/user/favorites/{fav_id}")
async def remove_favorite(fav_id: str):
    USERS_DB["james@forecastx.gov.in"]["favorites"] = [
        f for f in USERS_DB["james@forecastx.gov.in"]["favorites"] if f.id != fav_id
    ]
    return {"status": "success", "removed_id": fav_id}
