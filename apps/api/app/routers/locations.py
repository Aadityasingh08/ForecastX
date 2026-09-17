import re
from typing import List
from fastapi import APIRouter, Query
from app.gis.spatial import haversine_distance_km
from app.schemas.weather import LocationSearchResult

router = APIRouter(prefix="/locations", tags=["Locations"])

INDIAN_LOCATIONS: List[LocationSearchResult] = [
    LocationSearchResult(id="loc-1", name="New Delhi", district="New Delhi", state="Delhi", pincode="110001", latitude=28.6139, longitude=77.2090, type="city"),
    LocationSearchResult(id="loc-2", name="Mumbai", district="Mumbai City", state="Maharashtra", pincode="400001", latitude=19.0760, longitude=72.8777, type="city"),
    LocationSearchResult(id="loc-3", name="Chennai", district="Chennai", state="Tamil Nadu", pincode="600001", latitude=13.0827, longitude=80.2707, type="city"),
    LocationSearchResult(id="loc-4", name="Kolkata", district="Kolkata", state="West Bengal", pincode="700001", latitude=22.5726, longitude=88.3639, type="city"),
    LocationSearchResult(id="loc-5", name="Kanpur", district="Kanpur Nagar", state="Uttar Pradesh", pincode="208001", latitude=26.4499, longitude=80.3319, type="city"),
    LocationSearchResult(id="loc-6", name="Jaipur", district="Jaipur", state="Rajasthan", pincode="302001", latitude=26.9124, longitude=75.7873, type="city"),
    LocationSearchResult(id="loc-7", name="Bhubaneswar", district="Khordha", state="Odisha", pincode="751001", latitude=20.2961, longitude=85.8245, type="city"),
    LocationSearchResult(id="loc-8", name="Ahmedabad", district="Ahmedabad", state="Gujarat", pincode="380001", latitude=23.0225, longitude=72.5714, type="city"),
    LocationSearchResult(id="loc-9", name="Bengaluru", district="Bengaluru Urban", state="Karnataka", pincode="560001", latitude=12.9716, longitude=77.5946, type="city"),
    LocationSearchResult(id="loc-10", name="Hyderabad", district="Hyderabad", state="Telangana", pincode="500001", latitude=17.3850, longitude=78.4867, type="city"),
    LocationSearchResult(id="loc-11", name="Lucknow", district="Lucknow", state="Uttar Pradesh", pincode="226001", latitude=26.8467, longitude=80.9462, type="city"),
    LocationSearchResult(id="loc-12", name="Patna", district="Patna", state="Bihar", pincode="800001", latitude=25.5941, longitude=85.1376, type="city"),
]


@router.get("/search", response_model=List[LocationSearchResult])
async def search_locations(q: str = Query(..., min_length=1)):
    query = q.strip().lower()

    # Check for coordinates: e.g. "28.6139, 77.2090"
    coord_match = re.match(r"^([-+]?\d+\.?\d*)[,\s]+([-+]?\d+\.?\d*)$", query)
    if coord_match:
        lat = float(coord_match.group(1))
        lon = float(coord_match.group(2))
        return [
            LocationSearchResult(
                id=f"coord-{lat}-{lon}",
                name=f"Point ({lat:.2f}, {lon:.2f})",
                district="Geographic Coordinates",
                state="India",
                latitude=lat,
                longitude=lon,
                type="coordinates"
            )
        ]

    # Filter standard locations
    results = [
        loc for loc in INDIAN_LOCATIONS
        if query in loc.name.lower() or query in loc.district.lower() or query in loc.state.lower() or (loc.pincode and query in loc.pincode)
    ]
    return results if results else INDIAN_LOCATIONS[:4]


@router.get("/reverse", response_model=LocationSearchResult)
async def reverse_geocode(lat: float, lon: float):
    # Find closest known location
    closest = INDIAN_LOCATIONS[0]
    min_dist = float("inf")
    for loc in INDIAN_LOCATIONS:
        d = haversine_distance_km(lat, lon, loc.latitude, loc.longitude)
        if d < min_dist:
            min_dist = d
            closest = loc
    return closest
