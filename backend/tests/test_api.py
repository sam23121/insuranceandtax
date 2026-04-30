"""API tests for public availability, booking, admin auth, dashboard, and contact."""

from fastapi.testclient import TestClient


def test_admin_routes_require_auth(client: TestClient):
    r = client.get("/api/admin/dashboard/stats")
    assert r.status_code == 401


def test_health(client: TestClient):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_availability_dates_and_slots(client: TestClient):
    r = client.get("/api/availability/dates", params={"year": 2031, "month": 6})
    assert r.status_code == 200
    assert "2031-06-15" in r.json()["available_dates"]

    r2 = client.get("/api/availability/slots", params={"date": "2031-06-15"})
    assert r2.status_code == 200
    slots = r2.json()["slots"]
    assert len(slots) == 1
    assert slots[0]["is_booked"] is False
    sid = slots[0]["id"]

    r3 = client.post(
        "/api/appointments",
        json={
            "slot_id": sid,
            "service": "tax_preparation",
            "first_name": "T",
            "last_name": "User",
            "email": "t@example.com",
            "phone": "7025559999",
        },
    )
    assert r3.status_code == 201
    body = r3.json()
    assert body["confirmation_code"].startswith("APT-")
    assert body["service"] == "tax_preparation"

    r4 = client.post(
        "/api/appointments",
        json={
            "slot_id": sid,
            "service": "auto_insurance",
            "first_name": "X",
            "last_name": "Y",
            "email": "x@example.com",
            "phone": "7025558888",
        },
    )
    assert r4.status_code == 409


def test_admin_login_and_dashboard(client: TestClient):
    r = client.post("/api/admin/login", json={"email": "admin@test.com", "password": "wrong"})
    assert r.status_code == 401

    r2 = client.post("/api/admin/login", json={"email": "admin@test.com", "password": "secret123"})
    assert r2.status_code == 200
    token = r2.json()["access_token"]
    h = {"Authorization": f"Bearer {token}"}

    r3 = client.get("/api/admin/dashboard/stats", headers=h)
    assert r3.status_code == 200
    data = r3.json()
    assert "total_this_month" in data
    assert "recent_appointments" in data


def test_contact_endpoint(client: TestClient):
    r = client.post(
        "/api/contact",
        json={
            "name": "Visitor",
            "email": "visitor@example.com",
            "subject": "Hello",
            "message": "Test message body",
        },
    )
    assert r.status_code == 200
    assert "sent" in r.json()["message"].lower()
