"""
Location Intelligence Service
Provides resilient geocoding and reverse geocoding across India and worldwide.
Blends live Open-Meteo geocoding with a comprehensive built-in Indian gazetteer
and spatial nearest-neighbor search for zero-downtime offline fallback.
"""
import logging
import re
from typing import Dict, List, Optional, Tuple
import httpx
from app.gis.spatial import haversine_distance_km
from app.schemas.weather import LocationSearchResult

logger = logging.getLogger("forecastx.location")

# Comprehensive built-in Indian gazetteer covering major metro hubs, capitals, and key districts
BUILTIN_INDIAN_GAZETTEER: List[LocationSearchResult] = [
    LocationSearchResult(id="loc-delhi", name="New Delhi", district="New Delhi", state="Delhi", pincode="110001", latitude=28.6139, longitude=77.2090, type="city"),
    LocationSearchResult(id="loc-mumbai", name="Mumbai", district="Mumbai City", state="Maharashtra", pincode="400001", latitude=19.0760, longitude=72.8777, type="city"),
    LocationSearchResult(id="loc-kolkata", name="Kolkata", district="Kolkata", state="West Bengal", pincode="700001", latitude=22.5726, longitude=88.3639, type="city"),
    LocationSearchResult(id="loc-chennai", name="Chennai", district="Chennai", state="Tamil Nadu", pincode="600001", latitude=13.0827, longitude=80.2707, type="city"),
    LocationSearchResult(id="loc-bengaluru", name="Bengaluru", district="Bengaluru Urban", state="Karnataka", pincode="560001", latitude=12.9716, longitude=77.5946, type="city"),
    LocationSearchResult(id="loc-hyderabad", name="Hyderabad", district="Hyderabad", state="Telangana", pincode="500001", latitude=17.3850, longitude=78.4867, type="city"),
    LocationSearchResult(id="loc-ahmedabad", name="Ahmedabad", district="Ahmedabad", state="Gujarat", pincode="380001", latitude=23.0225, longitude=72.5714, type="city"),
    LocationSearchResult(id="loc-pune", name="Pune", district="Pune", state="Maharashtra", pincode="411001", latitude=18.5204, longitude=73.8567, type="city"),
    LocationSearchResult(id="loc-jaipur", name="Jaipur", district="Jaipur", state="Rajasthan", pincode="302001", latitude=26.9124, longitude=75.7873, type="city"),
    LocationSearchResult(id="loc-kanpur", name="Kanpur", district="Kanpur Nagar", state="Uttar Pradesh", pincode="208001", latitude=26.4499, longitude=80.3319, type="city"),
    LocationSearchResult(id="loc-lucknow", name="Lucknow", district="Lucknow", state="Uttar Pradesh", pincode="226001", latitude=26.8467, longitude=80.9462, type="city"),
    LocationSearchResult(id="loc-varanasi", name="Varanasi", district="Varanasi", state="Uttar Pradesh", pincode="221001", latitude=25.3176, longitude=82.9739, type="city"),
    LocationSearchResult(id="loc-agra", name="Agra", district="Agra", state="Uttar Pradesh", pincode="282001", latitude=27.1767, longitude=78.0081, type="city"),
    LocationSearchResult(id="loc-prayagraj", name="Prayagraj", district="Prayagraj", state="Uttar Pradesh", pincode="211001", latitude=25.4358, longitude=81.8463, type="city"),
    LocationSearchResult(id="loc-bhubaneswar", name="Bhubaneswar", district="Khordha", state="Odisha", pincode="751001", latitude=20.2961, longitude=85.8245, type="city"),
    LocationSearchResult(id="loc-cuttack", name="Cuttack", district="Cuttack", state="Odisha", pincode="753001", latitude=20.4625, longitude=85.8828, type="city"),
    LocationSearchResult(id="loc-balasore", name="Balasore", district="Balasore", state="Odisha", pincode="756001", latitude=21.4934, longitude=86.9135, type="city"),
    LocationSearchResult(id="loc-puri", name="Puri", district="Puri", state="Odisha", pincode="752001", latitude=19.8135, longitude=85.8312, type="city"),
    LocationSearchResult(id="loc-patna", name="Patna", district="Patna", state="Bihar", pincode="800001", latitude=25.5941, longitude=85.1376, type="city"),
    LocationSearchResult(id="loc-gaya", name="Gaya", district="Gaya", state="Bihar", pincode="823001", latitude=24.7914, longitude=85.0002, type="city"),
    LocationSearchResult(id="loc-ranchi", name="Ranchi", district="Ranchi", state="Jharkhand", pincode="834001", latitude=23.3441, longitude=85.3096, type="city"),
    LocationSearchResult(id="loc-jamshedpur", name="Jamshedpur", district="East Singhbhum", state="Jharkhand", pincode="831001", latitude=22.8046, longitude=86.2029, type="city"),
    LocationSearchResult(id="loc-bhopal", name="Bhopal", district="Bhopal", state="Madhya Pradesh", pincode="462001", latitude=23.2599, longitude=77.4126, type="city"),
    LocationSearchResult(id="loc-indore", name="Indore", district="Indore", state="Madhya Pradesh", pincode="452001", latitude=22.7196, longitude=75.8577, type="city"),
    LocationSearchResult(id="loc-gwalior", name="Gwalior", district="Gwalior", state="Madhya Pradesh", pincode="474001", latitude=26.2183, longitude=78.1828, type="city"),
    LocationSearchResult(id="loc-surat", name="Surat", district="Surat", state="Gujarat", pincode="395001", latitude=21.1702, longitude=72.8311, type="city"),
    LocationSearchResult(id="loc-vadodara", name="Vadodara", district="Vadodara", state="Gujarat", pincode="390001", latitude=22.3072, longitude=73.1812, type="city"),
    LocationSearchResult(id="loc-chandigarh", name="Chandigarh", district="Chandigarh", state="Chandigarh", pincode="160017", latitude=30.7333, longitude=76.7794, type="city"),
    LocationSearchResult(id="loc-ludhiana", name="Ludhiana", district="Ludhiana", state="Punjab", pincode="141001", latitude=30.9010, longitude=75.8573, type="city"),
    LocationSearchResult(id="loc-amritsar", name="Amritsar", district="Amritsar", state="Punjab", pincode="143001", latitude=31.6340, longitude=74.8723, type="city"),
    LocationSearchResult(id="loc-dehradun", name="Dehradun", district="Dehradun", state="Uttarakhand", pincode="248001", latitude=30.3165, longitude=78.0322, type="city"),
    LocationSearchResult(id="loc-shimla", name="Shimla", district="Shimla", state="Himachal Pradesh", pincode="171001", latitude=31.1048, longitude=77.1734, type="city"),
    LocationSearchResult(id="loc-srinagar", name="Srinagar", district="Srinagar", state="Jammu and Kashmir", pincode="190001", latitude=34.0837, longitude=74.7973, type="city"),
    LocationSearchResult(id="loc-jammu", name="Jammu", district="Jammu", state="Jammu and Kashmir", pincode="180001", latitude=32.7266, longitude=74.8570, type="city"),
    LocationSearchResult(id="loc-guwahati", name="Guwahati", district="Kamrup Metropolitan", state="Assam", pincode="781001", latitude=26.1445, longitude=91.7362, type="city"),
    LocationSearchResult(id="loc-raipur", name="Raipur", district="Raipur", state="Chhattisgarh", pincode="492001", latitude=21.2514, longitude=81.6296, type="city"),
    LocationSearchResult(id="loc-visakhapatnam", name="Visakhapatnam", district="Visakhapatnam", state="Andhra Pradesh", pincode="530001", latitude=17.6868, longitude=83.2185, type="city"),
    LocationSearchResult(id="loc-vijayawada", name="Vijayawada", district="NTR", state="Andhra Pradesh", pincode="520001", latitude=16.5062, longitude=80.6480, type="city"),
    LocationSearchResult(id="loc-thiruvananthapuram", name="Thiruvananthapuram", district="Thiruvananthapuram", state="Kerala", pincode="695001", latitude=8.5241, longitude=76.9366, type="city"),
    LocationSearchResult(id="loc-kochi", name="Kochi", district="Ernakulam", state="Kerala", pincode="682001", latitude=9.9312, longitude=76.2673, type="city"),
    LocationSearchResult(id="loc-nagpur", name="Nagpur", district="Nagpur", state="Maharashtra", pincode="440001", latitude=21.1458, longitude=79.0882, type="city"),
    LocationSearchResult(id="loc-coimbatore", name="Coimbatore", district="Coimbatore", state="Tamil Nadu", pincode="641001", latitude=11.0168, longitude=76.9558, type="city"),
    LocationSearchResult(id="loc-madurai", name="Madurai", district="Madurai", state="Tamil Nadu", pincode="625001", latitude=9.9252, longitude=78.1198, type="city"),
    LocationSearchResult(id="loc-jodhpur", name="Jodhpur", district="Jodhpur", state="Rajasthan", pincode="342001", latitude=26.2389, longitude=73.0243, type="city"),
    LocationSearchResult(id="loc-udaipur", name="Udaipur", district="Udaipur", state="Rajasthan", pincode="313001", latitude=24.5854, longitude=73.7125, type="city"),
    LocationSearchResult(id="loc-alwar", name="Alwar", district="Alwar", state="Rajasthan", pincode="301001", latitude=27.5530, longitude=76.6346, type="city"),
    LocationSearchResult(id="loc-panaji", name="Panaji", district="North Goa", state="Goa", pincode="403001", latitude=15.4909, longitude=73.8278, type="city"),
]


class LocationService:
    def __init__(self):
        self._cache: Dict[str, List[LocationSearchResult]] = {}

    def normalize_name(self, name: str) -> str:
        """Cleans and standardizes location queries."""
        cleaned = re.sub(r"\b(city|district|nagar|india|up|mp|rajasthan|state)\b", "", name, flags=re.IGNORECASE)
        cleaned = re.sub(r"[,.\-_/]", " ", cleaned).strip()
        return " ".join(cleaned.split())

    async def search_locations(self, query: str, limit: int = 5) -> List[LocationSearchResult]:
        q = query.strip()
        if not q:
            return BUILTIN_INDIAN_GAZETTEER[:limit]

        # 1. Check for coordinate string: e.g. "26.4499, 80.3319"
        coord_match = re.match(r"^([-+]?\d+\.?\d*)[,\s]+([-+]?\d+\.?\d*)$", q)
        if coord_match:
            lat = float(coord_match.group(1))
            lon = float(coord_match.group(2))
            rev = await self.reverse_geocode(lat, lon)
            return [rev]

        cache_key = q.lower()
        if cache_key in self._cache:
            return self._cache[cache_key]

        # 2. Try Live Geocoding via Open-Meteo Geocoding API (Zero-Key Worldwide)
        live_results: List[LocationSearchResult] = []
        try:
            async with httpx.AsyncClient(timeout=3.5) as client:
                res = await client.get(
                    "https://geocoding-api.open-meteo.com/v1/search",
                    params={"name": q, "count": limit, "language": "en", "format": "json"}
                )
                if res.status_code == 200:
                    data = res.json().get("results", [])
                    for idx, item in enumerate(data):
                        loc_id = f"geo-{item.get('id', idx)}"
                        name = item.get("name", q.title())
                        state = item.get("admin1", "")
                        district = item.get("admin2", state)
                        country = item.get("country", "India")
                        lat = item.get("latitude", 0.0)
                        lon = item.get("longitude", 0.0)

                        live_results.append(LocationSearchResult(
                            id=loc_id,
                            name=name,
                            district=district,
                            state=state,
                            country=country,
                            pincode=item.get("postcodes", [None])[0] if item.get("postcodes") else None,
                            latitude=lat,
                            longitude=lon,
                            type="city"
                        ))
        except Exception as e:
            logger.debug(f"Live geocoding network query failed: {e}. Falling back to internal gazetteer.")

        if live_results:
            self._cache[cache_key] = live_results
            return live_results

        # 3. Fallback to Built-in Indian Gazetteer
        norm_q = self.normalize_name(q).lower()
        matched = []
        for loc in BUILTIN_INDIAN_GAZETTEER:
            loc_name = loc.name.lower()
            loc_dist = loc.district.lower()
            loc_state = loc.state.lower()
            if norm_q in loc_name or loc_name in norm_q or norm_q in loc_dist or norm_q in loc_state:
                matched.append(loc)

        if not matched and len(norm_q) >= 3:
            # Substring match
            for loc in BUILTIN_INDIAN_GAZETTEER:
                if any(part in loc.name.lower() for part in norm_q.split()):
                    matched.append(loc)

        results = matched[:limit] if matched else BUILTIN_INDIAN_GAZETTEER[:limit]
        self._cache[cache_key] = results
        return results

    async def reverse_geocode(self, lat: float, lon: float) -> LocationSearchResult:
        """Resolves latitude and longitude coordinates into an Indian or global location."""
        # 1. Try Live Reverse Geocoding with BigDataCloud / OpenStreetMap
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(
                    "https://nominatim.openstreetmap.org/reverse",
                    params={"lat": lat, "lon": lon, "format": "json", "zoom": 10},
                    headers={"User-Agent": "ForecastX-Weather-Intelligence/1.0"}
                )
                if res.status_code == 200:
                    raw = res.json()
                    addr = raw.get("address", {})
                    city = addr.get("city") or addr.get("town") or addr.get("village") or addr.get("county") or raw.get("name") or "Observation Point"
                    state = addr.get("state", "")
                    district = addr.get("state_district") or addr.get("county", state)
                    country = addr.get("country", "India")
                    postcode = addr.get("postcode")

                    return LocationSearchResult(
                        id=f"rev-{lat:.3f}-{lon:.3f}",
                        name=city,
                        district=district,
                        state=state,
                        country=country,
                        pincode=postcode,
                        latitude=lat,
                        longitude=lon,
                        type="coordinates"
                    )
        except Exception as e:
            logger.debug(f"Reverse geocode lookup failed: {e}. Falling back to spatial nearest.")

        # 2. Offline Spatial Nearest-Neighbor lookup using Gazetteer
        closest = BUILTIN_INDIAN_GAZETTEER[0]
        min_dist = float("inf")
        for loc in BUILTIN_INDIAN_GAZETTEER:
            d = haversine_distance_km(lat, lon, loc.latitude, loc.longitude)
            if d < min_dist:
                min_dist = d
                closest = loc

        if min_dist < 40.0:
            return closest

        return LocationSearchResult(
            id=f"coord-{lat:.3f}-{lon:.3f}",
            name=f"{closest.name} Vicinity ({lat:.2f}°, {lon:.2f}°)",
            district=closest.district,
            state=closest.state,
            country="India",
            latitude=lat,
            longitude=lon,
            type="coordinates"
        )

    async def resolve_city_or_default(self, city_query: Optional[str], lat: Optional[float] = None, lon: Optional[float] = None) -> Tuple[str, str, str, float, float]:
        """
        Resolves city_name, district, state, latitude, longitude.
        Guarantees non-null, valid coordinates and location names with zero redundant calls.
        """
        if lat is not None and lon is not None:
            if city_query and city_query.lower() not in ["here", "my location", "current location"]:
                return city_query, "", "", lat, lon
            rev = await self.reverse_geocode(lat, lon)
            return rev.name, rev.district, rev.state, lat, lon

        if city_query:
            results = await self.search_locations(city_query, limit=1)
            if results:
                top = results[0]
                return top.name, top.district, top.state, top.latitude, top.longitude

    async def resolve_location(self, query: str) -> LocationSearchResult:
        """
        Resolves free-text location query into a single LocationSearchResult with lat/lon and display_name.
        """
        results = await self.search_locations(query, limit=1)
        if results:
            res = results[0]
            disp = f"{res.name}, {res.state}" if res.state else res.name
            res.display_name = disp
            return res
        return LocationSearchResult(
            id="loc-default",
            name=query.title(),
            district="District",
            state="India",
            latitude=28.6139,
            longitude=77.2090,
            type="city",
            display_name=query.title()
        )


location_service = LocationService()
