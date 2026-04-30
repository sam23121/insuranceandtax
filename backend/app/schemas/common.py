from datetime import date, datetime, time
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class AvailableDatesResponse(BaseModel):
    available_dates: list[str]


class SlotOut(BaseModel):
    id: UUID
    time: str
    is_booked: bool


class SlotsForDateResponse(BaseModel):
    date: str
    slots: list[SlotOut]


class CreateAppointmentBody(BaseModel):
    slot_id: UUID
    service: str
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    email: EmailStr
    phone: str = Field(max_length=30)
    notes: str | None = None


class AppointmentCreatedOut(BaseModel):
    id: UUID
    confirmation_code: str
    service: str
    date: str
    time: str
    first_name: str
    last_name: str
    email: str
    phone: str
    status: str
    created_at: datetime


class ContactBody(BaseModel):
    name: str = Field(max_length=200)
    email: EmailStr
    subject: str = Field(max_length=300)
    message: str


class ContactResponse(BaseModel):
    message: str


class AdminLoginBody(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AppointmentAdminOut(BaseModel):
    id: UUID
    slot_id: UUID
    confirmation_code: str
    service: str
    date: str
    time: str
    first_name: str
    last_name: str
    email: str
    phone: str
    notes: str | None
    status: str
    admin_notes: str | None
    created_at: datetime
    updated_at: datetime


class AppointmentListResponse(BaseModel):
    total: int
    page: int
    per_page: int
    appointments: list[AppointmentAdminOut]


class AppointmentPatchBody(BaseModel):
    status: str | None = None
    admin_notes: str | None = None


class AdminSlotOut(BaseModel):
    id: UUID
    date: str
    time: str
    is_booked: bool
    appointment_id: UUID | None


class AdminAvailabilityResponse(BaseModel):
    slots: list[AdminSlotOut]


class CreateAvailabilityBody(BaseModel):
    date: date
    times: list[str]


class BulkAvailabilityBody(BaseModel):
    start_date: date
    end_date: date
    weekdays: list[int] = Field(description="0=Sunday … 6=Saturday (JS convention)")
    start_time: str
    end_time: str
    interval_minutes: int = Field(ge=5, le=240)


class BulkAvailabilityResponse(BaseModel):
    count: int


class DashboardStatsOut(BaseModel):
    total_this_month: int
    upcoming_next_7_days: int
    cancelled_this_month: int
    most_booked_service: str | None
    recent_appointments: list[AppointmentAdminOut]


class MessageResponse(BaseModel):
    message: str
