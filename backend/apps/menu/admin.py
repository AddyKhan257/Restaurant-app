from django.contrib import admin
from .models import Category, MenuItem, MenuItemModifier


class ModifierInline(admin.TabularInline):
    model = MenuItemModifier
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "display_order", "is_active", "item_count")
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("display_order", "is_active")


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "is_available", "is_featured", "is_best_seller")
    list_filter = ("category", "is_available", "is_featured", "spice_level")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("price", "is_available", "is_featured", "is_best_seller")
    inlines = [ModifierInline]
