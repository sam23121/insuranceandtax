"""Pytest fixtures: in-memory SQLite + dependency override (no Docker required)."""

import os

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("JWT_SECRET_KEY", "01234567890123456789012345678901")
os.environ.setdefault("CORS_ORIGINS", '["http://localhost:5173"]')
# Block admin sync from local .env during tests (Settings reads .env before app import).
os.environ["ADMIN_EMAIL"] = ""
os.environ["ADMIN_PASSWORD"] = ""

from datetime import date, time

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel, Session, create_engine

from app.database import get_session
from app.main import app
from app.models import AdminUser, AvailabilitySlot
from app.utils.auth import hash_password


@pytest.fixture
def client() -> TestClient:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as s:
        s.add(AdminUser(email="admin@test.com", hashed_password=hash_password("secret123")))
        s.add(AvailabilitySlot(date=date(2031, 6, 15), time=time(14, 0), is_booked=False))
        s.commit()

    def override_session():
        with Session(engine) as session:
            try:
                yield session
                session.commit()
            except Exception:
                session.rollback()
                raise

    app.dependency_overrides[get_session] = override_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    SQLModel.metadata.drop_all(engine)
    engine.dispose()
