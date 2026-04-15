from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.menu.models import MenuItem


class Review(models.Model):
    """Customer review for a menu item."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)  # ordered the item
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "menu_item")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} — {self.menu_item.name} ({self.rating}★)"
