from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)
    menu_item_name = serializers.CharField(source="menu_item.name", read_only=True)

    class Meta:
        model = Review
        fields = ("id", "user", "user_name", "menu_item", "menu_item_name", "rating", "title", "comment", "is_verified", "created_at")
        read_only_fields = ("id", "user", "is_verified", "created_at")

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        # Check if user has ordered this item
        from apps.orders.models import OrderItem
        has_ordered = OrderItem.objects.filter(
            order__user=validated_data["user"],
            menu_item=validated_data["menu_item"],
        ).exists()
        validated_data["is_verified"] = has_ordered
        return super().create(validated_data)
