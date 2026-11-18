from django.conf import settings
from django.db import models


class EventoEditorial(models.Model):

    class Accion(models.TextChoices):
        CREACION = "creacion", "Creación de versión"
        EDICION = "edicion", "Edición de versión"
        ENVIO = "envio", "Envío a revisión"
        OBSERVACION = "observacion", "Solicitud de correcciones"
        APROBACION = "aprobacion", "Aprobación y publicación"
        RETIRO = "retiro", "Retiro de publicación"
        IMPORTACION = "importacion", "Importación inicial"

    atractivo = models.ForeignKey(
        "catalog.Atractivo",
        on_delete=models.SET_NULL,
        null=True,
        related_name="eventos_editoriales",
    )

    version = models.ForeignKey(
        "catalog.VersionAtractivo",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="eventos_editoriales",
    )

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="eventos_editoriales",
    )

    accion = models.CharField(
        max_length=20,
        choices=Accion.choices,
    )

    descripcion = models.TextField(blank=True)

    fecha = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        verbose_name = "Evento editorial"
        verbose_name_plural = "Eventos editoriales"

        ordering = ["-fecha", "-id"]

    def __str__(self):
        return (
            f"{self.get_accion_display()} - "
            f"{self.fecha:%d/%m/%Y %H:%M}"
        )