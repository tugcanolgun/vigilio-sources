import factory
from django.contrib.auth.models import User

from backend import models


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = "test_user"
    password = "5q4rq4%WByk"


class SchemaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Schema

    user = factory.SubFactory(UserFactory)
    name = "BEST API"
    api_url = "https://some-url/list_movies.json?query_term=${searchInput}"
    schema = """{'version': 1, 'apiUrl': 'https://some-url/list_movies.json?query_term=${searchInput}',
                 'parsers': [{'key': 'title', 'value': 'data.movies.0.title'},
                 {'key': 'imdbId', 'value': 'data.movies.0.imdb_code'},
                 {'key': 'source', 'value': 'data.movies.0.torrents|sources.0.url'},
                 {'key': 'image', 'value': 'data.movies.0.small_cover_image'},
                 {'key': 'quality', 'value': 'data.movies.0.torrents|sources.0.quality'}]}"""
    version = 1
    is_active = True
    is_legal = False
