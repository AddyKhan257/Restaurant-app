from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Category, MenuItem
from .serializers import (
    CategorySerializer, CategoryDetailSerializer,
    MenuItemListSerializer, MenuItemDetailSerializer,
)


class CategoryListView(generics.ListAPIView):
    """List all active menu categories."""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    @method_decorator(cache_page(60 * 15))
    def get(self, *args, **kwargs):
        return super().get(*args, **kwargs)


class CategoryDetailView(generics.RetrieveAPIView):
    """Retrieve a category with its menu items."""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategoryDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"


class MenuItemListView(generics.ListAPIView):
    """List menu items with filtering, search, and ordering."""
    serializer_class = MenuItemListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "is_featured", "is_best_seller", "spice_level", "is_available"]
    search_fields = ["name", "description"]
    ordering_fields = ["price", "name", "created_at"]

    def get_queryset(self):
        qs = MenuItem.objects.filter(is_available=True).select_related("category")
        dietary = self.request.query_params.get("dietary")
        if dietary:
            qs = qs.filter(dietary_tags__contains=[dietary])
        return qs


class MenuItemDetailView(generics.RetrieveAPIView):
    """Retrieve a single menu item with modifiers."""
    queryset = MenuItem.objects.filter(is_available=True).select_related("category").prefetch_related("modifiers")
    serializer_class = MenuItemDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"


class FeaturedItemsView(generics.ListAPIView):
    """List featured / best-seller menu items."""
    serializer_class = MenuItemListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return MenuItem.objects.filter(is_available=True, is_featured=True).select_related("category")[:12]
