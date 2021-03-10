import json
from dataclasses import dataclass
from typing import Dict

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError, NotFound

from backend.models import Schema


@dataclass
class SchemaDetailData:
    api_url: str
    name: str
    schema: Dict[str, str]
    version: int
    is_active: bool


@dataclass
class ScoreData:
    schema: int
    score: int


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]


class SchemaSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    version = serializers.IntegerField(required=True)

    def __init__(self, *args, **kwargs):
        if kwargs.get("user"):
            self.user = kwargs.pop("user")
        super().__init__(*args, **kwargs)

    class Meta:
        model = Schema
        exclude = []
        read_only_fields = ["user"]

    @property
    def object(self) -> SchemaDetailData:
        return SchemaDetailData(
            api_url=self.validated_data["schema"]["apiUrl"],
            schema=self.validated_data["schema"],
            name=self.validated_data["name"],
            version=self.validated_data["version"],
            is_active=self.validated_data["is_active"],
        )

    def validate_api_url(self, val: str) -> str:
        if not val.startswith("http"):
            raise ValidationError("apiUrl is not a http/https url.")

        if "${searchInput}" not in val:
            raise ValidationError("apiUrl has to contain ${searchInput}")

    def validate_version(self, val: str) -> int:
        if not val:
            raise ValidationError("version is required.")
        try:
            val = int(val)
        except Exception:
            raise ValidationError("version has to be an integer.")

        return val

    def validate_schema(self, val: str) -> Dict[str, str]:
        try:
            _json = json.loads(val)
        except json.decoder.JSONDecodeError:
            raise ValidationError("Schema has to be a valid JSON.")

        if set(_json.keys()) != {"version", "apiUrl", "parsers"}:
            raise ValidationError(
                "Schema has to include 'version', 'apiUrl' and 'parsers'."
            )

        if not isinstance(_json["parsers"], list):
            raise ValidationError("Parsers property has to be an array.")

        if len(_json["parsers"]) < 1:
            raise ValidationError("Parsers array cannot be empty.")

        for parser in _json["parsers"]:
            if set(parser.keys()) != {"key", "value"}:
                raise ValidationError(
                    f"{parser} has to have 'key' and 'value' properties."
                )

            if not isinstance(parser["key"], str) or not isinstance(
                parser["value"], str
            ):
                raise ValidationError(f"{parser} property values has to be strings.")

        return _json


class SchemaDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)
    user = serializers.CharField()
    api_url = serializers.CharField(max_length=255, required=True)
    schema = serializers.CharField(required=True)
    version = serializers.IntegerField(required=True)
    is_active = serializers.BooleanField(default=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def __init__(self, *args, **kwargs):
        if kwargs.get("user"):
            self.user = kwargs.pop("user")
        super().__init__(*args, **kwargs)

    @property
    def object(self) -> SchemaDetailData:
        return SchemaDetailData(
            api_url=self.validated_data["api_url"],
            schema=self.validated_data["schema"],
            version=self.validated_data["version"],
            is_active=self.validated_data["is_active"],
        )

    def create(self, validated_data):
        return Schema.objects.create(**validated_data)

    def update(self, instance, validated_data):
        if not self.user:
            raise

        instance.api_url = validated_data.get("api_url", instance.api_url)
        instance.schema = validated_data.get("schema", instance.schema)
        instance.version = validated_data.get("version", instance.version)
        instance.is_active = validated_data.get("is_active", instance.is_active)
        instance.save()

        return instance


class ScoreSerializer(serializers.Serializer):
    schema = serializers.IntegerField(required=True)
    score = serializers.IntegerField(required=True)

    @property
    def object(self) -> ScoreData:
        return ScoreData(
            schema=self.validated_data["schema"],
            score=self.validated_data["score"],
        )

    def validate_schema(self, val) -> int:
        try:
            Schema.objects.get(pk=val)
        except Schema.DoesNotExist:
            raise NotFound(f"Schema ID: {val} could not be found.")

        return val
