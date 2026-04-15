from django.urls import path
from . import views

app_name = "menu"

urlpatterns = [
    path("categories/", views.CategoryListView.as_view(), name="category-list"),
    path("categories/<slug:slug>/", views.CategoryDetailView.as_view(), name="category-detail"),
    path("items/", views.MenuItemListView.as_view(), name="item-list"),
    path("items/featured/", views.FeaturedItemsView.as_view(), name="featured-items"),
    path("items/<slug:slug>/", views.MenuItemDetailView.as_view(), name="item-detail"),
]
