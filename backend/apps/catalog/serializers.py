from rest_framework import serializers

from .models import Categoria, Atractivo


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = [
            'id',
            'nombre',
            'descripcion',
        ]


class AtractivoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)

    class Meta:
        model = Atractivo
        fields = [
            'id',
            'nombre',
            'slug',
            'descripcion',
            'categoria',
            'direccion',
        ]