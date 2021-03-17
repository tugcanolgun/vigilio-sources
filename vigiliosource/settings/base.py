import os
from pathlib import Path, PosixPath
from typing import List, Dict, Any

import dotenv

BASE_DIR: PosixPath = Path(__file__).resolve().parent.parent.parent

ENV_FILE_NAME: str = os.environ.get("ENV_FILE", ".env")

assert (BASE_DIR / ENV_FILE_NAME).is_file() is True
DOTENV: str = str(BASE_DIR / ENV_FILE_NAME)
dotenv.load_dotenv(DOTENV)

if os.environ["SECRET_KEY"] in {"", None}:
    import random

    secret = "".join(
        [
            random.SystemRandom().choice(
                "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)"
            )
            for i in range(50)
        ]
    )
    dotenv.set_key(DOTENV, "SECRET_KEY", secret)
    os.environ["SECRET_KEY"] = secret

SECRET_KEY: str = os.environ["SECRET_KEY"]
DEBUG: bool = False

ALLOWED_HOSTS: List[str] = os.environ.get("ALLOWED_HOSTS", "").split(",")

INSTALLED_APPS: List[str] = [
    "backend",
    "rest_framework",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

MIDDLEWARE: List[str] = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF: str = "vigiliosource.urls"

TEMPLATES: List[Dict[str, Any]] = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "frontend/templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION: str = "vigiliosource.wsgi.application"

DATABASES: Dict[str, Any] = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

AUTH_PASSWORD_VALIDATORS: List[Dict[str, str]] = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE: str = "en-us"

TIME_ZONE: str = "UTC"

USE_I18N: bool = True

USE_L10N: bool = True

USE_TZ: bool = True

STATIC_URL: str = "/static/"
STATIC_ROOT: str = str(BASE_DIR / "statics")

STATICFILES_DIRS: List[str] = [
    os.path.join(BASE_DIR, "frontend/dist"),
    os.path.join(BASE_DIR, "frontend/statics"),
]
LOGIN_REDIRECT_URL: str = "/"

REST_FRAMEWORK: Dict[str, str] = {
    "DEFAULT_PAGINATION_CLASS": "api.paginations.StandardResultsSetPagination",
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {"anon": "50/day", "user": "100/day"},
}
REDIS_URL: str = os.environ.get("REDIS_URL", None)
