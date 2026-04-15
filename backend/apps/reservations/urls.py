from django.urls import path
from . import views

app_name = "reservations"

urlpatterns = [
    path("", views.ReservationListView.as_view(), name="list"),
    path("create/", views.ReservationCreateView.as_view(), name="create"),
    path("available-tables/", views.AvailableTablesView.as_view(), name="available-tables"),
    path("<int:pk>/", views.ReservationDetailView.as_view(), name="detail"),
    path("<int:pk>/status/", views.ReservationStatusUpdateView.as_view(), name="status-update"),
    path("<int:pk>/cancel/", views.ReservationCancelView.as_view(), name="cancel"),
]
