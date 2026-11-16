from django.contrib import admin
from .models import Categoria, Atractivo


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "activa")
    list_filter = ("activa",)
    search_fields = ("nombre",)


@admin.register(Atractivo)
class AtractivoAdmin(admin.ModelAdmin):
    list_display = (
        "nombre",
        "categoria",
        "publicado",
        "fecha_actualizacion",
    )

    list_filter = ("categoria", "publicado")
    search_fields = ("nombre", "descripcion")
    readonly_fields = (
        "fecha_creacion",
        "fecha_actualizacion",
    )