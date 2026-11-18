
from rest_framework import serializers

from .models import (
    Categoria,
    Atractivo,
    ImagenAtractivo,
    SeccionAtractivo,
    RecomendacionAtractivo,
)


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = (
            "id",
            "nombre",
            "descripcion",
        )


class ImagenAtractivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenAtractivo
        fields = (
            "id",
            "imagen",
            "texto_alternativo",
            "es_portada",
            "orden",
        )


class SeccionAtractivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeccionAtractivo
        fields = (
            "id",
            "titulo",
            "contenido",
            "orden",
        )


class RecomendacionAtractivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecomendacionAtractivo
        fields = (
            "id",
            "texto",
            "orden",
        )


class AtractivoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)

    imagenes = ImagenAtractivoSerializer(
        many=True,
        read_only=True,
    )

    secciones = SeccionAtractivoSerializer(
        many=True,
        read_only=True,
    )

    recomendaciones = RecomendacionAtractivoSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Atractivo
        fields = (
            "id",
            "nombre",
            "slug",
            "descripcion",
            "categoria",
            "zona",
            "direccion",
            "imagenes",
            "secciones",
            "recomendaciones",
        )
