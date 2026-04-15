from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_reservation_confirmation(self, reservation_id):
    try:
        from .models import Reservation
        r = Reservation.objects.get(id=reservation_id)
        send_mail(
            subject="Savoria — Reservation Received!",
            message=(
                f"Hi {r.guest_name},\n\n"
                f"We've received your reservation for {r.party_size} guests "
                f"on {r.date.strftime('%B %d, %Y')} at {r.time.strftime('%I:%M %p')}.\n\n"
                f"We'll confirm shortly.\n\n— The Savoria Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[r.guest_email],
            fail_silently=False,
        )
    except Exception as exc:
        logger.error(f"Reservation email failed: {exc}")
        self.retry(exc=exc, countdown=60)


@shared_task
def send_reservation_reminders():
    """Send reminder emails for reservations happening tomorrow."""
    from .models import Reservation
    tomorrow = timezone.now().date() + timedelta(days=1)
    reservations = Reservation.objects.filter(
        date=tomorrow, status__in=["pending", "confirmed"]
    )
    for r in reservations:
        send_mail(
            subject="Savoria — Reservation Reminder",
            message=(
                f"Hi {r.guest_name},\n\n"
                f"Reminder: you have a reservation tomorrow at "
                f"{r.time.strftime('%I:%M %p')} for {r.party_size} guests.\n\n"
                f"— The Savoria Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[r.guest_email],
            fail_silently=True,
        )
    logger.info(f"Sent {reservations.count()} reservation reminders")


@shared_task
def cleanup_expired_reservations():
    """Mark past no-show reservations."""
    from .models import Reservation
    cutoff = timezone.now() - timedelta(hours=2)
    updated = Reservation.objects.filter(
        status__in=["pending", "confirmed"],
        date__lt=cutoff.date(),
    ).update(status="no_show")
    logger.info(f"Marked {updated} reservations as no-show")
