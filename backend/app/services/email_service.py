import logging
from datetime import date, datetime, time

import resend

from app.config import get_settings
from app.models import Appointment

logger = logging.getLogger(__name__)


def _configure() -> bool:
    settings = get_settings()
    if not settings.resend_api_key:
        logger.warning("RESEND_API_KEY not set; skipping email send")
        return False
    resend.api_key = settings.resend_api_key
    return True


def _fmt_date(d: date) -> str:
    return d.strftime("%A, %B %d, %Y")


def _fmt_time(t: time) -> str:
    return datetime.combine(date.min, t).strftime("%I:%M %p").lstrip("0")


def _service_title(slug: str) -> str:
    titles = {
        "auto_insurance": "Auto Insurance",
        "commercial_auto": "Commercial Auto Insurance",
        "business_insurance": "Business Insurance",
        "tax_preparation": "Tax Preparation",
        "immigration_forms": "Immigration Forms",
        "notary_services": "Notary Services",
    }
    return titles.get(slug, slug.replace("_", " ").title())


def send_client_booking_confirmation(appointment: Appointment, slot_date: date, slot_time: time) -> None:
    if not _configure():
        return
    settings = get_settings()
    svc = _service_title(appointment.service)
    subject = f"Appointment Confirmed – {svc} on {_fmt_date(slot_date)} at {_fmt_time(slot_time)}"
    html = f"""
    <p>Dear {appointment.first_name},</p>
    <p>Your appointment has been confirmed!</p>
    <p><strong>Appointment Details</strong><br/>
    Confirmation Code: {appointment.confirmation_code}<br/>
    Service: {svc}<br/>
    Date: {_fmt_date(slot_date)}<br/>
    Time: {_fmt_time(slot_time)}</p>
    <p><strong>What to Bring:</strong><br/>
    • Valid government-issued ID<br/>
    • Any relevant documents for your service</p>
    <p>If you need to cancel or reschedule, please contact us at:<br/>
    📞 {settings.business_phone}<br/>
    📧 {settings.business_email}</p>
    <p>Thank you for choosing {settings.business_name}!</p>
    <p>{settings.business_name}<br/>{settings.business_address}</p>
    """
    try:
        resend.Emails.send(
            {
                "from": settings.email_from,
                "to": [appointment.email],
                "subject": subject,
                "html": html,
            }
        )
    except Exception:
        logger.exception("Failed to send client confirmation email")


def send_owner_new_booking(appointment: Appointment, slot_date: date, slot_time: time) -> None:
    if not _configure():
        return
    settings = get_settings()
    if not settings.owner_email:
        return
    svc = _service_title(appointment.service)
    subject = f"New Appointment: {svc} – {appointment.first_name} {appointment.last_name} on {_fmt_date(slot_date)}"
    notes = appointment.notes or "—"
    link = f"{settings.admin_url.rstrip('/')}/admin/appointments?id={appointment.id}"
    html = f"""
    <p>New Appointment Booked</p>
    <p>Client: {appointment.first_name} {appointment.last_name}<br/>
    Email: {appointment.email}<br/>
    Phone: {appointment.phone}<br/>
    Service: {svc}<br/>
    Date: {_fmt_date(slot_date)}<br/>
    Time: {_fmt_time(slot_time)}<br/>
    Code: {appointment.confirmation_code}</p>
    <p>Client Notes:<br/>{notes}</p>
    <p><a href="{link}">View in Admin Panel</a></p>
    """
    try:
        resend.Emails.send(
            {
                "from": settings.email_from,
                "to": [settings.owner_email],
                "subject": subject,
                "html": html,
            }
        )
    except Exception:
        logger.exception("Failed to send owner notification email")


def send_client_cancellation(appointment: Appointment, slot_date: date, slot_time: time) -> None:
    if not _configure():
        return
    settings = get_settings()
    svc = _service_title(appointment.service)
    subject = f"Appointment Cancellation – {appointment.confirmation_code}"
    book_url = f"{settings.frontend_url.rstrip('/')}/booking"
    html = f"""
    <p>Dear {appointment.first_name},</p>
    <p>Your appointment on {_fmt_date(slot_date)} at {_fmt_time(slot_time)} for {svc} has been cancelled.</p>
    <p>If you'd like to reschedule, please visit: <a href="{book_url}">{book_url}</a></p>
    <p>We apologize for any inconvenience.</p>
    <p>{settings.business_name}</p>
    """
    try:
        resend.Emails.send(
            {
                "from": settings.email_from,
                "to": [appointment.email],
                "subject": subject,
                "html": html,
            }
        )
    except Exception:
        logger.exception("Failed to send cancellation email")


def send_contact_message(*, name: str, email: str, subject: str, message: str) -> None:
    if not _configure():
        return
    settings = get_settings()
    if not settings.owner_email:
        return
    subj = f"[Contact Form] {subject}"
    html = f"""
    <p><strong>From:</strong> {name} &lt;{email}&gt;</p>
    <p><strong>Subject:</strong> {subject}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">{message}</pre>
    """
    try:
        resend.Emails.send(
            {
                "from": settings.email_from,
                "to": [settings.owner_email],
                "reply_to": email,
                "subject": subj,
                "html": html,
            }
        )
    except Exception:
        logger.exception("Failed to send contact form email")
