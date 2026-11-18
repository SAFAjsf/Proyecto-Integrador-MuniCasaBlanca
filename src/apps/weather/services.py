import json
import logging

from datetime import datetime, timezone
from threading import Lock
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.conf import settings
from django.core.cache import cache


logger = logging.getLogger(__name__)

WEATHER_API_URL = "https://api.weatherapi.com/v1/forecast.json"

CACHE_TIMEOUT = 60 * 15
REQUEST_TIMEOUT = 8

UBICACIONES = {
    "casablanca": {
        "nombre": "Casablanca",
        "coordenadas": "-33.318,-71.408",
    },
    "quintay": {
        "nombre": "Quintay",
        "coordenadas": "-33.190,-71.699",
    },
}

BLOQUEOS = {
    ubicacion: Lock()
    for ubicacion in UBICACIONES
}


class WeatherAPIError(Exception):

    def __init__(self, codigo, mensaje, status=503):
        super().__init__(mensaje)

        self.codigo = codigo
        self.mensaje = mensaje
        self.status = status


def normalizar_condicion(condicion):
    icono = condicion["icon"]

    if icono.startswith("//"):
        icono = "https:" + icono

    return {
        "texto": condicion["text"],
        "codigo": condicion["code"],
        "icono": icono,
    }


def normalizar_respuesta(datos, ubicacion):
    actual = datos["current"]
    pronostico = datos["forecast"]["forecastday"]

    actualizado = datetime.fromtimestamp(
        actual["last_updated_epoch"],
        tz=timezone.utc,
    ).isoformat()

    resultado = {
        "ubicacion": ubicacion,
        "nombre_ubicacion": UBICACIONES[ubicacion]["nombre"],
        "actualizado": actualizado,

        "actual": {
            "temperatura_c": actual["temp_c"],
            "sensacion_termica_c": actual["feelslike_c"],
            "condicion": normalizar_condicion(
                actual["condition"]
            ),
            "humedad_pct": actual["humidity"],
            "viento_kmh": actual["wind_kph"],
            "direccion_viento": actual["wind_dir"],
            "uv": actual["uv"],
            "precipitacion_mm": actual["precip_mm"],
            "es_dia": bool(actual["is_day"]),
        },

        "pronostico": [],
    }

    if len(pronostico) < 3:
        raise ValueError("Pronóstico incompleto")

    for registro in pronostico[:3]:
        dia = registro["day"]

        resultado["pronostico"].append({
            "fecha": registro["date"],
            "minima_c": dia["mintemp_c"],
            "maxima_c": dia["maxtemp_c"],
            "temperatura_promedio_c": dia["avgtemp_c"],
            "condicion": normalizar_condicion(
                dia["condition"]
            ),
            "probabilidad_lluvia_pct": dia[
                "daily_chance_of_rain"
            ],
            "precipitacion_mm": dia["totalprecip_mm"],
            "viento_maximo_kmh": dia["maxwind_kph"],
            "humedad_promedio_pct": dia["avghumidity"],
            "uv": dia["uv"],
        })

    return resultado


def consultar_proveedor(ubicacion):

    if not settings.WEATHERAPI_KEY:
        raise WeatherAPIError(
            "servicio_no_configurado",
            "El servicio meteorológico no está configurado.",
        )

    parametros = urlencode({
        "key": settings.WEATHERAPI_KEY,
        "q": UBICACIONES[ubicacion]["coordenadas"],
        "days": 3,
        "lang": "es",
        "aqi": "no",
        "alerts": "no",
    })

    solicitud = Request(
        f"{WEATHER_API_URL}?{parametros}",
        headers={
            "Accept": "application/json",
            "User-Agent": "CasablancaTurismo/1.0",
        },
    )

    try:
        with urlopen(
            solicitud,
            timeout=REQUEST_TIMEOUT,
        ) as respuesta:

            datos = json.load(respuesta)

    except HTTPError as error:

        # No registrar URL, clave ni cuerpo del proveedor.
        logger.warning(
            "WeatherAPI respondió con estado HTTP %s",
            error.code,
        )

        error.close()

        if error.code in (401, 403):
            raise WeatherAPIError(
                "proveedor_no_disponible",
                "El proveedor meteorológico no está disponible.",
            ) from None

        if error.code == 429:
            raise WeatherAPIError(
                "limite_consultas",
                "Servicio meteorológico temporalmente saturado.",
            ) from None

        raise WeatherAPIError(
            "error_proveedor",
            "No fue posible obtener el pronóstico.",
            status=502,
        ) from None

    except (URLError, TimeoutError, OSError):
        logger.warning("Error de conexión con WeatherAPI")

        raise WeatherAPIError(
            "error_conexion",
            "No fue posible conectar con el servicio meteorológico.",
        ) from None

    except (ValueError, UnicodeError):
        raise WeatherAPIError(
            "respuesta_invalida",
            "El proveedor entregó una respuesta inválida.",
            status=502,
        ) from None

    try:
        return normalizar_respuesta(datos, ubicacion)

    except (KeyError, TypeError, ValueError, OverflowError):
        logger.warning("Respuesta meteorológica incompleta")

        raise WeatherAPIError(
            "respuesta_invalida",
            "No fue posible procesar el pronóstico meteorológico.",
            status=502,
        ) from None


def obtener_clima(ubicacion):

    ubicacion = ubicacion.strip().lower()

    if ubicacion not in UBICACIONES:
        raise WeatherAPIError(
            "ubicacion_invalida",
            "Las ubicaciones permitidas son Casablanca y Quintay.",
            status=400,
        )

    clave_cache = f"weatherapi:v1:{ubicacion}"
    clave_error = f"{clave_cache}:error"

    with BLOQUEOS[ubicacion]:

        datos_cache = cache.get(clave_cache)

        if datos_cache is not None:
            return datos_cache

        error_cache = cache.get(clave_error)

        if error_cache is not None:
            raise WeatherAPIError(**error_cache)

        try:
            datos = consultar_proveedor(ubicacion)

        except WeatherAPIError as error:

            # Evita consultas repetidas durante una caída.
            cache.set(
                clave_error,
                {
                    "codigo": error.codigo,
                    "mensaje": error.mensaje,
                    "status": error.status,
                },
                timeout=60,
            )

            raise

        cache.set(
            clave_cache,
            datos,
            timeout=CACHE_TIMEOUT,
        )

        return datos