"""Create initial admin user from ADMIN_EMAIL / ADMIN_PASSWORD if missing."""

import os
import sys

from dotenv import load_dotenv
from sqlmodel import Session, select

load_dotenv()

# Ensure app is importable when run as `uv run python seed_admin.py`
sys.path.insert(0, os.path.dirname(__file__))

from app.database import engine  # noqa: E402
from app.models import AdminUser  # noqa: E402
from app.utils.auth import hash_password  # noqa: E402


def main() -> None:
    email = os.environ.get("ADMIN_EMAIL")
    password = os.environ.get("ADMIN_PASSWORD")
    if not email or not password:
        raise SystemExit("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment or .env")

    with Session(engine) as session:
        existing = session.exec(select(AdminUser).where(AdminUser.email == email)).first()
        if existing:
            print("Admin user already exists; skipping.")
            return
        user = AdminUser(email=email, hashed_password=hash_password(password))
        session.add(user)
        session.commit()
        print(f"Created admin user {email}")


if __name__ == "__main__":
    main()
