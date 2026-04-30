from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database import get_session
from app.schemas.common import ContactBody, ContactResponse
from app.services import email_service

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=ContactResponse)
def contact_submit(body: ContactBody, session: Session = Depends(get_session)) -> ContactResponse:
    email_service.send_contact_message(
        name=body.name,
        email=str(body.email),
        subject=body.subject,
        message=body.message,
    )
    return ContactResponse(message="Your message has been sent successfully.")
