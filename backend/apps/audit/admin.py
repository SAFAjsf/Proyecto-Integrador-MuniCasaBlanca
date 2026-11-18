from django.contrib import admin

from .models import EventoEditorial


@admin.register(EventoEditorial)
class EventoEditorialAdmin(admin.ModelAdmin):

    list_display = (
        "fecha",
        "accion",
        "usuario",
        "atractivo",
        "version",
    )

    list_filter = (
        "accion",
        "fecha",
    )

    search_fields = (
        "descripcion",
        "usuario__username",
        "atractivo__nombre",
    )

    readonly_fields = (
        "fecha",
        "accion",
        "usuario",
        "atractivo",
        "version",
        "descripcion",
    )

    ordering = ("-fecha",)

    actions = None

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False