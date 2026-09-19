from typing import List
from fastapi import APIRouter, Query
from app.schemas.weather import LocationSearchResult
from app.services.location_service import location_service

router = APIRouter(prefix="/locations", tags=["Locations"])


@router.get("/search", response_model=List[LocationSearchResult])
async def search_locations(q: str = Query(..., min_length=1), limit: int = Query(6, ge=1, le=20)):
    """
    Searches for cities, districts, pincodes, or coordinates across India and globally.
    Combines live geocoding with a built-in Indian gazetteer.
    """
    return await location_service.search_locations(q, limit=limit)


@router.get("/reverse", response_model=LocationSearchResult)
async def reverse_geocode(lat: float = Query(...), lon: float = Query(...)):
    """
    Reverse geocodes geographic coordinates into a human-readable city, district, and state.
    """
    return await location_service.reverse_geocode(lat, lon)
