from typing import List
from fastapi import APIRouter, HTTPException
from app.cyclones.service import cyclone_service
from app.schemas.cyclone import CycloneData

router = APIRouter(prefix="/cyclones", tags=["Cyclones"])


@router.get("", response_model=List[CycloneData])
async def get_cyclones():
    return cyclone_service.get_active_cyclones()


@router.get("/{cyclone_id}", response_model=CycloneData)
async def get_cyclone_details(cyclone_id: str):
    cyc = cyclone_service.get_cyclone_by_id(cyclone_id)
    if not cyc:
        raise HTTPException(status_code=404, detail="Cyclone not found")
    return cyc
