import pytest
from django.test import Client


@pytest.mark.usefixtures("db")
class TestIndex:
    def test_renders_value_true_when_authenticated(self, user_client: Client) -> None:
        response = user_client.get("/")

        assert response.status_code == 200
        assert response.templates[0].name == "index/index.html"
        assert 'value="true"' in response.content.decode("UTF-8")

    def test_renders_value_empty_when_authenticated(self, client: Client) -> None:
        response = client.get("/")

        assert response.status_code == 200
        assert 'value=""' in response.content.decode("UTF-8")

    def test_path_add_renders_index(self, client: Client) -> None:
        response = client.get("/add")

        assert response.status_code == 200
        assert response.templates[0].name == "index/index.html"

    def test_path_example_renders_index(self, client: Client) -> None:
        response = client.get("/example")

        assert response.status_code == 200
        assert response.templates[0].name == "index/index.html"

    def test_path_help_renders_index(self, client: Client) -> None:
        response = client.get("/help")

        assert response.status_code == 200
        assert response.templates[0].name == "index/index.html"
