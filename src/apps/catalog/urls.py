from django.urls import path

from .views import (
    CategoriaListAPIView,
    AtractivoListAPIView,
    AtractivoDetailAPIView,
)

urlpatterns = [
    path(
        'categorias/',
        CategoriaListAPIView.as_view(),
        name='categoria-list'
    ),
    path(
        'atractivos/',
        AtractivoListAPIView.as_view(),
        name='atractivo-list'
    ),
    path(
        'atractivos/<slug:slug>/',
        AtractivoDetailAPIView.as_view(),
        name='atractivo-detail'
    ),
]