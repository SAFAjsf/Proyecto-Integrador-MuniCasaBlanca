from unittest.mock import patch
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse, parse_qs
from io import BytesIO
import json

from django.core.cache import cache
from django.test import SimpleTestCase, override_settings
from django.urls import reverse

from .services import UBICACIONES


RESPUESTA_SIMULADA = {
    "current": {
        "last_updated_epoch": 1794956400,
        "temp_c": 20.5,
        "feelslike_c": 21.0,
        "condition": {
            "text": "Parcialmente nublado",
            "code": 1003,
            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
        },
        "humidity": 65,
        "wind_kph": 12.5,
        "wind_dir": "SW",
        "uv": 5,
        "precip_mm": 0,
        "is_day": 1,
    },
    "forecast": {
        "forecastday": [
            {
                "date": f"2026-11-{dia}",
                "day": {
                    "mintemp_c": 12,
                    "maxtemp_c": 24,
                    "avgtemp_c": 18,
                    "condition": {
                        "text": "Soleado",
                        "code": 1000,
                        "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                    },
                    "daily_chance_of_rain": 10,
                    "totalprecip_mm": 0,
                    "maxwind_kph": 18,
                    "avghumidity": 62,
                    "uv": 6,
                },
            }
            for dia in (17, 18, 19)
        ]
    },
}


@override_settings(
    WEATHERAPI_KEY="clave-ficticia-pruebas",
    CACHES={
        "default": {
            "BACKEND": (
                "django.core.cache.backends.locmem.LocMemCache"
            ),
            "LOCATION": "weather-tests",
        }
    },
)
class WeatherAPITests(SimpleTestCase):

    def setUp(self):
        cache.clear()
        self.url = reverse("clima_api")

    def tearDown(self):
        cache.clear()

    def respuesta_proveedor(self):
        return BytesIO(
            json.dumps(RESPUESTA_SIMULADA).encode("utf-8")
        )

    # 1. Consulta Casablanca
    @patch("apps.weather.services.urlopen")
    def test_consultar_casablanca(self, mock_urlopen):
        mock_urlopen.return_value = self.respuesta_proveedor()

        response = self.client.get(
            self.url,
            {"ubicacion": "casablanca"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["ubicacion"],
            "casablanca",
        )

    # 2. Consulta Quintay
    @patch("apps.weather.services.urlopen")
    def test_consultar_quintay(self, mock_urlopen):
        mock_urlopen.return_value = self.respuesta_proveedor()

        response = self.client.get(
            self.url,
            {"ubicacion": "quintay"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["nombre_ubicacion"],
            "Quintay",
        )

    # 3. Ubicación predeterminada
    @patch("apps.weather.services.urlopen")
    def test_ubicacion_predeterminada(self, mock_urlopen):
        mock_urlopen.return_value = self.respuesta_proveedor()

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["ubicacion"],
            "casablanca",
        )

    # 4. Ubicación inválida
    @patch("apps.weather.services.urlopen")
    def test_ubicacion_invalida(self, mock_urlopen):
        response = self.client.get(
            self.url,
            {"ubicacion": "santiago"},
        )

        self.assertEqual(response.status_code, 400)

        self.assertEqual(
            response.json()["error"]["codigo"],
            "ubicacion_invalida",
        )

        mock_urlopen.assert_not_called()

    # 5. Pronóstico de tres días
    @patch("apps.weather.services.urlopen")
    def test_pronostico_tres_dias(self, mock_urlopen):
        mock_urlopen.return_value = self.respuesta_proveedor()

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            len(response.json()["pronostico"]),
            3,
        )

    # 6. Normalización de datos
    @patch("apps.weather.services.urlopen")
    def test_normalizacion(self, mock_urlopen):
        mock_urlopen.return_value = self.respuesta_proveedor()

        response = self.client.get(self.url)
        datos = response.json()

        self.assertEqual(
            set(datos.keys()),
            {
                "ubicacion",
                "nombre_ubicacion",
                "actualizado",
                "actual",
                "pronostico",
            },
        )

        self.assertEqual(
            datos["actual"]["temperatura_c"],
            20.5,
        )

        self.assertTrue(
            datos["actual"]["condicion"]["icono"]
            .startswith("https://")
        )

    # 7. Reutilización de caché
    @patch("apps.weather.services.urlopen")
    def test_cache(self, mock_urlopen):
        mock_urlopen.return_value = self.respuesta_proveedor()

        primera = self.client.get(self.url)
        segunda = self.client.get(self.url)

        self.assertEqual(primera.status_code, 200)
        self.assertEqual(segunda.status_code, 200)

        self.assertEqual(
            primera.json(),
            segunda.json(),
        )

        mock_urlopen.assert_called_once()

    # 8. Caché independiente por localidad
    @patch("apps.weather.services.urlopen")
    def test_cache_independiente(self, mock_urlopen):
        mock_urlopen.side_effect = [
            self.respuesta_proveedor(),
            self.respuesta_proveedor(),
        ]

        self.client.get(
            self.url,
            {"ubicacion": "casablanca"},
        )

        self.client.get(
            self.url,
            {"ubicacion": "quintay"},
        )

        self.assertEqual(mock_urlopen.call_count, 2)

        self.assertIsNotNone(
            cache.get("weatherapi:v1:casablanca")
        )

        self.assertIsNotNone(
            cache.get("weatherapi:v1:quintay")
        )

    # 9. Parámetros enviados al proveedor
    @patch("apps.weather.services.urlopen")
    def test_parametros_weatherapi(self, mock_urlopen):
        mock_urlopen.return_value = self.respuesta_proveedor()

        self.client.get(
            self.url,
            {"ubicacion": "quintay"},
        )

        solicitud = mock_urlopen.call_args.args[0]

        parametros = parse_qs(
            urlparse(solicitud.full_url).query
        )

        self.assertEqual(parametros["days"], ["3"])
        self.assertEqual(parametros["lang"], ["es"])

        self.assertEqual(
            parametros["q"],
            [UBICACIONES["quintay"]["coordenadas"]],
        )

    # 10. Error de conexión
    @patch("apps.weather.services.urlopen")
    def test_error_conexion(self, mock_urlopen):
        mock_urlopen.side_effect = URLError(
            "Sin conexión"
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 503)

        self.assertEqual(
            response.json()["error"]["codigo"],
            "error_conexion",
        )

    # 11. API Key inválida
    @patch("apps.weather.services.urlopen")
    def test_error_autenticacion(self, mock_urlopen):
        mock_urlopen.side_effect = HTTPError(
            url="https://api.weatherapi.com/v1/forecast.json",
            code=401,
            msg="Unauthorized",
            hdrs=None,
            fp=None,
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 503)

        self.assertEqual(
            response.json()["error"]["codigo"],
            "proveedor_no_disponible",
        )

    # 12. Protección de la API Key
    @patch("apps.weather.services.urlopen")
    def test_api_key_no_expuesta(self, mock_urlopen):
        mock_urlopen.return_value = self.respuesta_proveedor()

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)

        self.assertNotContains(
            response,
            "clave-ficticia-pruebas",
        )

    # 13. API Key no configurada
    @override_settings(WEATHERAPI_KEY="")
    @patch("apps.weather.services.urlopen")
    def test_api_key_no_configurada(self, mock_urlopen):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 503)

        self.assertEqual(
            response.json()["error"]["codigo"],
            "servicio_no_configurado",
        )

        mock_urlopen.assert_not_called()

    # 14. Método HTTP no permitido
    def test_metodo_post_no_permitido(self):
        response = self.client.post(self.url)

        self.assertEqual(response.status_code, 405)

    # 15. Respuesta inválida del proveedor
    @patch("apps.weather.services.urlopen")
    def test_respuesta_invalida(self, mock_urlopen):
        mock_urlopen.return_value = BytesIO(
            b'{"current": {}}'
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 502)

        self.assertEqual(
            response.json()["error"]["codigo"],
            "respuesta_invalida",
        )