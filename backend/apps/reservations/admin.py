from django.contrib import admin
from .models import Table, Reservation


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ("number", "capacity", "location", "is_active")
    list_editable = ("is_active",)


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ("guest_name", "date", "time", "party_size", "status", "table")
    list_filter = ("status", "date")
    search_fields = ("guest_name", "guest_email")
    date_hierarchy = "date"
