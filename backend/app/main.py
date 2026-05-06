import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app.config import get_settings
from app.database import engine, init_db
from app.models import AdminUser
from app.routers import admin, appointments, availability, contact
from app.utils.auth import hash_password, verify_password

logging.basicConfig(level=logging.INFO)
settings = get_settings()

app = FastAPI(title="Insurance & Tax API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(availability.router, prefix="/api")
app.include_router(appointments.router, prefix="/api")
app.include_router(contact.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.on_event("startup")
def startup_create_tables() -> None:
    init_db()


@app.on_event("startup")
def sync_admin_from_env() -> None:
    """
    Ensure admin user matches env credentials on each deployment.

    This allows managed platforms (e.g., Render) to update admin login
    without requiring shell access for one-off seed commands.
    """
    email = (settings.admin_email or "").strip()
    password = settings.admin_password or ""
    if not email or not password:
        logging.info("Admin env credentials not set; skipping startup admin sync.")
        return

    with Session(engine) as session:
        existing = session.exec(
            select(AdminUser).where(AdminUser.email == email)
        ).first()
        if existing is None:
            session.add(AdminUser(email=email, hashed_password=hash_password(password)))
            session.commit()
            logging.info("Created admin user from environment: %s", email)
            return

        if not verify_password(password, existing.hashed_password):
            existing.hashed_password = hash_password(password)
            session.add(existing)
            session.commit()
            logging.info("Updated admin password from environment for: %s", email)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
