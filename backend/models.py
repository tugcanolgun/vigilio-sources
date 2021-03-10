from django.contrib.auth.models import User
from django.db import models


class Schema(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    name = models.CharField(max_length=80, unique=True)
    api_url = models.CharField(max_length=255)
    schema = models.TextField()
    version = models.IntegerField(default=0)
    is_active = models.BooleanField(default=False)
    is_legal = models.BooleanField(default=True)
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
