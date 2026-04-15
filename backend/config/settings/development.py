from .base import *  # noqa

DEBUG = True
ALLOWED_HOSTS = ["*"]

CORS_ALLOW_ALL_ORIGINS = True

# Use console email in dev
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Disable throttling in dev
REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = []  # noqa: F405

INTERNAL_IPS = ["127.0.0.1"]
