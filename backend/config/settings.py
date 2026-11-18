"""
Configuración Django del portal turístico
de la Municipalidad de Casablanca.

Django 5.2.19
"""

import os
from pathlib import Path

from dotenv import load_dotenv


# ==================================================
# DIRECTORIO BASE Y VARIABLES DE ENTORNO
# ==================================================

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


# ==================================================
# SEGURIDAD
# ==================================================

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

DEBUG = os.getenv(
    "DJANGO_DEBUG",
    "False",
).lower() == "true"

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        "DJANGO_ALLOWED_HOSTS",
        "",
    ).split(",")
    if host.strip()
]


# ==================================================
# APLICACIONES
# ==================================================

INSTALLED_APPS = [
    # Aplicaciones Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # API REST
    "rest_framework",

    # Aplicaciones del proyecto
    "apps.accounts",
    "apps.catalog",
    "apps.mediafiles",
    "apps.audit",
    "apps.weather.apps.WeatherConfig",
]


# ==================================================
# MIDDLEWARE
# ==================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ==================================================
# CONFIGURACIÓN DE URLS
# ==================================================

ROOT_URLCONF = "config.urls"


# ==================================================
# PLANTILLAS HTML
# ==================================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",

        "DIRS": [
            BASE_DIR / "templates",
        ],

        "APP_DIRS": True,

        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ==================================================
# SERVIDORES WSGI Y ASGI
# ==================================================

WSGI_APPLICATION = "config.wsgi.application"

ASGI_APPLICATION = "config.asgi.application"


# ==================================================
# BASE DE DATOS
# ==================================================

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# ==================================================
# MODELO DE USUARIO
# ==================================================

AUTH_USER_MODEL = "accounts.User"


# ==================================================
# VALIDACIÓN DE CONTRASEÑAS
# ==================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 10,
        },
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# ==================================================
# AUTENTICACIÓN Y SESIONES
# ==================================================

LOGIN_URL = "login"

LOGIN_REDIRECT_URL = "gestion_dashboard"

LOGOUT_REDIRECT_URL = "inicio"

# Duración de sesión: 20 minutos de inactividad
SESSION_COOKIE_AGE = 1200

SESSION_SAVE_EVERY_REQUEST = True

SESSION_COOKIE_HTTPONLY = True

SESSION_COOKIE_SAMESITE = "Lax"

CSRF_COOKIE_SAMESITE = "Lax"


# ==================================================
# INTERNACIONALIZACIÓN
# ==================================================

LANGUAGE_CODE = "es-cl"

TIME_ZONE = "America/Santiago"

USE_I18N = True

USE_TZ = True


# ==================================================
# ARCHIVOS ESTÁTICOS
# ==================================================

STATIC_URL = "/static/"

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

STATIC_ROOT = BASE_DIR / "staticfiles"


# ==================================================
# ARCHIVOS MULTIMEDIA
# ==================================================

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"


# ==================================================
# DJANGO REST FRAMEWORK
# ==================================================

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],

    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],

    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
}


# ==================================================
# CORREO ELECTRÓNICO
# ==================================================

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


# ==================================================
# CONFIGURACIÓN GENERAL
# ==================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
# ==================================================
# SERVICIO METEOROLÓGICO
# ==================================================

WEATHERAPI_KEY = os.getenv("WEATHERAPI_KEY", "").strip()