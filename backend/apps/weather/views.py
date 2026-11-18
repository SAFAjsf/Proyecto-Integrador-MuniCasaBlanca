from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .services import obtener_clima, WeatherAPIError


@require_GET
def clima_api(request):

    ubicacion = request.GET.get(
        "ubicacion",
        "casablanca",
    )

    try:
        datos = obtener_clima(ubicacion)

        return JsonResponse(
            datos,
            json_dumps_params={
                "ensure_ascii": False,
            },
        )

    except WeatherAPIError as error:

        return JsonResponse(
            {
                "error": {
                    "codigo": error.codigo,
                    "mensaje": error.mensaje,
                }
            },
            status=error.status,
            json_dumps_params={
                "ensure_ascii": False,
            },
        )