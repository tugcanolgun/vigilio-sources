from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView

from backend.forms import UserRegistrationForm


def index(request: WSGIRequest) -> HttpResponse:
    return render(request, "index/index.html")


class SignUpView(CreateView):
    form_class = UserRegistrationForm
    success_url = reverse_lazy("backend:login")
    template_name = "registration/register.html"
