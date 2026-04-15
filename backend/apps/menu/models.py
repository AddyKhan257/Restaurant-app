from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Category(models.Model):
    """Menu category (e.g., Appetizers, Main Course, Desserts)."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="categories/", blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name

    @property
    def item_count(self):
        return self.items.filter(is_available=True).count()


class MenuItem(models.Model):
    """Individual dish or drink on the menu."""

    class DietaryTag(models.TextChoices):
        NONE = "", "None"
        VEGETARIAN = "vegetarian", "Vegetarian"
        VEGAN = "vegan", "Vegan"
        GLUTEN_FREE = "gluten_free", "Gluten Free"
        HALAL = "halal", "Halal"
        NUT_FREE = "nut_free", "Nut Free"
        DAIRY_FREE = "dairy_free", "Dairy Free"

    class SpiceLevel(models.IntegerChoices):
        NONE = 0, "Not Spicy"
        MILD = 1, "Mild"
        MEDIUM = 2, "Medium"
        HOT = 3, "Hot"
        EXTRA_HOT = 4, "Extra Hot"

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="items")
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))])
    image = models.ImageField(upload_to="menu_items/", blank=True, null=True)
    dietary_tags = models.JSONField(default=list, blank=True)
    spice_level = models.IntegerField(choices=SpiceLevel.choices, default=SpiceLevel.NONE)
    calories = models.PositiveIntegerField(blank=True, null=True)
    prep_time_minutes = models.PositiveIntegerField(default=15)
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_best_seller = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category__display_order", "name"]

    def __str__(self):
        return f"{self.name} — ${self.price}"

    @property
    def average_rating(self):
        from apps.reviews.models import Review
        avg = Review.objects.filter(menu_item=self).aggregate(models.Avg("rating"))
        return round(avg["rating__avg"] or 0, 1)


class MenuItemModifier(models.Model):
    """Add-ons / customizations (e.g., extra cheese, size upgrade)."""

    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="modifiers")
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal("0.00"))
    is_available = models.BooleanField(default=True)

    def __str__(self):
        extra = f" (+${self.price})" if self.price else ""
        return f"{self.name}{extra}"
