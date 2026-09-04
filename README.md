# 🍽️ Savoria — Full-Stack Restaurant Application

A production-grade, full-stack restaurant web application built with **Next.js 14**, **Django REST Framework**, **PostgreSQL**, **Celery**, and **Redis**.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    NGINX (Reverse Proxy)             │
│                  SSL Termination + Static            │
├──────────────────────┬──────────────────────────────┤
│   Next.js Frontend   │   Django REST Backend        │
│   (Port 3000)        │   (Port 8000)                │
│                      │                              │
│  • App Router (SSR)  │  • REST API                  │
│  • React 18          │  • JWT Authentication         │
│  • TailwindCSS       │  • Celery Task Queue         │
│  • Context API       │  • WebSocket (Channels)      │
├──────────────────────┼──────────────────────────────┤
│                      │                              │
│       Redis          │     PostgreSQL               │
│  (Cache + Broker)    │  (Primary Database)          │
│   (Port 6379)        │   (Port 5432)                │
└──────────────────────┴──────────────────────────────┘
```

## ✨ Features

### Customer-Facing
- 🍔 **Dynamic Menu** — Browse categories, search, filter by dietary preferences
- 🛒 **Shopping Cart** — Add items, customize, adjust quantities
- 📦 **Online Ordering** — Place orders for delivery or pickup
- 📅 **Table Reservations** — Book tables with date/time/party size
- 👤 **User Accounts** — Register, login, order history, saved addresses
- ⭐ **Reviews & Ratings** — Rate dishes and leave reviews
- 📱 **Real-time Order Tracking** — Live status updates via WebSocket
- 💳 **Checkout** — Stripe payment integration ready

### Admin Dashboard
- 📊 **Analytics** — Revenue, orders, popular items charts
- 🍽️ **Menu Management** — CRUD for categories, items, modifiers
- 📋 **Order Management** — View, update status, real-time notifications
- 📅 **Reservation Management** — Approve/reject bookings, table management
- 👥 **Staff Management** — Role-based access control

### Technical
- 🔐 **JWT Authentication** with refresh tokens
- 📧 **Email Notifications** via Celery async tasks
- 🗄️ **Redis Caching** for menu and session data
- 🐳 **Docker Compose** for one-command deployment
- 🧪 **Test Suite** — Unit + Integration tests
- 📝 **API Documentation** — Auto-generated OpenAPI/Swagger
- 🚀 **CI/CD Ready** — GitHub Actions workflow included

---

## 🚀 Quick Start (Development)

### Prerequisites
- **Node.js** >= 18.x
- **Python** >= 3.11
- **PostgreSQL** >= 15
- **Redis** >= 7
- **Docker & Docker Compose** (recommended)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-org/savoria.git
cd savoria

# Copy environment files
cp .env.example .env

# Build and start all services
docker compose up --build

# Run migrations
docker compose exec backend python manage.py migrate

# Create superuser
docker compose exec backend python manage.py createsuperuser

# Seed sample data
docker compose exec backend python manage.py seed_data
```

Frontend: http://localhost:3000
Backend API: http://localhost:8000/api/
Admin: http://localhost:8000/admin/
API Docs: http://localhost:8000/api/docs/

### Option 2: Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp ../.env.example ../.env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed data
python manage.py seed_data

# Start Django server
python manage.py runserver 0.0.0.0:8000
```

#### Celery Worker (new terminal)

```bash
cd backend
source venv/bin/activate
celery -A config worker --loglevel=info
```

#### Celery Beat (new terminal)

```bash
cd backend
source venv/bin/activate
celery -A config beat --loglevel=info
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📁 Project Structure

```
savoria/
├── frontend/                  # Next.js 14 Application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── menu/        # Menu browsing
│   │   │   ├── cart/        # Shopping cart
│   │   │   ├── checkout/    # Checkout flow
│   │   │   ├── reservations/# Table booking
│   │   │   ├── orders/      # Order history & tracking
│   │   │   ├── admin/       # Admin dashboard
│   │   │   └── api/         # API route handlers
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/          # Base UI components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── menu/        # Menu components
│   │   │   ├── cart/        # Cart components
│   │   │   └── admin/       # Admin components
│   │   ├── lib/             # Utilities & API client
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React Context providers
│   │   ├── styles/          # Global styles
│   │   └── types/           # TypeScript types
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                   # Django Application
│   ├── config/               # Django project settings
│   │   ├── settings/
│   │   │   ├── base.py      # Shared settings
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── celery.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── accounts/        # User auth & profiles
│   │   ├── menu/            # Menu items & categories
│   │   ├── orders/          # Order processing
│   │   ├── reservations/    # Table reservations
│   │   ├── reviews/         # Ratings & reviews
│   │   └── analytics/       # Dashboard analytics
│   ├── requirements.txt
│   └── manage.py
│
├── docker/                    # Docker configurations
├── nginx/                     # Nginx config
├── scripts/                   # Utility scripts
├── docker-compose.yml         # Development compose
├── docker-compose.prod.yml    # Production compose
├── .env.example              # Environment template
├── .github/                  # CI/CD workflows
└── README.md
```

---

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://savoria:savoria@localhost:5432/savoria` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379/0` |
| `SECRET_KEY` | Django secret key | (generate one) |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000/api` |
| `STRIPE_SECRET_KEY` | Stripe API key | (your key) |
| `EMAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `ALLOWED_HOSTS` | Django allowed hosts | `localhost,127.0.0.1` |

---

## 🚢 Production Deployment

### Using Docker Compose (Production)

```bash
# Build production images
docker compose -f docker-compose.prod.yml build

# Start services
docker compose -f docker-compose.prod.yml up -d

# Run migrations
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Collect static files
docker compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --no-input

# Create superuser
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

### Manual Production Setup

1. **Server**: Ubuntu 22.04+ recommended
2. **Web Server**: Nginx as reverse proxy
3. **Process Manager**: Gunicorn for Django, PM2 for Next.js
4. **SSL**: Let's Encrypt via Certbot
5. **Database**: Managed PostgreSQL (AWS RDS, DigitalOcean, etc.)
6. **Cache**: Managed Redis (AWS ElastiCache, etc.)

```bash
# Install system dependencies
sudo apt update && sudo apt install -y nginx postgresql redis-server python3-pip nodejs npm

# Configure Nginx (see nginx/savoria.conf)
sudo cp nginx/savoria.conf /etc/nginx/sites-available/savoria
sudo ln -s /etc/nginx/sites-available/savoria /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Setup SSL
sudo certbot --nginx -d yourdomain.com

# Backend with Gunicorn
pip install gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4

# Frontend with PM2
npm install -g pm2
cd frontend && npm run build
pm2 start npm --name "savoria-frontend" -- start

# Celery with systemd (see scripts/celery.service)
sudo cp scripts/celery.service /etc/systemd/system/
sudo systemctl enable celery && sudo systemctl start celery
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm run test

# E2E tests
npm run test:e2e
```

---

## 📄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | User registration |
| POST | `/api/auth/login/` | JWT login |
| POST | `/api/auth/refresh/` | Refresh token |
| GET | `/api/menu/categories/` | List categories |
| GET | `/api/menu/items/` | List menu items |
| GET | `/api/menu/items/:id/` | Item detail |
| POST | `/api/orders/` | Create order |
| GET | `/api/orders/` | User's orders |
| GET | `/api/orders/:id/` | Order detail |
| POST | `/api/reservations/` | Create reservation |
| GET | `/api/reservations/` | User's reservations |
| POST | `/api/reviews/` | Submit review |
| GET | `/api/analytics/dashboard/` | Admin analytics |

Full API docs at `/api/docs/` (Swagger UI).

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.
