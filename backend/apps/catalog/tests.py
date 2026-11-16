import base64
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import IntegrityError, transaction
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient

from .models import (
    Categoria,
    Atractivo,
    ImagenAtractivo,
    SeccionAtractivo,
    RecomendacionAtractivo,
)


# ============================================================
# PRUEBAS DE LA API DEL CATALOGO TURISTICO
# ============================================================

class CatalogoAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.categoria = Categoria.objects.create(
            nombre="Naturaleza",
            activa=True,
        )

        self.categoria_inactiva = Categoria.objects.create(
            nombre="Categoría inactiva",
            activa=False,
        )

        self.atractivo_publicado = Atractivo.objects.create(
            nombre="Atractivo publicado",
            slug="atractivo-publicado",
            descripcion="Descripción de prueba",
            categoria=self.categoria,
            publicado=True,
        )

        self.atractivo_oculto = Atractivo.objects.create(
            nombre="Atractivo oculto",
            slug="atractivo-oculto",
            descripcion="No debe aparecer públicamente",
            categoria=self.categoria,
            publicado=False,
        )

        self.atractivo_categoria_inactiva = Atractivo.objects.create(
            nombre="Atractivo categoría inactiva",
            slug="atractivo-categoria-inactiva",
            descripcion="No debe aparecer públicamente",
            categoria=self.categoria_inactiva,
            publicado=True,
        )

    def test_categorias_solo_activas(self):
        response = self.client.get(
            reverse("categoria-list")
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["nombre"],
            "Naturaleza",
        )

    def test_atractivos_solo_publicados(self):
        response = self.client.get(
            reverse("atractivo-list")
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["slug"],
            "atractivo-publicado",
        )

    def test_detalle_atractivo_publicado(self):
        response = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": "atractivo-publicado"},
            )
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["nombre"],
            "Atractivo publicado",
        )

    def test_detalle_atractivo_no_publicado(self):
        response = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": "atractivo-oculto"},
            )
        )

        self.assertEqual(response.status_code, 404)

    def test_detalle_categoria_inactiva(self):
        response = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": "atractivo-categoria-inactiva"},
            )
        )

        self.assertEqual(response.status_code, 404)


# ============================================================
# PRUEBAS DE CONTENIDO DE LOS ATRACTIVOS
# ============================================================

class ContenidoAtractivoAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.categoria = Categoria.objects.create(
            nombre="Patrimonio",
            activa=True,
        )

        self.atractivo = Atractivo.objects.create(
            nombre="Atractivo de prueba",
            descripcion="Descripción de prueba",
            categoria=self.categoria,
            publicado=True,
        )

        self.seccion = SeccionAtractivo.objects.create(
            atractivo=self.atractivo,
            titulo="Historia",
            contenido="Contenido histórico de prueba",
            orden=1,
        )

        self.recomendacion = RecomendacionAtractivo.objects.create(
            atractivo=self.atractivo,
            texto="Planificar la visita",
            orden=1,
        )

    def test_detalle_incluye_secciones(self):
        response = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": self.atractivo.slug},
            )
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["secciones"]), 1)
        self.assertEqual(
            response.data["secciones"][0]["titulo"],
            "Historia",
        )

    def test_detalle_incluye_recomendaciones(self):
        response = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": self.atractivo.slug},
            )
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["recomendaciones"][0]["texto"],
            "Planificar la visita",
        )

    def test_detalle_incluye_imagenes(self):
        response = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": self.atractivo.slug},
            )
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("imagenes", response.data)
        self.assertEqual(response.data["imagenes"], [])


# ============================================================
# PRUEBAS DE FOTOGRAFIAS Y PORTADAS
# ============================================================

class ImagenAtractivoAPITests(TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.directorio_temporal = tempfile.TemporaryDirectory()
        cls.configuracion_media = override_settings(
            MEDIA_ROOT=cls.directorio_temporal.name
        )

        try:
            cls.configuracion_media.enable()
        except Exception:
            cls.directorio_temporal.cleanup()
            super().tearDownClass()
            raise

    @classmethod
    def tearDownClass(cls):
        try:
            cls.configuracion_media.disable()
            cls.directorio_temporal.cleanup()
        finally:
            super().tearDownClass()

    def setUp(self):
        self.client = APIClient()

        self.categoria = Categoria.objects.create(
            nombre="Patrimonio",
            activa=True,
        )

        self.atractivo = Atractivo.objects.create(
            nombre="Atractivo fotográfico",
            descripcion="Descripción de prueba",
            categoria=self.categoria,
            publicado=True,
        )

    def crear_imagen(self, atractivo, portada=False):
        # Imagen PNG mínima para pruebas automatizadas
        imagen_bytes = base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB"
            "CAQAAAC1HAwCAAAAC0lEQVR42mP8/x8A"
            "AgMBApWl9QAAAABJRU5ErkJggg=="
        )

        archivo = SimpleUploadedFile(
            "prueba.png",
            imagen_bytes,
            content_type="image/png",
        )

        return ImagenAtractivo.objects.create(
            atractivo=atractivo,
            imagen=archivo,
            texto_alternativo="Fotografía de prueba",
            es_portada=portada,
        )

    def test_api_incluye_fotografia(self):
        self.crear_imagen(
            self.atractivo,
            portada=True,
        )

        response = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": self.atractivo.slug},
            )
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["imagenes"]), 1)

        imagen = response.data["imagenes"][0]

        self.assertTrue(imagen["es_portada"])
        self.assertEqual(
            imagen["texto_alternativo"],
            "Fotografía de prueba",
        )
        self.assertIn(
            "/media/atractivos/",
            imagen["imagen"],
        )

    def test_no_permite_dos_portadas(self):
        self.crear_imagen(
            self.atractivo,
            portada=True,
        )

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                self.crear_imagen(
                    self.atractivo,
                    portada=True,
                )

        self.assertEqual(
            ImagenAtractivo.objects.filter(
                atractivo=self.atractivo,
                es_portada=True,
            ).count(),
            1,
        )

    def test_distintos_atractivos_pueden_tener_portada(self):
        otro_atractivo = Atractivo.objects.create(
            nombre="Segundo atractivo",
            descripcion="Otra descripción",
            categoria=self.categoria,
            publicado=True,
        )

        self.crear_imagen(
            self.atractivo,
            portada=True,
        )

        self.crear_imagen(
            otro_atractivo,
            portada=True,
        )

        self.assertEqual(
            ImagenAtractivo.objects.filter(
                es_portada=True,
            ).count(),
            2,
        )


class SlugAtractivoTests(TestCase):

    def setUp(self):
        self.categoria = Categoria.objects.create(
            nombre="Enoturismo",
            activa=True,
        )

    def crear_atractivo(self, nombre):
        return Atractivo.objects.create(
            nombre=nombre,
            descripcion="Descripción de prueba",
            categoria=self.categoria,
        )

    def test_slug_automatico(self):
        atractivo = self.crear_atractivo(
            "Viña Casablanca"
        )

        self.assertEqual(
            atractivo.slug,
            "vina-casablanca",
        )

    def test_slug_duplicado(self):
        primero = self.crear_atractivo(
            "Viña Casablanca"
        )

        segundo = self.crear_atractivo(
            "Viña Casablanca"
        )

        self.assertEqual(
            primero.slug,
            "vina-casablanca",
        )

        self.assertEqual(
            segundo.slug,
            "vina-casablanca-2",
        )

    def test_tres_atractivos_mismo_nombre(self):
        atractivos = [
            self.crear_atractivo("Viña Casablanca")
            for _ in range(3)
        ]

        self.assertEqual(
            [atractivo.slug for atractivo in atractivos],
            [
                "vina-casablanca",
                "vina-casablanca-2",
                "vina-casablanca-3",
            ],
        )

    def test_slug_no_cambia_al_editar(self):
        atractivo = self.crear_atractivo(
            "Viña Casablanca"
        )

        atractivo.nombre = "Viña Casablanca Renovada"
        atractivo.save()

        self.assertEqual(
            atractivo.slug,
            "vina-casablanca",
        )
