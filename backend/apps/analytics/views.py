from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.utils import timezone
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncDate
from datetime import timedelta

from apps.orders.models import Order, OrderItem
from apps.reservations.models import Reservation
from apps.reviews.models import Review
from apps.menu.models import MenuItem


class IsStaffOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ("staff", "manager", "admin")


class DashboardView(APIView):
    """Admin dashboard analytics."""
    permission_classes = [IsStaffOrAdmin]

    def get(self, request):
        today = timezone.now().date()
        last_30 = today - timedelta(days=30)
        last_7 = today - timedelta(days=7)

        # Revenue
        total_revenue = Order.objects.filter(
            status__in=["delivered", "picked_up", "completed"],
        ).aggregate(total=Sum("total"))["total"] or 0

        revenue_30d = Order.objects.filter(
            status__in=["delivered", "picked_up", "completed"],
            created_at__date__gte=last_30,
        ).aggregate(total=Sum("total"))["total"] or 0

        # Orders
        orders_today = Order.objects.filter(created_at__date=today).count()
        orders_7d = Order.objects.filter(created_at__date__gte=last_7).count()

        # Reservations
        reservations_today = Reservation.objects.filter(date=today).count()
        upcoming_reservations = Reservation.objects.filter(
            date__gte=today, status__in=["pending", "confirmed"]
        ).count()

        # Popular items
        popular_items = (
            OrderItem.objects.filter(order__created_at__date__gte=last_30)
            .values("name")
            .annotate(total_ordered=Sum("quantity"))
            .order_by("-total_ordered")[:10]
        )

        # Revenue by day (last 30 days)
        daily_revenue = (
            Order.objects.filter(
                status__in=["delivered", "picked_up", "completed"],
                created_at__date__gte=last_30,
            )
            .annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(revenue=Sum("total"), count=Count("id"))
            .order_by("date")
        )

        # Average rating
        avg_rating = Review.objects.aggregate(avg=Avg("rating"))["avg"] or 0

        return Response({
            "revenue": {
                "total": float(total_revenue),
                "last_30_days": float(revenue_30d),
            },
            "orders": {
                "today": orders_today,
                "last_7_days": orders_7d,
                "pending": Order.objects.filter(status="pending").count(),
            },
            "reservations": {
                "today": reservations_today,
                "upcoming": upcoming_reservations,
            },
            "popular_items": list(popular_items),
            "daily_revenue": [
                {"date": str(d["date"]), "revenue": float(d["revenue"]), "orders": d["count"]}
                for d in daily_revenue
            ],
            "average_rating": round(float(avg_rating), 1),
        })
