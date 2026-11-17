from django.contrib import admin

# Register your models here.
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


#TabulatedInline es para mostrar las imagenes en una tabla, StackedInline es para mostrar las secciones en un bloque
class ImagenInline(admin.TabularInline):
    model = ImagenAtractivo
    #formulario extra para agregar otra imagen
    extra = 1
    fields = ("imagen", "texto_alternativo", "es_portada", "orden")

class SeccionInline(admin.StackedInline):
    model = SeccionAtractivo
    extra = 1
    fields = ("titulo", "contenido", "orden")

class RecomendacionInline(admin.TabularInline):
    model = RecomendacionAtractivo
    extra = 1
    fields = ("texto", "orden")

@admin.register(Atractivo)
class AtractivoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "categoria", "publicado", "fecha_actualizacion")
    list_filter = ("categoria", "publicado")
    search_fields = ("nombre", "descripcion", "direccion")
    # Campos que solo se muestran, no se editan (los llena Django).
    readonly_fields = ("fecha_creacion", "fecha_actualizacion")
    # Los formularios hijos que aparecen dentro de la misma página del atractivo.
    inlines = [ImagenInline, SeccionInline, RecomendacionInline]
