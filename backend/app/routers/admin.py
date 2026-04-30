import calendar
from datetime import date, datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, func as sa_func, or_
from sqlmodel import Session, col, select

from app.constants import APPOINTMENT_STATUSES, SERVICE_SLUGS
from app.database import get_session
from app.models import AdminUser, Appointment, AvailabilitySlot
from app.schemas.common import (
    AdminAvailabilityResponse,
    AdminLoginBody,
    AdminSlotOut,
    AppointmentAdminOut,
    AppointmentListResponse,
    AppointmentPatchBody,
    BulkAvailabilityBody,
    BulkAvailabilityResponse,
    CreateAvailabilityBody,
    DashboardStatsOut,
    MessageResponse,
    TokenResponse,
)
from app.services import email_service
from app.utils.auth import create_access_token, verify_password
from app.utils.dependencies import get_current_admin
from app.utils.timeparse import api_weekday_matches_date, format_hhmm, iter_time_strings, parse_hhmm

router = APIRouter(prefix="/admin", tags=["admin"])


def _to_admin_out(appt: Appointment, slot: AvailabilitySlot) -> AppointmentAdminOut:
    return AppointmentAdminOut(
        id=appt.id,
        slot_id=appt.slot_id,
        confirmation_code=appt.confirmation_code,
        service=appt.service,
        date=slot.date.isoformat(),
        time=format_hhmm(slot.time),
        first_name=appt.first_name,
        last_name=appt.last_name,
        email=appt.email,
        phone=appt.phone,
        notes=appt.notes,
        status=appt.status,
        admin_notes=appt.admin_notes,
        created_at=appt.created_at,
        updated_at=appt.updated_at,
    )


@router.post("/login", response_model=TokenResponse)
def admin_login(body: AdminLoginBody, session: Session = Depends(get_session)) -> TokenResponse:
    stmt = select(AdminUser).where(AdminUser.email == body.email)
    admin = session.exec(stmt).first()
    if admin is None or not verify_password(body.password, admin.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(str(admin.id))
    return TokenResponse(access_token=token, token_type="bearer")


@router.get("/appointments", response_model=AppointmentListResponse)
def list_appointments(
    session: Session = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
    service: str | None = None,
    status_filter: str | None = Query(None, alias="status"),
    date_from: str | None = None,
    date_to: str | None = None,
    search: str | None = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
) -> AppointmentListResponse:
    if service and service not in SERVICE_SLUGS:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid service")
    if status_filter and status_filter not in APPOINTMENT_STATUSES:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid status")

    base = select(Appointment).join(AvailabilitySlot, Appointment.slot_id == AvailabilitySlot.id)
    count_base = select(sa_func.count()).select_from(Appointment).join(
        AvailabilitySlot, Appointment.slot_id == AvailabilitySlot.id
    )

    conditions = []
    if service:
        conditions.append(Appointment.service == service)
    if status_filter:
        conditions.append(Appointment.status == status_filter)
    if date_from:
        conditions.append(AvailabilitySlot.date >= date.fromisoformat(date_from))
    if date_to:
        conditions.append(AvailabilitySlot.date <= date.fromisoformat(date_to))
    if search:
        q = f"%{search}%"
        conditions.append(
            or_(
                Appointment.first_name.ilike(q),
                Appointment.last_name.ilike(q),
                Appointment.email.ilike(q),
            )
        )

    for c in conditions:
        base = base.where(c)
        count_base = count_base.where(c)

    total = session.exec(count_base).one()

    stmt = (
        base.order_by(col(Appointment.created_at).desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    rows = session.exec(stmt).all()
    out: list[AppointmentAdminOut] = []
    for appt in rows:
        slot = session.get(AvailabilitySlot, appt.slot_id)
        if slot:
            out.append(_to_admin_out(appt, slot))

    return AppointmentListResponse(total=int(total), page=page, per_page=per_page, appointments=out)


@router.get("/appointments/{appointment_id}", response_model=AppointmentAdminOut)
def get_appointment(
    appointment_id: UUID,
    session: Session = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
) -> AppointmentAdminOut:
    appt = session.get(Appointment, appointment_id)
    if appt is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    slot = session.get(AvailabilitySlot, appt.slot_id)
    if slot is None:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Slot missing")
    return _to_admin_out(appt, slot)


@router.patch("/appointments/{appointment_id}", response_model=AppointmentAdminOut)
def patch_appointment(
    appointment_id: UUID,
    body: AppointmentPatchBody,
    session: Session = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
) -> AppointmentAdminOut:
    appt = session.get(Appointment, appointment_id)
    if appt is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    slot = session.get(AvailabilitySlot, appt.slot_id)
    if slot is None:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Slot missing")

    prev_status = appt.status
    if body.status is not None:
        if body.status not in APPOINTMENT_STATUSES:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid status")
        appt.status = body.status
    if body.admin_notes is not None:
        appt.admin_notes = body.admin_notes
    appt.updated_at = datetime.now(timezone.utc)
    session.add(appt)

    if body.status == "cancelled" and prev_status != "cancelled":
        email_service.send_client_cancellation(appt, slot.date, slot.time)

    session.flush()
    session.refresh(appt)
    return _to_admin_out(appt, slot)


@router.get("/availability", response_model=AdminAvailabilityResponse)
def admin_list_availability(
    date_from: str = Query(..., alias="date_from"),
    date_to: str = Query(..., alias="date_to"),
    session: Session = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
) -> AdminAvailabilityResponse:
    df = date.fromisoformat(date_from)
    dt = date.fromisoformat(date_to)
    slots = session.exec(
        select(AvailabilitySlot)
        .where(AvailabilitySlot.date >= df, AvailabilitySlot.date <= dt)
        .order_by(col(AvailabilitySlot.date), col(AvailabilitySlot.time))
    ).all()
    if not slots:
        return AdminAvailabilityResponse(slots=[])

    ids = [s.id for s in slots]
    appts = session.exec(select(Appointment).where(Appointment.slot_id.in_(ids))).all()
    appt_by_slot = {a.slot_id: a.id for a in appts}

    return AdminAvailabilityResponse(
        slots=[
            AdminSlotOut(
                id=s.id,
                date=s.date.isoformat(),
                time=format_hhmm(s.time),
                is_booked=s.is_booked,
                appointment_id=appt_by_slot.get(s.id),
            )
            for s in slots
        ]
    )


@router.post("/availability", status_code=status.HTTP_201_CREATED)
def admin_create_availability(
    body: CreateAvailabilityBody,
    session: Session = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
) -> list[AdminSlotOut]:
    created: list[AdminSlotOut] = []
    for tstr in body.times:
        t = parse_hhmm(tstr)
        existing = session.exec(
            select(AvailabilitySlot).where(AvailabilitySlot.date == body.date, AvailabilitySlot.time == t)
        ).first()
        if existing:
            continue
        slot = AvailabilitySlot(date=body.date, time=t, is_booked=False)
        session.add(slot)
        session.flush()
        session.refresh(slot)
        created.append(
            AdminSlotOut(
                id=slot.id,
                date=slot.date.isoformat(),
                time=format_hhmm(slot.time),
                is_booked=slot.is_booked,
                appointment_id=None,
            )
        )
    return created


@router.delete("/availability/{slot_id}", response_model=MessageResponse)
def admin_delete_slot(
    slot_id: UUID,
    session: Session = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
) -> MessageResponse:
    slot = session.get(AvailabilitySlot, slot_id)
    if slot is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Slot not found")
    if slot.is_booked:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Cannot delete a booked slot")
    session.delete(slot)
    return MessageResponse(message="Slot deleted.")


@router.post("/availability/bulk", response_model=BulkAvailabilityResponse, status_code=status.HTTP_201_CREATED)
def admin_bulk_availability(
    body: BulkAvailabilityBody,
    session: Session = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
) -> BulkAvailabilityResponse:
    if body.start_date > body.end_date:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail="start_date must be <= end_date")
    times = iter_time_strings(body.start_time, body.end_time, body.interval_minutes)
    if not times:
        return BulkAvailabilityResponse(count=0)

    weekdays = set(body.weekdays)
    created = 0
    d = body.start_date
    while d <= body.end_date:
        if any(api_weekday_matches_date(wd, d) for wd in weekdays):
            for tstr in times:
                t = parse_hhmm(tstr)
                exists = session.exec(
                    select(AvailabilitySlot).where(AvailabilitySlot.date == d, AvailabilitySlot.time == t)
                ).first()
                if exists:
                    continue
                session.add(AvailabilitySlot(date=d, time=t, is_booked=False))
                created += 1
        d += timedelta(days=1)

    session.flush()
    return BulkAvailabilityResponse(count=created)


@router.get("/dashboard/stats", response_model=DashboardStatsOut)
def dashboard_stats(
    session: Session = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
) -> DashboardStatsOut:
    today = date.today()
    month_start = date(today.year, today.month, 1)
    _, last_day = calendar.monthrange(today.year, today.month)
    month_end = date(today.year, today.month, last_day)
    week_end = today + timedelta(days=7)

    join = Appointment.slot_id == AvailabilitySlot.id

    def count_stmt(*filters):
        q = select(sa_func.count()).select_from(Appointment).join(AvailabilitySlot, join)
        if filters:
            q = q.where(and_(*filters))
        return q

    total_this_month = session.exec(
        count_stmt(
            AvailabilitySlot.date >= month_start,
            AvailabilitySlot.date <= month_end,
        )
    ).one()

    upcoming_next_7_days = session.exec(
        count_stmt(
            Appointment.status == "upcoming",
            AvailabilitySlot.date >= today,
            AvailabilitySlot.date <= week_end,
        )
    ).one()

    cancelled_this_month = session.exec(
        count_stmt(
            Appointment.status == "cancelled",
            AvailabilitySlot.date >= month_start,
            AvailabilitySlot.date <= month_end,
        )
    ).one()

    # Most booked service this month (non-cancelled)
    stmt = (
        select(Appointment.service, sa_func.count())
        .join(AvailabilitySlot, join)
        .where(
            AvailabilitySlot.date >= month_start,
            AvailabilitySlot.date <= month_end,
            Appointment.status != "cancelled",
        )
        .group_by(Appointment.service)
        .order_by(sa_func.count().desc())
    )
    top = session.exec(stmt).first()
    most = top[0] if top else None

    recent_rows = session.exec(
        select(Appointment)
        .join(AvailabilitySlot, join)
        .order_by(col(Appointment.created_at).desc())
        .limit(10)
    ).all()

    recent: list[AppointmentAdminOut] = []
    for appt in recent_rows:
        sl = session.get(AvailabilitySlot, appt.slot_id)
        if sl:
            recent.append(_to_admin_out(appt, sl))

    return DashboardStatsOut(
        total_this_month=int(total_this_month),
        upcoming_next_7_days=int(upcoming_next_7_days),
        cancelled_this_month=int(cancelled_this_month),
        most_booked_service=most,
        recent_appointments=recent,
    )
