from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.constants import SERVICE_SLUGS
from app.database import get_session
from app.models import AvailabilitySlot
from app.schemas.common import AppointmentCreatedOut, CreateAppointmentBody
from app.services.booking_service import create_booking, format_time

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.post("", response_model=AppointmentCreatedOut, status_code=status.HTTP_201_CREATED)
def book_appointment(
    body: CreateAppointmentBody,
    session: Session = Depends(get_session),
) -> AppointmentCreatedOut:
    if body.service not in SERVICE_SLUGS:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid service slug")
    try:
        appt = create_booking(
            session,
            slot_id=body.slot_id,
            service=body.service,
            first_name=body.first_name,
            last_name=body.last_name,
            email=str(body.email),
            phone=body.phone,
            notes=body.notes,
        )
    except LookupError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Slot not found") from None
    except RuntimeError:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Slot already booked") from None
    except ValueError:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid service slug") from None

    slot = session.get(AvailabilitySlot, body.slot_id)
    if slot is None:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Slot missing after booking")
    return AppointmentCreatedOut(
        id=appt.id,
        confirmation_code=appt.confirmation_code,
        service=appt.service,
        date=slot.date.isoformat(),
        time=format_time(slot.time),
        first_name=appt.first_name,
        last_name=appt.last_name,
        email=appt.email,
        phone=appt.phone,
        status=appt.status,
        created_at=appt.created_at,
    )
