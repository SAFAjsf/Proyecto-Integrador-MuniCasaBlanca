from django.contrib import admin

from .models import (
    Categoria,
    Atractivo,
    ImagenAtractivo,
    SeccionAtractivo,
    RecomendacionAtractivo,
)

from .permissions import es_administrador


# ==================================================
# PROTECCIÓN DEL CATÁLOGO PÚBLICO
# ==================================================

class SoloLecturaMixin:

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


# ==================================================
# CATEGORÍAS
# ==================================================

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):

    list_display = ("nombre", "activa")

    list_filter = ("activa",)

    search_fields = ("nombre", "descripcion")

    def has_add_permission(self, request):
        return es_administrador(request.user)

    def has_change_permission(self, request, obj=None):
        return es_administrador(request.user)

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


# ==================================================
# IMÁGENES
# ==================================================

class ImagenAtractivoInline(
    SoloLecturaMixin,
    admin.TabularInline,
):

    model = ImagenAtractivo

    extra = 0

    fields = (
        "imagen",
        "texto_alternativo",
        "es_portada",
        "orden",
    )


# ==================================================
# SECCIONES
# ==================================================

class SeccionAtractivoInline(
    SoloLecturaMixin,
    admin.StackedInline,
):

    model = SeccionAtractivo

    extra = 0


# ==================================================
# RECOMENDACIONES
# ==================================================

class RecomendacionAtractivoInline(
    SoloLecturaMixin,
    admin.TabularInline,
):

    model = RecomendacionAtractivo

    extra = 0


# ==================================================
# ATRACTIVOS TURÍSTICOS
# ==================================================

@admin.register(Atractivo)
class AtractivoAdmin(
    SoloLecturaMixin,
    admin.ModelAdmin,
):

    inlines = [
        ImagenAtractivoInline,
        SeccionAtractivoInline,
        RecomendacionAtractivoInline,
    ]

    list_display = (
        "nombre",
        "categoria",
        "zona",
        "publicado",
        "version_publicada",
        "fecha_actualizacion",
    )

    list_filter = (
        "categoria",
        "zona",
        "publicado",
    )

    search_fields = (
        "nombre",
        "descripcion",
        "direccion",
    )

    readonly_fields = (
        "nombre",
        "slug",
        "descripcion",
        "categoria",
        "zona",
        "direccion",
        "publicado",
        "version_publicada",
        "fecha_creacion",
        "fecha_actualizacion",
    )

    actions = None