from typing import List

from django.contrib.auth.models import User
from rest_framework import permissions, generics
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.response import Response

from api.serializers import (
    SchemaSerializer,
    SchemaDetailSerializer,
    SchemaDetailData,
    ScoreSerializer,
    ScoreData,
)
from api.throttler import save_create, check_create, get_client_ip
from backend.models import Schema


class SchemaList(generics.ListCreateAPIView):
    queryset = Schema.objects.filter(is_active=True).order_by("-score").all()
    serializer_class = SchemaSerializer

    def create(self, request: Request, *args, **kwargs):
        check_create(request.user.id)
        serializer = SchemaSerializer(data=request.data, user=request.user)
        serializer.is_valid(raise_exception=True)
        data: SchemaDetailData = serializer.object

        schema: Schema = Schema.objects.create(
            user=request.user,
            name=data.name,
            api_url=data.api_url,
            schema=data.schema,
            version=data.version,
            is_active=data.is_active,
        )
        save_create(request.user.id)

        return Response(SchemaSerializer(schema).data)

    def get_permissions(self) -> List[BasePermission]:
        if self.request.method in ["POST"]:
            return [permissions.IsAuthenticated()]

        return []


class SchemaDetailEndpoint(GenericAPIView):
    serializer_class = SchemaDetailSerializer
    verbose_request_logging = True

    def get(self, request: Request, pk: int) -> Response:
        schema: Schema = self.get_schema(pk=pk)
        serializer = SchemaSerializer(schema)

        return Response(serializer.data)

    def put(self, request: Request, pk: int) -> Response:
        schema: Schema = self.get_schema(pk=pk)
        self.check_user(schema=schema, user=request.user)
        serializer = self.get_serializer(schema, data=request.data, user=request.user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        schema.refresh_from_db()

        return Response(serializer.data)

    def delete(self, request: Request, pk: int) -> Response:
        schema: Schema = self.get_schema(pk=pk)
        self.check_user(schema=schema, user=request.user)

        return Response({"status": "not implemented"})

    def get_schema(self, pk: int) -> Schema:
        try:
            return Schema.objects.get(pk=pk)
        except Schema.DoesNotExist:
            raise NotFound()

    def check_user(self, schema: Schema, user: User) -> None:
        if schema.user != user:
            raise PermissionDenied()

    def get_permissions(self) -> List[BasePermission]:
        if self.request.method in ["PUT", "DELETE"]:
            return [permissions.IsAuthenticated()]

        return []


class ScoreEndpoint(GenericAPIView):
    serializer_class = ScoreSerializer
    verbose_request_logging = True

    def post(self, request: Request) -> Response:
        ip: str = get_client_ip(request=request)
        check_create(f"{ip}.{request.data.get('schema', 'unk')}", expiration=3600 * 24)
        save_create(f"{ip}.{request.data.get('schema', 'unk')}")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        score_data: ScoreData = serializer.object

        score: int = 1 if score_data.score > 0 else -1
        schema: Schema = Schema.objects.get(pk=score_data.schema)
        schema.score += score
        schema.save()

        return Response({"operation": "success"})
