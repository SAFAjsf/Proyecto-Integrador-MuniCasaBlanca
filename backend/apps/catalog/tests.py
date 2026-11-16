from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from .models import Categoria, Atractivo


class CatalogoAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.categoria = Categoria.objects.create(
            nombre="Naturaleza",
            activa=True
        )

        self.categoria_inactiva = Categoria.objects.create(
            nombre="Categoría inactiva",
            activa=False
        )

        self.atractivo_publicado = Atractivo.objects.create(
            nombre="Atractivo publicado",
            slug="atractivo-publicado",
            descripcion="Descripción de prueba",
            categoria=self.categoria,
            publicado=True
        )

        self.atractivo_oculto = Atractivo.objects.create(
            nombre="Atractivo oculto",
            slug="atractivo-oculto",
            descripcion="No debe aparecer públicamente",
            categoria=self.categoria,
            publicado=False
        )

        self.atractivo_categoria_inactiva = Atractivo.objects.create(
            nombre="Atractivo categoría inactiva",
            slug="atractivo-categoria-inactiva",
            descripcion="No debe aparecer públicamente",
            categoria=self.categoria_inactiva,
            publicado=True
        )

    def test_categorias_solo_activas(self):
        response = self.client.get(
            reverse("categoria-list")
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["nombre"],
            "Naturaleza"
        )

    def test_atractivos_solo_publicados(self):
        response = self.client.get(
            reverse("atractivo-list")
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["slug"],
            "atractivo-publicado"
        )

    def test_detalle_atractivo_publicado(self):
        response = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": "atractivo-publicado"}
            )
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["nombre"],
            "Atractivo publicado"
        )

    def test_detalle_atractivo_no_publicado(self):
        response = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": "atractivo-oculto"}
            )
        )

        self.assertEqual(response.status_code, 404)

    def test_detalle_categoria_inactiva(self):
        response = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": "atractivo-categoria-inactiva"}
            )
        )

        self.assertEqual(response.status_code, 404)