from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Reservation, Table
from .serializers import ReservationSerializer, ReservationStatusSerializer, TableSerializer
from .tasks import send_reservation_confirmation


class ReservationCreateView(generics.CreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        reservation = serializer.save()
        send_reservation_confirmation.delay(reservation.id)


class ReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ("staff", "manager", "admin"):
            return Reservation.objects.all()
        return Reservation.objects.filter(user=user)


class ReservationDetailView(generics.RetrieveAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ("staff", "manager", "admin"):
            return Reservation.objects.all()
        return Reservation.objects.filter(user=user)


class ReservationStatusUpdateView(generics.UpdateAPIView):
    """Staff: confirm, seat, complete, or cancel a reservation."""
    queryset = Reservation.objects.all()
    serializer_class = ReservationStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if request.user.role not in ("staff", "manager", "admin"):
            self.permission_denied(request)


class ReservationCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            reservation = Reservation.objects.get(pk=pk, user=request.user)
        except Reservation.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        if reservation.status in ("completed", "cancelled"):
            return Response({"detail": "Cannot cancel."}, status=status.HTTP_400_BAD_REQUEST)
        reservation.status = Reservation.Status.CANCELLED
        reservation.save()
        return Response({"detail": "Reservation cancelled."})


class AvailableTablesView(APIView):
    """Check table availability for a given date, time, party size."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        date = request.query_params.get("date")
        time_str = request.query_params.get("time")
        party_size = int(request.query_params.get("party_size", 2))

        if not date or not time_str:
            return Response({"detail": "date and time required."}, status=400)

        booked_table_ids = Reservation.objects.filter(
            date=date, time=time_str,
            status__in=["pending", "confirmed", "seated"],
        ).values_list("table_id", flat=True)

        available = Table.objects.filter(
            is_active=True, capacity__gte=party_size
        ).exclude(id__in=booked_table_ids)

        serializer = TableSerializer(available, many=True)
        return Response(serializer.data)
