from django.urls import path
from . import views

app_name = "orders"

urlpatterns = [
    path("", views.OrderListView.as_view(), name="order-list"),
    path("create/", views.OrderCreateView.as_view(), name="order-create"),
    path("<uuid:pk>/", views.OrderDetailView.as_view(), name="order-detail"),
    path("<uuid:pk>/status/", views.OrderStatusUpdateView.as_view(), name="order-status"),
    path("<uuid:pk>/cancel/", views.OrderCancelView.as_view(), name="order-cancel"),
]
