from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("line_total",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_number", "user", "order_type", "status", "total", "created_at")
    list_filter = ("status", "order_type", "created_at")
    search_fields = ("order_number", "user__email")
    readonly_fields = ("id", "order_number", "subtotal", "tax", "total", "created_at")
    inlines = [OrderItemInline]
    date_hierarchy = "created_at"
