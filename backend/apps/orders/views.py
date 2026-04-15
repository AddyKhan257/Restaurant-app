from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order
from .serializers import (
    OrderCreateSerializer, OrderListSerializer,
    OrderDetailSerializer, OrderStatusUpdateSerializer,
)
from .tasks import send_order_confirmation_email


class IsOwnerOrStaff(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.role in ("staff", "manager", "admin")


class OrderCreateView(generics.CreateAPIView):
    """Place a new order."""
    serializer_class = OrderCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        order = serializer.save()
        send_order_confirmation_email.delay(str(order.id))


class OrderListView(generics.ListAPIView):
    """List orders for the current user (or all for staff)."""
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ("staff", "manager", "admin"):
            return Order.objects.all()
        return Order.objects.filter(user=user)


class OrderDetailView(generics.RetrieveAPIView):
    """Retrieve order details."""
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        user = self.request.user
        if user.role in ("staff", "manager", "admin"):
            return Order.objects.all()
        return Order.objects.filter(user=user)


class OrderStatusUpdateView(generics.UpdateAPIView):
    """Update order status (staff only)."""
    serializer_class = OrderStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Order.objects.all()

    def check_permissions(self, request):
        super().check_permissions(request)
        if request.user.role not in ("staff", "manager", "admin"):
            self.permission_denied(request, message="Staff only.")


class OrderCancelView(APIView):
    """Cancel a pending order."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        if order.status not in ("pending", "confirmed"):
            return Response({"detail": "Cannot cancel this order."}, status=status.HTTP_400_BAD_REQUEST)
        order.status = Order.Status.CANCELLED
        order.save()
        return Response({"detail": "Order cancelled."})
