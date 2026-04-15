from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.db.models import Sum, Count
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_daily_report():
    """Send daily analytics summary to admin."""
    from apps.orders.models import Order
    from apps.reservations.models import Reservation

    today = timezone.now().date()
    orders = Order.objects.filter(created_at__date=today)
    revenue = orders.filter(
        status__in=["delivered", "picked_up", "completed"]
    ).aggregate(total=Sum("total"))["total"] or 0
    reservations = Reservation.objects.filter(date=today).count()

    send_mail(
        subject=f"Savoria Daily Report — {today.strftime('%B %d, %Y')}",
        message=(
            f"Daily Summary:\n\n"
            f"Orders: {orders.count()}\n"
            f"Revenue: ${revenue:.2f}\n"
            f"Reservations: {reservations}\n"
            f"Pending orders: {orders.filter(status='pending').count()}\n"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.DEFAULT_FROM_EMAIL],
        fail_silently=True,
    )
    logger.info(f"Daily report sent for {today}")
