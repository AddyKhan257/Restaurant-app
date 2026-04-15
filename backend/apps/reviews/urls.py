from django.urls import path
from . import views

app_name = "reviews"

urlpatterns = [
    path("", views.ReviewListCreateView.as_view(), name="list-create"),
    path("<int:pk>/", views.ReviewDetailView.as_view(), name="detail"),
]
