from rest_framework import serializers
from .models import Reservation, Table


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ("id", "number", "capacity", "location", "is_active")


class ReservationSerializer(serializers.ModelSerializer):
    table_info = TableSerializer(source="table", read_only=True)

    class Meta:
        model = Reservation
        fields = (
            "id", "guest_name", "guest_email", "guest_phone", "party_size",
            "date", "time", "duration_minutes", "special_requests", "status",
            "table", "table_info", "created_at",
        )
        read_only_fields = ("id", "status", "table", "created_at")

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class ReservationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ("status", "table")
