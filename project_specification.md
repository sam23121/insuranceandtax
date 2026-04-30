# 📋 Project Specification: Insurance & Tax Business Website
> Full-Stack Static Website with Booking & Admin System  
> **Stack:** React (TypeScript) · FastAPI · uv · PostgreSQL · Resend (email)

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack & Tooling](#2-tech-stack--tooling)
3. [Project Structure](#3-project-structure)
4. [Design System](#4-design-system)
5. [Frontend Pages & Components](#5-frontend-pages--components)
6. [Backend API Specification](#6-backend-api-specification)
7. [Database Schema](#7-database-schema)
8. [Email System](#8-email-system)
9. [Booking System Logic](#9-booking-system-logic)
10. [Admin System](#10-admin-system)
11. [Authentication](#11-authentication)
12. [Environment Variables](#12-environment-variables)
13. [Build & Deployment](#13-build--deployment)
14. [Implementation Order](#14-implementation-order)

---

## 1. Project Overview

### Business Description
A professional insurance and tax services business offering:
- **Auto Insurance** – personal vehicle coverage plans
- **Commercial Auto Insurance** – fleet and business vehicle coverage
- **Business Insurance** – general liability, property, and more
- **Tax Preparation Services** – individual and business tax filing
- **Immigration Forms Services** – assistance with USCIS and related forms
- **Notary Services** – document notarization

### Goals
- Present services clearly to potential clients
- Allow clients to book appointments online
- Allow the business owner to manage available time slots and view/manage appointments
- Send automated email confirmations to both client and business owner upon booking

---

## 2. Tech Stack & Tooling

### Frontend
| Tool | Version | Purpose |
|------|---------|---------|
| React | 18+ | UI framework |
| TypeScript | 5+ | Type safety |
| Vite | 5+ | Build tool & dev server |
| React Router DOM | 6+ | Client-side routing |
| TanStack Query | 5+ | Server state management & caching |
| React Hook Form | 7+ | Form management |
| Zod | 3+ | Schema validation (shared types with backend) |
| Tailwind CSS | 3+ | Utility-first styling |
| shadcn/ui | latest | Accessible component primitives |
| Lucide React | latest | Icon library |
| date-fns | 3+ | Date formatting and manipulation |
| Axios | 1+ | HTTP client |

### Backend
| Tool | Version | Purpose |
|------|---------|---------|
| Python | 3.12+ | Runtime |
| uv | latest | Package manager & virtual env |
| FastAPI | 0.110+ | API framework |
| Uvicorn | latest | ASGI server |
| SQLModel | latest | ORM (built on SQLAlchemy + Pydantic) |
| PostgreSQL | 15+ | Primary database |
| Alembic | latest | Database migrations |
| Resend | latest | Transactional email delivery |
| python-jose | latest | JWT token handling |
| passlib[bcrypt] | latest | Password hashing |
| python-dotenv | latest | Environment variable loading |
| httpx | latest | Async HTTP client (for testing) |

---

## 3. Project Structure

```
project-root/
├── frontend/                          # React TypeScript app
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/                    # Images, logos, static files
│   │   ├── components/
│   │   │   ├── ui/                    # shadcn/ui primitives
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── ServicesGrid.tsx
│   │   │   │   ├── WhyChooseUs.tsx
│   │   │   │   ├── TestimonialsSection.tsx
│   │   │   │   └── CTASection.tsx
│   │   │   ├── booking/
│   │   │   │   ├── BookingCalendar.tsx
│   │   │   │   ├── TimeSlotPicker.tsx
│   │   │   │   ├── BookingForm.tsx
│   │   │   │   └── BookingConfirmation.tsx
│   │   │   └── admin/
│   │   │       ├── AdminSidebar.tsx
│   │   │       ├── AppointmentsTable.tsx
│   │   │       ├── AvailabilityManager.tsx
│   │   │       └── AppointmentDetailModal.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ServicesPage.tsx
│   │   │   ├── AutoInsurancePage.tsx
│   │   │   ├── CommercialAutoPage.tsx
│   │   │   ├── BusinessInsurancePage.tsx
│   │   │   ├── TaxPreparationPage.tsx
│   │   │   ├── ImmigrationFormsPage.tsx
│   │   │   ├── NotaryServicesPage.tsx
│   │   │   ├── BookingPage.tsx
│   │   │   ├── BookingSuccessPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── AdminLoginPage.tsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboardPage.tsx
│   │   │       ├── AdminAppointmentsPage.tsx
│   │   │       └── AdminAvailabilityPage.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useBooking.ts
│   │   │   └── useAvailability.ts
│   │   ├── lib/
│   │   │   ├── api.ts                 # Axios instance + API calls
│   │   │   ├── utils.ts               # cn() and helpers
│   │   │   └── constants.ts           # Service list, nav links, etc.
│   │   ├── types/
│   │   │   └── index.ts               # Shared TypeScript types
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                           # FastAPI application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI app entry point
│   │   ├── config.py                  # Settings from env vars
│   │   ├── database.py                # DB engine & session
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── appointment.py
│   │   │   ├── availability.py
│   │   │   └── admin.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── appointment.py
│   │   │   ├── availability.py
│   │   │   └── admin.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── appointments.py
│   │   │   ├── availability.py
│   │   │   └── admin.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── email_service.py
│   │   │   └── booking_service.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── auth.py                # JWT helpers
│   │       └── dependencies.py        # FastAPI dependencies
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   ├── alembic.ini
│   ├── pyproject.toml
│   └── .env
│
├── .gitignore
└── README.md
```

---

## 4. Design System

### Brand Identity
- **Primary Color:** Deep navy blue `#1B2B5B`
- **Accent Color:** Gold/amber `#D4A017`
- **Secondary Accent:** Warm white `#F8F6F1`
- **Text:** Dark charcoal `#1A1A2E`
- **Success:** Emerald `#10B981`
- **Error:** Rose `#EF4444`
- **Background:** Off-white `#FAFAF8`

### Typography
- **Headings:** `Playfair Display` (serif) – conveys trust and professionalism
- **Body:** `DM Sans` – clean and readable
- **Monospace (admin):** `JetBrains Mono`
- Load both from Google Fonts in `index.html`

### Tone & Feel
- Professional, trustworthy, approachable
- Warm accents to feel personal and community-focused
- Clean layouts with ample white space
- Subtle shadow and border-radius (rounded-xl) on cards
- No dark mode required

### Tailwind Config Extensions
```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          navy:  '#1B2B5B',
          gold:  '#D4A017',
          cream: '#F8F6F1',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
    },
  },
}
```

---

## 5. Frontend Pages & Components

### 5.1 Layout (All Pages)

**`Layout.tsx`**
- Wraps all public pages with `<Navbar />` and `<Footer />`
- Admin pages use a separate layout with `<AdminSidebar />`

**`Navbar.tsx`**
- Logo (left) + nav links (center) + "Book Appointment" CTA button (right)
- Mobile: hamburger menu with drawer
- Nav Links:
  - Home → `/`
  - Services → `/services` (dropdown with all 6 services)
  - Book Appointment → `/booking`
  - Contact → `/contact`
- Sticky on scroll with subtle shadow

**`Footer.tsx`**
- Business name, tagline, address, phone, email
- Links to all service pages
- Social media icons (placeholder links)
- Copyright notice

---

### 5.2 Home Page (`/`)

Sections in order:

**`HeroSection.tsx`**
- Full-width banner with background image overlay (professional office/handshake photo)
- Headline: `"Trusted Insurance, Tax & Business Services"`
- Subheadline: `"Protecting what matters most — your family, business, and future."`
- Two CTA buttons: `"Our Services"` (secondary) and `"Book an Appointment"` (primary/gold)

**`ServicesGrid.tsx`**
- Section heading: `"What We Offer"`
- 6 service cards in a responsive grid (3 cols desktop, 2 tablet, 1 mobile)
- Each card: icon, service name, 1-line description, "Learn More" link
- Services:
  1. Auto Insurance
  2. Commercial Auto Insurance
  3. Business Insurance
  4. Tax Preparation
  5. Immigration Forms
  6. Notary Services

**`WhyChooseUs.tsx`**
- 4 trust pillars in icon + text format:
  1. Licensed & Experienced Professionals
  2. Bilingual Services (English & Spanish)
  3. Same-Day Appointments Available
  4. Personalized, Client-First Approach

**`TestimonialsSection.tsx`**
- 3 static testimonial cards with star ratings, client name, and quote
- Use placeholder content (the owner can update)

**`CTASection.tsx`**
- Dark navy background section
- Text: `"Ready to get started? Schedule your appointment today."`
- Single CTA button: `"Book Now"`

---

### 5.3 Service Detail Pages

Each of the 6 services gets its own page. All follow the same template structure:

**Template structure for each service page:**
```
/auto-insurance
/commercial-auto
/business-insurance
/tax-preparation
/immigration-forms
/notary-services
```

**Common Service Page Layout:**
1. **Hero Banner** – service name + subtitle + background gradient
2. **Overview Section** – 2–3 paragraphs describing the service
3. **What's Included** – bullet list of coverage items or features
4. **Who Needs This** – target audience description
5. **FAQ Accordion** – 4–6 FAQs per service
6. **Booking CTA** – "Schedule a Consultation" button → `/booking?service=<service-name>`

**Service-Specific Content:**

**Auto Insurance**
- Overview: Personal vehicle coverage including liability, collision, comprehensive, uninsured motorist
- Included: Liability coverage, collision, comprehensive, medical payments, rental reimbursement
- FAQ topics: minimum coverage requirements, SR-22 filings, discounts available, multi-car policies

**Commercial Auto Insurance**
- Overview: Coverage for business-owned vehicles including trucks, vans, and fleets
- Included: Bodily injury liability, property damage, cargo coverage, hired/non-owned vehicles
- FAQ topics: difference from personal auto, coverage for employees, fleet pricing

**Business Insurance**
- Overview: Protect your business from liability, property damage, and unexpected events
- Included: General liability, commercial property, business interruption, workers' comp referrals
- FAQ topics: what size businesses need it, BOP bundles, claims process

**Tax Preparation**
- Overview: Individual (1040) and business tax returns prepared by experienced professionals
- Included: Federal & state returns, self-employed / Schedule C, ITIN applications, amended returns, e-filing
- FAQ topics: documents needed, filing deadlines, ITIN vs SSN, refund timeline

**Immigration Forms**
- Overview: Assistance completing and reviewing USCIS forms accurately
- Included: Form I-90, I-130, I-485, I-765, N-400, DACA renewals (I-821D)
- **Important Disclaimer (display prominently):** "We are NOT attorneys. We provide document preparation services only and do not provide legal advice. For legal representation, please consult an immigration attorney."
- FAQ topics: what forms we help with, processing times (not guaranteed), how to track status

**Notary Services**
- Overview: Commissioned notary public for document authentication
- Included: Acknowledgments, jurats, affidavits, loan documents, power of attorney, vehicle titles
- FAQ topics: what to bring, mobile notary availability, apostille referrals, fees

---

### 5.4 Booking Page (`/booking`)

Multi-step booking flow:

**Step 1 – Select Service**
- Grid of 6 service cards, user clicks to select
- Pre-select if `?service=` query param is present
- "Next" button disabled until selection made

**Step 2 – Pick a Date & Time (`BookingCalendar.tsx` + `TimeSlotPicker.tsx`)**
- Calendar showing current month
  - Disabled: past dates, dates with no availability set by admin
  - Available dates highlighted in gold
- On date select: fetch and show available time slots for that date
- Time slots displayed as buttons (e.g., `9:00 AM`, `10:00 AM`, etc.)
- Booked slots are grayed out and unclickable

**Step 3 – Your Information (`BookingForm.tsx`)**
- Fields:
  - First Name (required)
  - Last Name (required)
  - Email (required, validated)
  - Phone Number (required, formatted)
  - Notes / Message (optional, textarea)
- Validate with Zod + React Hook Form
- "Confirm Booking" submit button

**Step 4 – Confirmation (`BookingConfirmation.tsx`)**
- Show success state with checkmark icon
- Display booking summary: service, date, time, name, email
- Message: "A confirmation email has been sent to [email]"
- Button: "Book Another Appointment"

---

### 5.5 Booking Success Page (`/booking/success`)
- Redirect here after successful booking (with booking ID in query params)
- Show confirmation summary
- Link back to home

---

### 5.6 Contact Page (`/contact`)
- Business address, phone, email displayed
- Hours of operation (static content)
- Simple contact form (Name, Email, Subject, Message)
  - On submit: send a POST to `/api/contact` which emails the business owner
- Embedded Google Maps iframe (placeholder — owner provides address)

---

### 5.7 Admin Login Page (`/admin/login`)
- Simple centered form: Email + Password
- On submit: POST to `/api/admin/login`, store JWT in `localStorage`
- Redirect to `/admin/dashboard` on success
- Show error message on failed login

---

### 5.8 Admin Dashboard (`/admin/dashboard`)
Protected route — redirect to `/admin/login` if not authenticated.

**`AdminSidebar.tsx`**
- Links: Dashboard, Appointments, Availability, Logout
- Business logo at top

**Dashboard Overview Cards:**
- Total Appointments (this month)
- Upcoming Appointments (next 7 days)
- Pending / Unconfirmed count
- Most booked service

**Recent Appointments Table:**
- Last 10 appointments: Date, Time, Client Name, Service, Status

---

### 5.9 Admin Appointments Page (`/admin/appointments`)

**`AppointmentsTable.tsx`**
- Full paginated table of all appointments
- Columns: Date, Time, Client Name, Email, Phone, Service, Notes, Status, Actions
- Filters: by service, by status, by date range
- Search by client name or email
- Actions per row:
  - **View Details** → opens `AppointmentDetailModal.tsx`
  - **Cancel** → marks appointment as `cancelled`, triggers cancellation email to client
- Status badges: `upcoming` (blue), `completed` (green), `cancelled` (red)
- Export to CSV button

**`AppointmentDetailModal.tsx`**
- All appointment fields
- Notes from client
- Option to mark as Completed or Cancelled
- Option to add admin notes

---

### 5.10 Admin Availability Page (`/admin/availability`)

**`AvailabilityManager.tsx`**
- Calendar view of the current month
- Click a date to open a time slot editor for that date
- Time Slot Editor:
  - Add time slots (e.g., `9:00 AM`, `9:30 AM`, `10:00 AM`, etc.) with a `+` button
  - Remove individual slots with `×`
  - "Save" persists to backend
- Bulk Tools:
  - "Copy Monday's schedule to all weekdays" shortcut
  - "Clear all slots for this date"
  - "Set recurring weekly schedule" (choose days of week + time range + interval in minutes → auto-generates slots for N weeks)

---

## 6. Backend API Specification

### Base URL
```
Development:  http://localhost:8000/api
Production:   https://yourdomain.com/api
```

### 6.1 Public Endpoints

#### `GET /availability/dates`
Returns dates that have at least one available (unbooked) time slot.

**Query Params:**
- `year` (int, required)
- `month` (int, required)

**Response `200`:**
```json
{
  "available_dates": ["2025-09-01", "2025-09-03", "2025-09-05"]
}
```

---

#### `GET /availability/slots`
Returns all time slots for a specific date, indicating availability.

**Query Params:**
- `date` (string, `YYYY-MM-DD`, required)

**Response `200`:**
```json
{
  "date": "2025-09-01",
  "slots": [
    { "id": "uuid", "time": "09:00", "is_booked": false },
    { "id": "uuid", "time": "09:30", "is_booked": true },
    { "id": "uuid", "time": "10:00", "is_booked": false }
  ]
}
```

---

#### `POST /appointments`
Create a new appointment booking.

**Request Body:**
```json
{
  "slot_id": "uuid",
  "service": "auto_insurance",
  "first_name": "Maria",
  "last_name": "Garcia",
  "email": "maria@example.com",
  "phone": "7025551234",
  "notes": "Need SR-22 filing"
}
```

**Response `201`:**
```json
{
  "id": "uuid",
  "confirmation_code": "APT-2025-0042",
  "service": "auto_insurance",
  "date": "2025-09-01",
  "time": "09:00",
  "first_name": "Maria",
  "last_name": "Garcia",
  "email": "maria@example.com",
  "phone": "7025551234",
  "status": "upcoming",
  "created_at": "2025-08-20T14:32:00Z"
}
```

**Side Effects:**
- Marks slot as `is_booked = true`
- Triggers client confirmation email
- Triggers business owner notification email

**Errors:**
- `409 Conflict` – slot already booked
- `404 Not Found` – slot_id not found
- `422 Unprocessable Entity` – validation errors

---

#### `POST /contact`
Send a contact form message to the business owner.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "subject": "Question about tax services",
  "message": "I need help with..."
}
```

**Response `200`:**
```json
{ "message": "Your message has been sent successfully." }
```

---

### 6.2 Admin Endpoints
> All admin endpoints require `Authorization: Bearer <token>` header.

#### `POST /admin/login`
Authenticate the admin user.

**Request Body:**
```json
{
  "email": "admin@business.com",
  "password": "securepassword"
}
```

**Response `200`:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

**Errors:**
- `401 Unauthorized` – invalid credentials

---

#### `GET /admin/appointments`
Get all appointments with optional filters.

**Query Params (all optional):**
- `service` – filter by service slug
- `status` – `upcoming | completed | cancelled`
- `date_from` – `YYYY-MM-DD`
- `date_to` – `YYYY-MM-DD`
- `search` – search by name or email
- `page` – pagination (default `1`)
- `per_page` – items per page (default `20`)

**Response `200`:**
```json
{
  "total": 145,
  "page": 1,
  "per_page": 20,
  "appointments": [ { ...appointment objects... } ]
}
```

---

#### `GET /admin/appointments/{appointment_id}`
Get a single appointment's full details.

**Response `200`:** Full appointment object including admin_notes.

---

#### `PATCH /admin/appointments/{appointment_id}`
Update appointment status or admin notes.

**Request Body (partial update):**
```json
{
  "status": "completed",
  "admin_notes": "Client came in, handled SR-22."
}
```

**Side Effect:** If `status` → `cancelled`, send cancellation email to client.

**Response `200`:** Updated appointment object.

---

#### `GET /admin/availability`
Get all availability slots for a date range (admin view, includes booked).

**Query Params:**
- `date_from` (required)
- `date_to` (required)

**Response `200`:**
```json
{
  "slots": [
    {
      "id": "uuid",
      "date": "2025-09-01",
      "time": "09:00",
      "is_booked": false,
      "appointment_id": null
    }
  ]
}
```

---

#### `POST /admin/availability`
Create availability slots for a specific date.

**Request Body:**
```json
{
  "date": "2025-09-01",
  "times": ["09:00", "09:30", "10:00", "10:30", "11:00"]
}
```

**Response `201`:** Array of created slot objects.

---

#### `DELETE /admin/availability/{slot_id}`
Delete a slot (only if not booked).

**Response `200`:** `{ "message": "Slot deleted." }`

**Errors:** `409 Conflict` if slot is already booked.

---

#### `POST /admin/availability/bulk`
Create slots for multiple dates at once (recurring schedule).

**Request Body:**
```json
{
  "start_date": "2025-09-01",
  "end_date": "2025-09-30",
  "weekdays": [1, 2, 3, 4, 5],
  "start_time": "09:00",
  "end_time": "17:00",
  "interval_minutes": 30
}
```

**Response `201`:** Count of slots created.

---

#### `GET /admin/dashboard/stats`
Get summary statistics for the admin dashboard.

**Response `200`:**
```json
{
  "total_this_month": 32,
  "upcoming_next_7_days": 8,
  "cancelled_this_month": 2,
  "most_booked_service": "tax_preparation",
  "recent_appointments": [ { ...last 10... } ]
}
```

---

## 7. Database Schema

### `admin_users` table
```sql
CREATE TABLE admin_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

### `availability_slots` table
```sql
CREATE TABLE availability_slots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  is_booked   BOOLEAN DEFAULT FALSE NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, time)
);
```

### `appointments` table
```sql
CREATE TABLE appointments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id           UUID NOT NULL REFERENCES availability_slots(id),
  confirmation_code VARCHAR(20) UNIQUE NOT NULL,
  service           VARCHAR(100) NOT NULL,
  first_name        VARCHAR(100) NOT NULL,
  last_name         VARCHAR(100) NOT NULL,
  email             VARCHAR(255) NOT NULL,
  phone             VARCHAR(30) NOT NULL,
  notes             TEXT,
  status            VARCHAR(20) DEFAULT 'upcoming' NOT NULL,
  admin_notes       TEXT,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);
```

**Status values:** `upcoming` | `completed` | `cancelled`

**Service slug values:**
```
auto_insurance
commercial_auto
business_insurance
tax_preparation
immigration_forms
notary_services
```

---

## 8. Email System

Use **Resend** (https://resend.com) for transactional email delivery.

### Setup
```python
# backend/app/services/email_service.py
import resend
resend.api_key = settings.RESEND_API_KEY
```

### 8.1 Client Confirmation Email
**Trigger:** New appointment created (`POST /appointments`)
**To:** Client's email address
**Subject:** `Appointment Confirmed – [Service Name] on [Date] at [Time]`

**HTML Template Content:**
```
Dear [First Name],

Your appointment has been confirmed!

📋 Appointment Details
──────────────────────
Confirmation Code: APT-2025-XXXX
Service:           Auto Insurance
Date:              Monday, September 1, 2025
Time:              9:00 AM
──────────────────────

What to Bring:
- Valid government-issued ID
- Any relevant documents for your service

If you need to cancel or reschedule, please contact us at:
📞 [BUSINESS_PHONE]
📧 [BUSINESS_EMAIL]

Thank you for choosing [BUSINESS_NAME]!

[BUSINESS_NAME]
[BUSINESS_ADDRESS]
```

### 8.2 Business Owner Notification Email
**Trigger:** New appointment created
**To:** `settings.OWNER_EMAIL`
**Subject:** `New Appointment: [Service] – [Client Name] on [Date]`

**HTML Template Content:**
```
New Appointment Booked

Client:    Maria Garcia
Email:     maria@example.com
Phone:     (702) 555-1234
Service:   Auto Insurance
Date:      September 1, 2025
Time:      9:00 AM
Code:      APT-2025-0042

Client Notes:
"Need SR-22 filing"

View in Admin Panel: [ADMIN_URL]/admin/appointments/[UUID]
```

### 8.3 Cancellation Email (Client)
**Trigger:** Admin changes status to `cancelled`
**To:** Client's email
**Subject:** `Appointment Cancellation – [Confirmation Code]`

**Content:**
```
Dear [First Name],

Your appointment on [Date] at [Time] for [Service] has been cancelled.

If you'd like to reschedule, please visit: [BOOKING_URL]

We apologize for any inconvenience.

[BUSINESS_NAME]
```

### 8.4 Contact Form Email
**Trigger:** `POST /contact`
**To:** `settings.OWNER_EMAIL`
**Subject:** `[Contact Form] [Subject]`

---

## 9. Booking System Logic

### Availability Rules
1. Admin creates `availability_slots` for specific dates/times
2. A slot is `is_booked = False` when created
3. When a client books → slot flips to `is_booked = True`
4. The public calendar only shows dates with at least one `is_booked = False` slot
5. Past dates are always disabled on the frontend (client-side check)
6. If a slot is booked and admin cancels appointment → **do NOT** automatically free the slot (admin must manually manage this to avoid double-booking issues)

### Confirmation Code Generation
```python
def generate_confirmation_code(appointment_id: int) -> str:
    year = datetime.now().year
    return f"APT-{year}-{str(appointment_id).zfill(4)}"
```
Use a sequential counter stored in DB or use the row number.

### Race Condition Prevention
- Wrap slot booking in a database transaction
- Use `SELECT ... FOR UPDATE` on the slot row before updating
- Return `409 Conflict` if slot is already `is_booked = True` at time of commit

---

## 10. Admin System

### Access Control
- Single admin user (the business owner)
- Credentials set via environment variables on first run (seed script)
- JWT tokens with 8-hour expiry
- Frontend stores token in `localStorage` under key `admin_token`
- `AuthContext.tsx` provides `isAuthenticated`, `login()`, `logout()` to all components
- Protected routes use a `<ProtectedRoute>` component that redirects to `/admin/login` if no valid token

### Seed Script
```python
# backend/seed_admin.py
# Run once: uv run python seed_admin.py
# Creates the initial admin user from env vars
```

---

## 11. Authentication

### JWT Configuration
```python
SECRET_KEY = settings.JWT_SECRET_KEY  # 32+ char random string
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 hours
```

### Protected Route (FastAPI dependency)
```python
# utils/dependencies.py
async def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Decode JWT, look up admin user, raise 401 if invalid
    ...
```

### Protected Route (React)
```tsx
// components/ProtectedRoute.tsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
};
```

---

## 12. Environment Variables

### Backend (`.env`)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/insurance_db

# JWT
JWT_SECRET_KEY=your-super-secret-key-32-chars-minimum

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# Business Info
BUSINESS_NAME=Your Business Name
BUSINESS_PHONE=(702) 555-0000
BUSINESS_EMAIL=owner@yourdomain.com
BUSINESS_ADDRESS=123 Main St, Las Vegas, NV 89101
OWNER_EMAIL=owner@yourdomain.com

# Admin Seed
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=changeme_secure_password

# App
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5173
CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 13. Build & Deployment

### Backend Setup
```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create project
cd backend
uv init
uv add fastapi uvicorn sqlmodel psycopg2-binary alembic resend python-jose passlib python-dotenv

# Run migrations
uv run alembic upgrade head

# Seed admin user
uv run python seed_admin.py

# Start dev server
uv run uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Development: http://localhost:5173
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

### FastAPI CORS Configuration
```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Vite Proxy Configuration (Development)
```ts
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

---

## 14. Implementation Order

Follow this order to build incrementally and test as you go:

### Phase 1 – Backend Foundation
1. [ ] Initialize uv project, install dependencies
2. [ ] Set up `database.py` with SQLModel engine + session
3. [ ] Define all SQLModel models (`availability.py`, `appointment.py`, `admin.py`)
4. [ ] Run `alembic init` and create initial migration
5. [ ] Apply migration (`alembic upgrade head`)
6. [ ] Create `config.py` (Settings from env vars using pydantic-settings)
7. [ ] Create `seed_admin.py` and seed initial admin user
8. [ ] Set up `main.py` with FastAPI app, CORS, and router includes

### Phase 2 – Backend API
9. [ ] Implement `/admin/login` endpoint with JWT
10. [ ] Implement `get_current_admin` dependency
11. [ ] Implement `GET /availability/dates` and `GET /availability/slots`
12. [ ] Implement `POST /admin/availability`, `DELETE /admin/availability/{id}`, bulk
13. [ ] Implement `POST /appointments` (with slot locking + confirmation code)
14. [ ] Implement `GET /admin/appointments` (with filters + pagination)
15. [ ] Implement `PATCH /admin/appointments/{id}`
16. [ ] Implement `GET /admin/dashboard/stats`
17. [ ] Implement email service (`email_service.py`) with all 4 email types
18. [ ] Implement `POST /contact`
19. [ ] Test all endpoints with FastAPI's built-in `/docs` UI

### Phase 3 – Frontend Shell
20. [ ] Set up Vite + React + TypeScript project
21. [ ] Install and configure Tailwind CSS + shadcn/ui
22. [ ] Add Google Fonts to `index.html`
23. [ ] Configure `tailwind.config.ts` with brand colors and fonts
24. [ ] Create `lib/api.ts` (Axios instance + typed API functions for all endpoints)
25. [ ] Create `types/index.ts` (TypeScript types mirroring backend schemas)
26. [ ] Set up React Router in `App.tsx` with all routes
27. [ ] Build `Navbar.tsx` and `Footer.tsx`
28. [ ] Build `Layout.tsx` wrapping all public pages
29. [ ] Build `AuthContext.tsx` and `ProtectedRoute.tsx`

### Phase 4 – Public Pages
30. [ ] Build `HomePage.tsx` with all 5 sections
31. [ ] Build each of the 6 service detail pages
32. [ ] Build `ContactPage.tsx`

### Phase 5 – Booking Flow
33. [ ] Build `BookingCalendar.tsx` (fetches available dates)
34. [ ] Build `TimeSlotPicker.tsx` (fetches slots for selected date)
35. [ ] Build `BookingForm.tsx` (Zod validation + React Hook Form)
36. [ ] Assemble `BookingPage.tsx` multi-step flow
37. [ ] Build `BookingSuccessPage.tsx`

### Phase 6 – Admin Panel
38. [ ] Build `AdminLoginPage.tsx`
39. [ ] Build `AdminSidebar.tsx` and admin layout
40. [ ] Build `AdminDashboardPage.tsx` with stats cards
41. [ ] Build `AppointmentsTable.tsx` with filters
42. [ ] Build `AppointmentDetailModal.tsx`
43. [ ] Build `AvailabilityManager.tsx` with calendar + slot editor
44. [ ] Wire up all admin API calls with TanStack Query

### Phase 7 – Polish & QA
45. [ ] Responsive testing (mobile, tablet, desktop)
46. [ ] Accessibility audit (keyboard nav, ARIA labels, color contrast)
47. [ ] Error states for all API calls (loading spinners, error messages)
48. [ ] Empty states for tables (no appointments yet)
49. [ ] 404 page
50. [ ] End-to-end booking flow test (create slot → book → check emails → admin cancel)

---

## Appendix A: Service Slugs Reference
| Display Name | Slug |
|---|---|
| Auto Insurance | `auto_insurance` |
| Commercial Auto Insurance | `commercial_auto` |
| Business Insurance | `business_insurance` |
| Tax Preparation | `tax_preparation` |
| Immigration Forms | `immigration_forms` |
| Notary Services | `notary_services` |

## Appendix B: Key Business Rules
- No double-booking: slots are locked transactionally
- Admin is single user (no multi-admin support needed)
- Cancellations free up the slot only if admin manually deletes and recreates it
- All times stored in UTC in the database; convert to local timezone on the frontend
- Immigration disclaimer is **mandatory** on the immigration page and booking confirmation
- Email sending failures should be logged but **not** block the booking response

## Appendix C: Recommended shadcn/ui Components to Install
```bash
npx shadcn-ui@latest add button card badge input textarea
npx shadcn-ui@latest add select dialog sheet tabs
npx shadcn-ui@latest add table pagination skeleton
npx shadcn-ui@latest add calendar popover dropdown-menu
npx shadcn-ui@latest add accordion alert toast
```