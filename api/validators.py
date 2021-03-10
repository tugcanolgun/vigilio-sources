from rest_framework.exceptions import ValidationError

from api.serializers import SchemaDetailData


def validate_create(schema_data: SchemaDetailData) -> None:
    if schema_data.api_url != schema_data.schema["apiUrl"]:
        raise ValidationError("apiUrl and api_url do not match.")

    if schema_data.version != schema_data.schema["version"]:
        raise ValidationError("Versions do not match.")
