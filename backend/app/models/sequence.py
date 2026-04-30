from sqlmodel import Field, SQLModel


class ConfirmationSeq(SQLModel, table=True):
    """Per-calendar-year counter for APT-YYYY-NNNN codes (transactionally incremented)."""

    __tablename__ = "confirmation_seq"

    year: int = Field(primary_key=True)
    counter: int = Field(default=0)
