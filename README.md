# Insurance & Tax — Full Stack

Monorepo for the business site described in [project_specification.md](./project_specification.md): React + Vite frontend, FastAPI + PostgreSQL backend, booking and admin flows.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ and npm  
- [uv](https://docs.astral.sh/uv/) for Python  
- Docker (optional, for local PostgreSQL)

## 1. Database (PostgreSQL)

Start Postgres with Docker:

```bash
docker compose up -d postgres
```

Compose maps Postgres to host port **5444** (avoids clashing with a local Postgres on 5432). Put this in `backend/.env`:

`DATABASE_URL=postgresql://insurance:insurance@localhost:5444/insurance_db`

Alembic loads `backend/.env` automatically, so you do not need to `export DATABASE_URL` before `uv run alembic upgrade head`. If you use another port, change only `.env`.

## 2. Backend

```bash
cd backend
cp .env.example .env
# Set DATABASE_URL, JWT_SECRET_KEY (32+ chars), ADMIN_EMAIL, ADMIN_PASSWORD, and optional Resend keys.

uv sync
uv run alembic upgrade head
uv run python seed_admin.py
uv run uvicorn app.main:app --reload --port 8000
```

- API: `http://localhost:8000/api`  
- OpenAPI: `http://localhost:8000/docs`  
- Health: `http://localhost:8000/health`

## 3. Frontend

The project pins **Vite 6** (not Vite 8): Vite 8’s Rolldown CLI can crash on **Node.js 21** with `util.styleText` / `ERR_INVALID_ARG_VALUE`. Use Node 20 LTS or 22+ if you prefer to try Vite 8 again.

```bash
cd frontend
cp .env.example .env
# Default VITE_API_URL uses Vite proxy to localhost:8000 — adjust for production.

npm install
npm run dev
```

App: `http://localhost:5173` — API calls to `/api` are proxied to the backend in dev (see `frontend/vite.config.ts`).

## 4. Tests

**Backend** (SQLite in-memory per test; no Docker required):

```bash
cd backend && uv run pytest
```

**CI**: push triggers `.github/workflows/ci.yml` (backend tests + frontend build).

## Production notes

- Set `CORS_ORIGINS`, `FRONTEND_URL`, `ADMIN_URL`, and Resend (`RESEND_API_KEY`, `EMAIL_FROM`, `OWNER_EMAIL`) in the backend environment.  
- Point `VITE_API_URL` at your public API base (e.g. `https://api.example.com/api`).
