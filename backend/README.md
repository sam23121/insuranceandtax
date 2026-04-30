# Insurance & Tax API

FastAPI + SQLModel + PostgreSQL. See `../project_specification.md` for the full API contract.

## Setup

1. Copy `.env.example` to `.env` and set variables (especially `DATABASE_URL`, `JWT_SECRET_KEY`, admin seed).
2. `uv sync`
3. `uv run alembic upgrade head`
4. `uv run python seed_admin.py`
5. `uv run uvicorn app.main:app --reload --port 8000`

Public API base path: `http://localhost:8000/api`.

Password hashing uses **bcrypt** directly (not passlib) for compatibility with current bcrypt releases.
