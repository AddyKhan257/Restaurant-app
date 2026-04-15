import uuid
from django.db import models
from django.conf import settings
from decimal import Decimal
from apps.menu.models import MenuItem


class Order(models.Model):
    """Customer order."""

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        PREPARING = "preparing", "Preparing"
        READY = "ready", "Ready"
        OUT_FOR_DELIVERY = "out_for_delivery", "Out for Delivery"
        DELIVERED = "delivered", "Delivered"
        PICKED_UP = "picked_up", "Picked Up"
        CANCELLED = "cancelled", "Cancelled"

    class OrderType(models.TextChoices):
        DELIVERY = "delivery", "Delivery"
        PICKUP = "pickup", "Pickup"
        DINE_IN = "dine_in", "Dine In"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    order_number = models.CharField(max_length=20, unique=True, editable=False)
    order_type = models.CharField(max_length=15, choices=OrderType.choices, default=OrderType.DELIVERY)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    # Delivery info
    delivery_address = models.TextField(blank=True)
    delivery_notes = models.TextField(blank=True)
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal("0.00"))

    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    tax = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal("0.00"))
    tip = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal("0.00"))
    discount = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal("0.00"))
    total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))

    # Payment
    payment_method = models.CharField(max_length=50, blank=True)
    payment_status = models.CharField(max_length=20, default="unpaid")
    stripe_payment_intent = models.CharField(max_length=255, blank=True)

    # Timing
    estimated_ready_time = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order {self.order_number}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            import time
            self.order_number = f"SAV-{int(time.time()) % 100000:05d}"
        if not self.total:
            self.calculate_total()
        super().save(*args, **kwargs)

    def calculate_total(self):
        self.subtotal = sum(item.line_total for item in self.items.all())
        self.tax = self.subtotal * Decimal("0.08")  # 8% tax
        self.total = self.subtotal + self.tax + self.delivery_fee + self.tip - self.discount


class OrderItem(models.Model):
    """Single line item in an order."""

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    menu_item = models.ForeignKey(MenuItem, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200)  # snapshot
    price = models.DecimalField(max_digits=8, decimal_places=2)  # snapshot
    quantity = models.PositiveIntegerField(default=1)
    modifiers = models.JSONField(default=list, blank=True)
    special_instructions = models.TextField(blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.quantity}x {self.name}"

    @property
    def line_total(self):
        modifier_total = sum(Decimal(str(m.get("price", 0))) for m in self.modifiers)
        return (self.price + modifier_total) * self.quantity
