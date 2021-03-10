from django.contrib.auth import views as auth_views
from django.urls import path

from . import views

app_name: str = "backend"

urlpatterns = [
    path("", views.index, name="index"),
    path("example", views.index, name="index"),
    path("add", views.index, name="index"),
    path("help", views.index, name="index"),
    path("accounts/register/", views.SignUpView.as_view(), name="register"),
    path("accounts/login/", auth_views.LoginView.as_view(), name="login"),
    path("accounts/logout/", auth_views.LogoutView.as_view(), name="logout"),
]
