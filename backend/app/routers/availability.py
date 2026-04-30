from fastapi import APIRouter, Depends, Query
from sqlalchemy import extract
from sqlmodel import Session, col, select

from app.database import get_session
from app.models import AvailabilitySlot
from app.schemas.common import AvailableDatesResponse, SlotOut, SlotsForDateResponse
from app.utils.timeparse import format_hhmm

router = APIRouter(prefix="/availability", tags=["availability"])


@router.get("/dates", response_model=AvailableDatesResponse)
def get_available_dates(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    session: Session = Depends(get_session),
) -> AvailableDatesResponse:
    stmt = (
        select(col(AvailabilitySlot.date))
        .where(
            extract("year", AvailabilitySlot.date) == year,
            extract("month", AvailabilitySlot.date) == month,
            AvailabilitySlot.is_booked.is_(False),
        )
        .distinct()
        .order_by(col(AvailabilitySlot.date))
    )
    rows = session.exec(stmt).all()
    dates = [d.isoformat() if hasattr(d, "isoformat") else str(d) for d in rows]
    return AvailableDatesResponse(available_dates=dates)


@router.get("/slots", response_model=SlotsForDateResponse)
def get_slots_for_date(
    date: str = Query(..., description="YYYY-MM-DD"),
    session: Session = Depends(get_session),
) -> SlotsForDateResponse:
    from datetime import date as date_cls

    d = date_cls.fromisoformat(date)
    stmt = (
        select(AvailabilitySlot)
        .where(AvailabilitySlot.date == d)
        .order_by(col(AvailabilitySlot.time))
    )
    slots = session.exec(stmt).all()
    return SlotsForDateResponse(
        date=date,
        slots=[
            SlotOut(id=s.id, time=format_hhmm(s.time), is_booked=s.is_booked)
            for s in slots
        ],
    )
