from typing import Dict, Any

import pytest
from django.contrib.auth.models import User
from django.test import Client
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN, HTTP_200_OK, HTTP_400_BAD_REQUEST

from api.tests.factories import SchemaFactory, UserFactory
from backend.models import Schema


@pytest.fixture
def user2() -> Schema:
    return UserFactory(username="second_user", password="somep@ssw0rd")


@pytest.fixture
def schema() -> Schema:
    return SchemaFactory()


@pytest.fixture
def schema2(user2: User) -> Schema:
    return SchemaFactory(
        user=user2,
        name="ANOTHER GOOD API",
        api_url="https://some-other-url/api?title=${searchInput}",
        schema="""{'version': 1, 'apiUrl': 'https://some-other-url/api?title=${searchInput}',
                 'parsers': [{'key': 'title', 'value': '0.title'},
                 {'key': 'imdbId', 'value': '0.imdb_code'},
                 {'key': 'source', 'value': '0.trailers|sources.0.url'},
                 {'key': 'image', 'value': '0.small_cover_image'},
                 {'key': 'quality', 'value': '0.trailers|sources.0.quality'}]}""",
        version=1,
        is_active=True,
        is_legal=False,
        score=10,
    )


@pytest.fixture
def post_data() -> Dict[str, Any]:
    return {
        "version": 1,
        "name": "New API",
        "api_url": "https://some-url?s=${searchInput}",
        "is_active": True,
        "is_legal": True,
        "schema": """{"version": 1, "apiUrl": "https://some-url?s=${searchInput}",
                   "parsers": [{"key": "title", "value": "0.title"},
                               {"key": "imdbId", "value": "0.imdb_code"},
                               {"key": "source", "value": "0.sources.0.url"},
                               {"key": "image", "value": "0.small_cover_image"},
                               {"key": "quality", "value": "0.sources.0.quality"}]}""",
    }


@pytest.mark.usefixtures("db")
class TestSchemaList:
    def test_returns_list_of_schema_objects(
        self, client: Client, schema: Schema, schema2: Schema
    ) -> None:
        response: Response = client.get("/api/schemas/")

        assert response.status_code == HTTP_200_OK

        _json: Dict[str, Any] = response.json()

        assert _json is not None
        assert _json.get("count") == 2
        assert _json.get("next", "") is None
        assert _json.get("previous", "") is None
        assert isinstance(_json.get("results"), list)
        assert len(_json.get("results")) == 2
        assert _json.get("results")[0]["version"] == schema2.version
        assert _json.get("results")[0]["name"] == schema2.name
        assert _json.get("results")[0]["api_url"] == schema2.api_url
        assert _json.get("results")[0]["schema"] == schema2.schema
        assert _json.get("results")[0]["is_active"] == schema2.is_active
        assert _json.get("results")[0]["is_legal"] == schema2.is_legal
        assert _json.get("results")[0]["score"] == schema2.score
        assert _json.get("results")[1]["name"] == schema.name

    def test_fails_when_anonymous_user_sends_post(self, client: Client) -> None:
        response: Response = client.post("/api/schemas/", {})

        assert response.status_code == HTTP_403_FORBIDDEN

    def test_rejects_when_data_properties_missing(self, user_client: Client) -> None:
        response: Response = user_client.post("/api/schemas/", {})

        assert response.status_code == HTTP_400_BAD_REQUEST

        _json: Dict[str, Any] = response.json()

        assert _json.get("version") == ["This field is required."]
        assert _json.get("name") == ["This field is required."]
        assert _json.get("api_url") == ["This field is required."]
        assert _json.get("schema") == ["This field is required."]

    def test_rejects_when_api_url_has_to_contain_search_input(
        self, user_client: Client, post_data: Dict[str, Any]
    ) -> None:
        post_data["api_url"] = "https://a"
        response: Response = user_client.post("/api/schemas/", post_data)

        assert response.status_code == HTTP_400_BAD_REQUEST
        assert response.json()["api_url"] == ["apiUrl has to contain ${searchInput}"]

    def test_rejects_when_schema_is_missing_properties(
        self, user_client: Client, post_data: Dict[str, Any]
    ) -> None:
        post_data["schema"] = "{}"
        response: Response = user_client.post("/api/schemas/", post_data)

        assert response.status_code == HTTP_400_BAD_REQUEST
        assert response.json()["schema"] == [
            "Schema has to include 'version', 'apiUrl' and 'parsers'."
        ]

    def test_rejects_when_schema_parsers_are_empty(
        self, user_client: Client, post_data: Dict[str, Any]
    ) -> None:
        post_data[
            "schema"
        ] = '{"version": 1, "apiUrl": "https://some-url?s=${searchInput}", "parsers": []}'
        response: Response = user_client.post("/api/schemas/", post_data)

        assert response.status_code == HTTP_400_BAD_REQUEST
        assert response.json()["schema"] == ["Parsers array cannot be empty."]

    def test_rejects_when_schema_parsers_are_incorrect(
        self, user_client: Client, post_data: Dict[str, Any]
    ) -> None:
        post_data[
            "schema"
        ] = """{"version": 1, "apiUrl": "https://some-url?s=${searchInput}",
            "parsers": [{"key": "title"}]}"""
        response: Response = user_client.post("/api/schemas/", post_data)

        assert response.status_code == HTTP_400_BAD_REQUEST
        assert response.json()["schema"] == [
            "{'key': 'title'} has to have 'key' and 'value' properties."
        ]
