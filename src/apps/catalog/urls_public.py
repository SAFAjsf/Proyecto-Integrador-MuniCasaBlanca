from django.urls import path

from . import views_public as views


urlpatterns = [
    path("", views.inicio, name="inicio"),

    path(
        "atractivos/",
        views.atractivos,
        name="atractivos",
    ),

    path(
        "atractivos/<slug:slug>/",
        views.atractivo_detalle,
        name="atractivo_detalle",
    ),

    path(
        "como-llegar/",
        views.como_llegar,
        name="como_llegar",
    ),

    path("historia/", views.historia, name="historia"),

    path("noticias/", views.noticias, name="noticias"),

    path("quintay/", views.quintay, name="quintay"),

    path("ruta-vino/", views.ruta_vino, name="ruta_vino"),

    path("clima/", views.clima, name="clima"),

    path("vinas/", views.vinas, name="vinas"),
]