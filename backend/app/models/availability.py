from datetime import date, datetime, time, timezone
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class AvailabilitySlot(SQLModel, table=True):
    __tablename__ = "availability_slots"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    date: date
    time: time
    is_booked: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
