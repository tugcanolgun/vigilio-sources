from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

app_name: str = "api"

urlpatterns = [
    path("score/", views.ScoreEndpoint.as_view()),
    path("schemas/", views.SchemaList.as_view()),
    # path("schemas/<int:pk>/", views.SchemaDetailEndpoint.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
