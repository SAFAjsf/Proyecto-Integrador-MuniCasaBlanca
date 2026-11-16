from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Categoria, Atractivo
from .serializers import CategoriaSerializer, AtractivoSerializer


class CategoriaListAPIView(generics.ListAPIView):
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Categoria.objects.filter(
            activa=True
        ).order_by('nombre')


class AtractivoListAPIView(generics.ListAPIView):
    serializer_class = AtractivoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Atractivo.objects.filter(
            publicado=True,
            categoria__activa=True
        ).select_related('categoria').order_by('nombre')


class AtractivoDetailAPIView(generics.RetrieveAPIView):
    serializer_class = AtractivoSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Atractivo.objects.filter(
            publicado=True,
            categoria__activa=True
        ).select_related('categoria')