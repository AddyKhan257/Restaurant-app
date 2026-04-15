from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.menu.models import Category, MenuItem

User = get_user_model()


class AuthTests(TestCase):
    """Test user registration and authentication."""

    def setUp(self):
        self.client = APIClient()
        self.register_url = "/api/auth/register/"
        self.login_url = "/api/auth/login/"
        self.user_data = {
            "email": "test@savoria.com",
            "username": "testuser",
            "first_name": "Test",
            "last_name": "User",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }

    def test_register_user(self):
        res = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="test@savoria.com").exists())

    def test_login_user(self):
        User.objects.create_user(
            email="test@savoria.com", username="testuser", password="StrongPass123!"
        )
        res = self.client.post(
            self.login_url,
            {"email": "test@savoria.com", "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)

    def test_login_invalid(self):
        res = self.client.post(
            self.login_url,
            {"email": "bad@email.com", "password": "wrong"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class MenuTests(TestCase):
    """Test menu API endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name="Appetizers", slug="appetizers", description="Starters"
        )
        self.item = MenuItem.objects.create(
            category=self.category,
            name="Test Dish",
            slug="test-dish",
            description="A test dish",
            price=15.00,
        )

    def test_list_categories(self):
        res = self.client.get("/api/menu/categories/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["name"], "Appetizers")

    def test_list_items(self):
        res = self.client.get("/api/menu/items/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_item_detail(self):
        res = self.client.get(f"/api/menu/items/{self.item.slug}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["name"], "Test Dish")

    def test_search_items(self):
        res = self.client.get("/api/menu/items/?search=Test")
        self.assertEqual(res.status_code, status.HTTP_200_OK)


class OrderTests(TestCase):
    """Test order creation and listing."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="order@test.com", username="orderuser", password="Pass123!"
        )
        self.client.force_authenticate(user=self.user)
        cat = Category.objects.create(name="Main", slug="main")
        self.item = MenuItem.objects.create(
            category=cat, name="Steak", slug="steak",
            description="Grilled steak", price=45.00,
        )

    def test_create_order(self):
        res = self.client.post(
            "/api/orders/create/",
            {
                "order_type": "delivery",
                "delivery_address": "123 Test St",
                "tip": 5,
                "payment_method": "card",
                "items": [
                    {
                        "menu_item": self.item.id,
                        "name": "Steak",
                        "price": "45.00",
                        "quantity": 2,
                        "modifiers": [],
                        "special_instructions": "",
                    }
                ],
            },
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_list_orders(self):
        res = self.client.get("/api/orders/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_unauthenticated_order(self):
        self.client.force_authenticate(user=None)
        res = self.client.post("/api/orders/create/", {}, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class ReservationTests(TestCase):
    """Test reservation endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="res@test.com", username="resuser", password="Pass123!"
        )
        self.client.force_authenticate(user=self.user)

    def test_create_reservation(self):
        res = self.client.post(
            "/api/reservations/create/",
            {
                "guest_name": "John Doe",
                "guest_email": "john@test.com",
                "party_size": 4,
                "date": "2025-12-25",
                "time": "19:00",
            },
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_list_reservations(self):
        res = self.client.get("/api/reservations/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
