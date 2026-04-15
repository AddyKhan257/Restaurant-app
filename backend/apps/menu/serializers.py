from rest_framework import serializers
from .models import Category, MenuItem, MenuItemModifier


class ModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItemModifier
        fields = ("id", "name", "price", "is_available")


class MenuItemListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    average_rating = serializers.ReadOnlyField()

    class Meta:
        model = MenuItem
        fields = (
            "id", "name", "slug", "description", "price", "image",
            "category", "category_name", "dietary_tags", "spice_level",
            "calories", "prep_time_minutes", "is_available", "is_featured",
            "is_best_seller", "average_rating",
        )


class MenuItemDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    modifiers = ModifierSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()

    class Meta:
        model = MenuItem
        fields = (
            "id", "name", "slug", "description", "price", "image",
            "category", "category_name", "dietary_tags", "spice_level",
            "calories", "prep_time_minutes", "is_available", "is_featured",
            "is_best_seller", "average_rating", "modifiers", "created_at",
        )


class CategorySerializer(serializers.ModelSerializer):
    item_count = serializers.ReadOnlyField()

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "description", "image", "display_order", "is_active", "item_count")


class CategoryDetailSerializer(CategorySerializer):
    items = MenuItemListSerializer(many=True, read_only=True)

    class Meta(CategorySerializer.Meta):
        fields = CategorySerializer.Meta.fields + ("items",)
