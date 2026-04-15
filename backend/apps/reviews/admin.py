from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("user", "menu_item", "rating", "is_verified", "created_at")
    list_filter = ("rating", "is_verified")
    search_fields = ("user__email", "menu_item__name", "comment")
