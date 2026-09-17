import math
from typing import Dict, List, Optional, Tuple


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on the Earth."""
    r = 6371.0  # Earth's radius in kilometers
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return r * c


def point_in_polygon(lat: float, lon: float, polygon: List[List[float]]) -> bool:
    """
    Ray-casting algorithm to determine if point (lat, lon) is inside polygon.
    Polygon is a list of [lon, lat] or [lat, lon] coordinates.
    We assume polygon points are [lon, lat] matching standard GeoJSON coordinates.
    """
    if not polygon or len(polygon) < 3:
        return False

    inside = False
    n = len(polygon)
    p1x, p1y = polygon[0][0], polygon[0][1]

    for i in range(1, n + 1):
        p2x, p2y = polygon[i % n][0], polygon[i % n][1]
        # lon corresponds to x, lat corresponds to y
        if min(p1y, p2y) < lat <= max(p1y, p2y):
            if lon <= max(p1x, p2x):
                if p1y != p2y:
                    xinters = (lat - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                if p1x == p2x or lon <= xinters:
                    inside = not inside
        p1x, p1y = p2x, p2y

    return inside


def interpolate_route_points(
    start_lat: float, start_lon: float,
    end_lat: float, end_lon: float,
    num_checkpoints: int = 5
) -> List[Tuple[float, float, float]]:
    """
    Generates intermediate coordinates along a great-circle path.
    Returns list of (lat, lon, distance_from_start_km).
    """
    total_dist = haversine_distance_km(start_lat, start_lon, end_lat, end_lon)
    points = []

    for i in range(num_checkpoints):
        fraction = i / max(1, num_checkpoints - 1)
        lat = start_lat + fraction * (end_lat - start_lat)
        lon = start_lon + fraction * (end_lon - start_lon)
        dist = fraction * total_dist
        points.append((round(lat, 4), round(lon, 4), round(dist, 1)))

    return points


def find_nearest_item(
    lat: float, lon: float, items: List[Dict], lat_key: str = "latitude", lon_key: str = "longitude"
) -> Optional[Dict]:
    """Finds the closest item in a list of items having lat/lon coordinates."""
    if not items:
        return None

    nearest = None
    min_dist = float("inf")

    for item in items:
        item_lat = item.get(lat_key)
        item_lon = item.get(lon_key)
        if item_lat is not None and item_lon is not None:
            dist = haversine_distance_km(lat, lon, float(item_lat), float(item_lon))
            if dist < min_dist:
                min_dist = dist
                nearest = (item, dist)

    return nearest[0] if nearest else None
