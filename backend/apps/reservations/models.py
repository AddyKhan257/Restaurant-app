from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Table(models.Model):
    """Restaurant table."""
    number = models.PositiveIntegerField(unique=True)
    capacity = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(20)])
    location = models.CharField(max_length=50, blank=True)  # e.g., "patio", "window", "private"
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["number"]

    def __str__(self):
        return f"Table {self.number} (seats {self.capacity})"


class Reservation(models.Model):
    """Table reservation."""

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        SEATED = "seated", "Seated"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"
        NO_SHOW = "no_show", "No Show"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reservations")
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True, blank=True, related_name="reservations")
    guest_name = models.CharField(max_length=100)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=20, blank=True)
    party_size = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(20)])
    date = models.DateField()
    time = models.TimeField()
    duration_minutes = models.PositiveIntegerField(default=90)
    special_requests = models.TextField(blank=True)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date", "time"]

    def __str__(self):
        return f"{self.guest_name} — {self.date} {self.time} (party of {self.party_size})"
