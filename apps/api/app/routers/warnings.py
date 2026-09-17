from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.warnings import CAPWarning
from app.warnings.engine import warning_engine

router = APIRouter(prefix="/warnings", tags=["Warnings"])


@router.get("", response_model=List[CAPWarning])
async def get_warnings(
    hazard: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    active_only: bool = Query(True)
):
    return warning_engine.get_all_warnings(hazard=hazard, severity=severity, state=state, active_only=active_only)


@router.get("/{warning_id}", response_model=CAPWarning)
async def get_warning_details(warning_id: str):
    w = warning_engine.get_by_id(warning_id)
    if not w:
        raise HTTPException(status_code=404, detail="Warning not found")
    return w
