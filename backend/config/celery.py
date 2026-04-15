import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

app = Celery("savoria")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# Periodic tasks
app.conf.beat_schedule = {
    "cleanup-expired-reservations": {
        "task": "apps.reservations.tasks.cleanup_expired_reservations",
        "schedule": crontab(minute="*/30"),
    },
    "send-daily-analytics-report": {
        "task": "apps.analytics.tasks.send_daily_report",
        "schedule": crontab(hour=23, minute=55),
    },
    "send-reservation-reminders": {
        "task": "apps.reservations.tasks.send_reservation_reminders",
        "schedule": crontab(hour=9, minute=0),
    },
}
