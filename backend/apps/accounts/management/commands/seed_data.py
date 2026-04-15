"""
Seed the database with sample restaurant data.
Usage: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from apps.menu.models import Category, MenuItem, MenuItemModifier
from apps.reservations.models import Table


class Command(BaseCommand):
    help = "Seed the database with sample Savoria restaurant data"

    def handle(self, *args, **options):
        self.stdout.write("Seeding categories...")
        categories_data = [
            {"name": "Appetizers", "slug": "appetizers", "description": "Start your meal with our handcrafted starters", "display_order": 1},
            {"name": "Salads", "slug": "salads", "description": "Fresh, vibrant salads made with seasonal ingredients", "display_order": 2},
            {"name": "Main Course", "slug": "main-course", "description": "Signature entrees crafted by our head chef", "display_order": 3},
            {"name": "Pasta & Risotto", "slug": "pasta-risotto", "description": "Handmade pasta and creamy risottos", "display_order": 4},
            {"name": "Seafood", "slug": "seafood", "description": "Fresh catches from the ocean", "display_order": 5},
            {"name": "Desserts", "slug": "desserts", "description": "Sweet endings to a perfect meal", "display_order": 6},
            {"name": "Beverages", "slug": "beverages", "description": "Handcrafted cocktails, wines, and non-alcoholic refreshments", "display_order": 7},
        ]
        cats = {}
        for data in categories_data:
            cat, _ = Category.objects.get_or_create(slug=data["slug"], defaults=data)
            cats[data["slug"]] = cat

        self.stdout.write("Seeding menu items...")
        items_data = [
            # Appetizers
            {"category": "appetizers", "name": "Truffle Burrata", "slug": "truffle-burrata", "description": "Creamy burrata with black truffle, heirloom tomatoes, and basil oil on grilled sourdough.", "price": 18.50, "dietary_tags": ["vegetarian"], "spice_level": 0, "calories": 320, "prep_time_minutes": 10, "is_featured": True},
            {"category": "appetizers", "name": "Tuna Tartare", "slug": "tuna-tartare", "description": "Yellowfin tuna with avocado mousse, sesame crisps, and ponzu dressing.", "price": 21.00, "dietary_tags": ["gluten_free"], "spice_level": 1, "calories": 280, "prep_time_minutes": 12},
            {"category": "appetizers", "name": "Crispy Calamari", "slug": "crispy-calamari", "description": "Lightly battered calamari with marinara and lemon aioli.", "price": 16.00, "dietary_tags": [], "spice_level": 0, "calories": 420, "prep_time_minutes": 8},
            {"category": "appetizers", "name": "Wagyu Beef Sliders", "slug": "wagyu-sliders", "description": "Three mini Wagyu patties with aged cheddar, caramelized onion, and truffle mayo.", "price": 24.00, "dietary_tags": [], "spice_level": 0, "calories": 580, "prep_time_minutes": 15, "is_best_seller": True},
            # Salads
            {"category": "salads", "name": "Caesar Royale", "slug": "caesar-royale", "description": "Romaine hearts, white anchovies, Parmesan tuile, and house-made Caesar dressing.", "price": 15.00, "dietary_tags": ["gluten_free"], "spice_level": 0, "calories": 350, "prep_time_minutes": 8},
            {"category": "salads", "name": "Mediterranean Quinoa Bowl", "slug": "mediterranean-quinoa", "description": "Tricolor quinoa with roasted vegetables, feta, olives, and lemon-herb vinaigrette.", "price": 17.00, "dietary_tags": ["vegetarian", "gluten_free"], "spice_level": 0, "calories": 420, "prep_time_minutes": 10},
            # Main Course
            {"category": "main-course", "name": "Filet Mignon", "slug": "filet-mignon", "description": "8oz center-cut filet with truffle mashed potatoes, asparagus, and red wine reduction.", "price": 52.00, "dietary_tags": ["gluten_free"], "spice_level": 0, "calories": 680, "prep_time_minutes": 25, "is_featured": True, "is_best_seller": True},
            {"category": "main-course", "name": "Herb-Crusted Rack of Lamb", "slug": "rack-of-lamb", "description": "New Zealand lamb with rosemary jus, roasted root vegetables, and mint gremolata.", "price": 48.00, "dietary_tags": ["gluten_free"], "spice_level": 0, "calories": 720, "prep_time_minutes": 30},
            {"category": "main-course", "name": "Pan-Seared Duck Breast", "slug": "duck-breast", "description": "Crispy duck with cherry compote, sweet potato purée, and wilted greens.", "price": 42.00, "dietary_tags": ["gluten_free"], "spice_level": 0, "calories": 620, "prep_time_minutes": 22},
            {"category": "main-course", "name": "Grilled Chicken Supreme", "slug": "chicken-supreme", "description": "Free-range chicken with lemon-thyme jus, roasted potatoes, and seasonal vegetables.", "price": 32.00, "dietary_tags": ["gluten_free"], "spice_level": 0, "calories": 520, "prep_time_minutes": 20},
            # Pasta & Risotto
            {"category": "pasta-risotto", "name": "Black Truffle Risotto", "slug": "truffle-risotto", "description": "Arborio rice with black truffle, Parmigiano-Reggiano, and brown butter.", "price": 34.00, "dietary_tags": ["vegetarian", "gluten_free"], "spice_level": 0, "calories": 580, "prep_time_minutes": 20, "is_featured": True},
            {"category": "pasta-risotto", "name": "Lobster Linguine", "slug": "lobster-linguine", "description": "Fresh linguine with lobster tail, cherry tomatoes, garlic, and white wine sauce.", "price": 38.00, "dietary_tags": [], "spice_level": 1, "calories": 650, "prep_time_minutes": 18, "is_best_seller": True},
            {"category": "pasta-risotto", "name": "Wild Mushroom Pappardelle", "slug": "mushroom-pappardelle", "description": "Hand-cut pappardelle with porcini, chanterelles, thyme cream, and shaved Parmesan.", "price": 28.00, "dietary_tags": ["vegetarian"], "spice_level": 0, "calories": 560, "prep_time_minutes": 15},
            # Seafood
            {"category": "seafood", "name": "Chilean Sea Bass", "slug": "chilean-sea-bass", "description": "Miso-glazed sea bass with bok choy, jasmine rice, and ginger-scallion oil.", "price": 46.00, "dietary_tags": ["gluten_free"], "spice_level": 1, "calories": 480, "prep_time_minutes": 20, "is_featured": True},
            {"category": "seafood", "name": "Grilled Salmon", "slug": "grilled-salmon", "description": "Atlantic salmon with dill cream sauce, asparagus, and fingerling potatoes.", "price": 36.00, "dietary_tags": ["gluten_free"], "spice_level": 0, "calories": 520, "prep_time_minutes": 18},
            # Desserts
            {"category": "desserts", "name": "Chocolate Lava Cake", "slug": "chocolate-lava-cake", "description": "Warm Valrhona chocolate cake with vanilla bean ice cream and raspberry coulis.", "price": 16.00, "dietary_tags": ["vegetarian"], "spice_level": 0, "calories": 480, "prep_time_minutes": 15, "is_best_seller": True},
            {"category": "desserts", "name": "Crème Brûlée", "slug": "creme-brulee", "description": "Classic vanilla custard with caramelized sugar crust and fresh berries.", "price": 14.00, "dietary_tags": ["vegetarian", "gluten_free"], "spice_level": 0, "calories": 380, "prep_time_minutes": 10},
            {"category": "desserts", "name": "Tiramisu", "slug": "tiramisu", "description": "Espresso-soaked ladyfingers layered with mascarpone cream and cocoa.", "price": 15.00, "dietary_tags": ["vegetarian"], "spice_level": 0, "calories": 420, "prep_time_minutes": 5},
            # Beverages
            {"category": "beverages", "name": "Signature Old Fashioned", "slug": "old-fashioned", "description": "Woodford Reserve bourbon, Demerara sugar, Angostura bitters, orange peel.", "price": 18.00, "dietary_tags": ["vegan", "gluten_free"], "spice_level": 0, "calories": 180, "prep_time_minutes": 5},
            {"category": "beverages", "name": "Fresh Watermelon Juice", "slug": "watermelon-juice", "description": "Cold-pressed watermelon with mint and lime.", "price": 8.00, "dietary_tags": ["vegan", "gluten_free"], "spice_level": 0, "calories": 120, "prep_time_minutes": 3},
        ]
        for data in items_data:
            cat_slug = data.pop("category")
            data["category"] = cats[cat_slug]
            item, created = MenuItem.objects.get_or_create(slug=data["slug"], defaults=data)
            if created and item.name == "Filet Mignon":
                MenuItemModifier.objects.create(menu_item=item, name="Add Foie Gras", price=15.00)
                MenuItemModifier.objects.create(menu_item=item, name="Extra Truffle Butter", price=8.00)
            if created and item.name == "Grilled Salmon":
                MenuItemModifier.objects.create(menu_item=item, name="Add Lobster Tail", price=22.00)

        self.stdout.write("Seeding tables...")
        tables_data = [
            {"number": 1, "capacity": 2, "location": "window"},
            {"number": 2, "capacity": 2, "location": "window"},
            {"number": 3, "capacity": 4, "location": "main"},
            {"number": 4, "capacity": 4, "location": "main"},
            {"number": 5, "capacity": 6, "location": "main"},
            {"number": 6, "capacity": 6, "location": "patio"},
            {"number": 7, "capacity": 8, "location": "private"},
            {"number": 8, "capacity": 10, "location": "private"},
            {"number": 9, "capacity": 4, "location": "patio"},
            {"number": 10, "capacity": 2, "location": "bar"},
        ]
        for data in tables_data:
            Table.objects.get_or_create(number=data["number"], defaults=data)

        self.stdout.write(self.style.SUCCESS(
            f"✓ Seeded {Category.objects.count()} categories, "
            f"{MenuItem.objects.count()} menu items, "
            f"{Table.objects.count()} tables"
        ))
