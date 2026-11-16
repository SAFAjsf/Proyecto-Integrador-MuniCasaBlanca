
from django.contrib import admin
from django import forms
from django.forms.models import BaseInlineFormSet

from .models import (
    Categoria,
    Atractivo,
    ImagenAtractivo,
    SeccionAtractivo,
    RecomendacionAtractivo,
)


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "activa")
    list_filter = ("activa",)
    search_fields = ("nombre",)


class ImagenAtractivoInlineFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()

        if any(self.errors):
            return

        cantidad_portadas = 0

        for formulario in self.forms:
            datos = getattr(formulario, "cleaned_data", None)

            if not datos or datos.get("DELETE", False):
                continue

            if datos.get("es_portada", False):
                cantidad_portadas += 1

        if cantidad_portadas > 1:
            raise forms.ValidationError(
                "Un atractivo turístico solo puede tener "
                "una fotografía de portada."
            )


class ImagenAtractivoInline(admin.TabularInline):
    model = ImagenAtractivo
    formset = ImagenAtractivoInlineFormSet
    extra = 1
    fields = (
        "imagen",
        "texto_alternativo",
        "es_portada",
        "orden",
    )


class SeccionAtractivoInline(admin.StackedInline):
    model = SeccionAtractivo
    extra = 1
    fields = (
        "titulo",
        "contenido",
        "orden",
    )


class RecomendacionAtractivoInline(admin.TabularInline):
    model = RecomendacionAtractivo
    extra = 1
    fields = (
        "texto",
        "orden",
    )


@admin.register(Atractivo)
class AtractivoAdmin(admin.ModelAdmin):
    inlines = [
        ImagenAtractivoInline,
        SeccionAtractivoInline,
        RecomendacionAtractivoInline,
    ]

    list_display = (
        "nombre",
        "categoria",
        "publicado",
        "fecha_actualizacion",
    )

    list_filter = ("categoria", "publicado")
    search_fields = ("nombre", "descripcion", "direccion")

    readonly_fields = (
        "fecha_creacion",
        "fecha_actualizacion",
    )
