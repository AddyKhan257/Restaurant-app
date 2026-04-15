from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_order_confirmation_email(self, order_id):
    """Send order confirmation email to customer."""
    try:
        from .models import Order
        order = Order.objects.select_related("user").get(id=order_id)
        send_mail(
            subject=f"Savoria — Order {order.order_number} Confirmed!",
            message=(
                f"Hi {order.user.first_name},\n\n"
                f"Your order {order.order_number} has been received!\n"
                f"Total: ${order.total}\n"
                f"Type: {order.get_order_type_display()}\n\n"
                f"We'll notify you when it's ready.\n\n"
                f"— The Savoria Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=False,
        )
        logger.info(f"Confirmation email sent for order {order.order_number}")
    except Exception as exc:
        logger.error(f"Failed to send email for order {order_id}: {exc}")
        self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3)
def send_order_status_update_email(self, order_id):
    """Notify customer when order status changes."""
    try:
        from .models import Order
        order = Order.objects.select_related("user").get(id=order_id)
        send_mail(
            subject=f"Savoria — Order {order.order_number} Update",
            message=(
                f"Hi {order.user.first_name},\n\n"
                f"Your order {order.order_number} is now: {order.get_status_display()}\n\n"
                f"— The Savoria Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=False,
        )
    except Exception as exc:
        logger.error(f"Failed to send status email for order {order_id}: {exc}")
        self.retry(exc=exc, countdown=60)


@shared_task
def auto_cancel_stale_orders():
    """Cancel orders stuck in pending for more than 30 minutes."""
    from django.utils import timezone
    from datetime import timedelta
    from .models import Order

    cutoff = timezone.now() - timedelta(minutes=30)
    stale = Order.objects.filter(status=Order.Status.PENDING, created_at__lt=cutoff)
    count = stale.update(status=Order.Status.CANCELLED)
    logger.info(f"Auto-cancelled {count} stale orders")
