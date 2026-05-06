from datetime import datetime, time, timezone
from uuid import UUID

from sqlmodel import Session, select

from app.constants import SERVICE_SLUGS
from app.models import Appointment, AvailabilitySlot, ConfirmationSeq
from app.services import email_service


def allocate_confirmation_code(session: Session, year: int) -> str:
    row = session.exec(
        select(ConfirmationSeq).where(ConfirmationSeq.year == year).with_for_update()
    ).one_or_none()
    if row is None:
        row = ConfirmationSeq(year=year, counter=0)
        session.add(row)
        session.flush()
    row.counter += 1
    session.add(row)
    session.flush()
    return f"APT-{year}-{row.counter:04d}"


def format_time(t: time) -> str:
    return f"{t.hour:02d}:{t.minute:02d}"


def create_booking(
    session: Session,
    *,
    slot_id: UUID,
    service: str,
    first_name: str,
    last_name: str,
    email: str,
    phone: str,
    notes: str | None,
) -> Appointment:
    if service not in SERVICE_SLUGS:
        raise ValueError("invalid_service")

    slot = session.exec(
        select(AvailabilitySlot).where(AvailabilitySlot.id == slot_id).with_for_update()
    ).one_or_none()
    if slot is None:
        raise LookupError("slot_not_found")
    if slot.is_booked:
        raise RuntimeError("slot_already_booked")

    year = datetime.now(timezone.utc).year
    code = allocate_confirmation_code(session, year)

    appt = Appointment(
        slot_id=slot_id,
        confirmation_code=code,
        service=service,
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        notes=notes,
        status="upcoming",
    )
    session.add(appt)
    slot.is_booked = True
    session.add(slot)
    session.flush()
    session.refresh(appt)

    # Emails must not block booking (spec); log failures inside email_service
    email_service.send_client_booking_confirmation(appt, slot.date, slot.time)
    email_service.send_owner_new_booking(appt, slot.date, slot.time)

    return appt
