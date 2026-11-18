from django.core.files.storage import default_storage
from django.http import FileResponse, Http404
from django.views.decorators.http import require_safe

from apps.catalog.models import (
    ImagenAtractivo,
    ImagenVersionAtractivo,
)

from apps.catalog.permissions import es_funcionario


@require_safe
def archivo_multimedia(request, ruta):

    es_publica = ImagenAtractivo.objects.filter(
        imagen=ruta,
        atractivo__publicado=True,
        atractivo__categoria__activa=True,
    ).exists()

    if not es_publica:

        if not es_funcionario(request.user):
            raise Http404("Archivo no disponible.")

        existe = (
            ImagenAtractivo.objects.filter(
                imagen=ruta
            ).exists()
            or ImagenVersionAtractivo.objects.filter(
                imagen=ruta
            ).exists()
        )

        if not existe:
            raise Http404("Archivo no disponible.")

    try:

        archivo = default_storage.open(ruta, "rb")

    except (FileNotFoundError, OSError):

        raise Http404("Archivo no encontrado.")

    respuesta = FileResponse(archivo)

    respuesta["X-Content-Type-Options"] = "nosniff"

    respuesta["Cache-Control"] = "private, no-store"

    return respuesta