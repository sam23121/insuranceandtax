from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class Appointment(SQLModel, table=True):
    __tablename__ = "appointments"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    slot_id: UUID = Field(foreign_key="availability_slots.id", sa_column_kwargs={"nullable": False})
    confirmation_code: str = Field(unique=True, max_length=20)
    service: str = Field(max_length=100)
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    email: str = Field(max_length=255)
    phone: str = Field(max_length=30)
    notes: str | None = Field(default=None)
    status: str = Field(default="upcoming", max_length=20)
    admin_notes: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Optional relationship for ORM convenience (not required for API)
    # slot: "AvailabilitySlot" = Relationship()
