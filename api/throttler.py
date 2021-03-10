import time
from typing import Optional, Any, Dict, Union

import redis
from django.conf import settings
from redis import Redis
from rest_framework.exceptions import PermissionDenied
from rest_framework.request import Request

THROTTLE: Dict[str, Any] = {}


def get_client_ip(request: Request) -> str:
    x_forwarded_for: str = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")

    return ip


def get_redis_url() -> Optional[str]:
    if not hasattr(settings, "REDIS_URL"):
        return None

    return settings.REDIS_URL


def get_redis() -> Optional[Redis]:
    redis_url: Optional[str] = get_redis_url()
    if not redis_url:
        return None

    try:
        r: Redis = redis.from_url(redis_url)
        r.ping()
    except redis.exceptions.ConnectionError:
        return None

    return r


def _r_save_create(key: Union[int, str]) -> bool:
    r: Optional[Redis] = get_redis()
    if not r:
        return False

    r.set(key, int(time.time()))

    return True


def _r_check_create(key: Union[int, str], expiration: int = 1800) -> bool:
    r: Optional[Redis] = get_redis()
    if not r:
        return False

    _time: Optional[int] = r.get(key)
    if not _time:
        return True

    if (int(time.time()) - int(_time)) < expiration:
        raise PermissionDenied(
            f"You can only do this in every {expiration // 60} mins."
        )

    return True


def _l_save_create(key: Union[int, str]) -> None:
    global THROTTLE
    THROTTLE[key] = int(time.time())


def _l_check_create(key: Union[int, str], expiration: int = 1800) -> int:
    _time: Optional[int] = THROTTLE.get(key)
    if not _time:
        return -1

    if (int(time.time()) - _time) < expiration:
        raise PermissionDenied(
            f"You can only do this in every {expiration // 60} mins."
        )


def check_create(key: Union[int, str], expiration: int = 1800) -> None:
    if not _r_check_create(key=key, expiration=expiration):
        _l_check_create(key=key, expiration=expiration)


def save_create(key: Union[int, str]) -> None:
    if not _r_save_create(key=key):
        _l_save_create(key=key)
