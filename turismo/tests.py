# get_user_model() devuelve tu modelo de usuario activo (el estándar, si no cambiaste AUTH_USER_MODEL).
from django.contrib.auth import get_user_model
# TestCase crea una base de datos temporal, la llena y la destruye al terminar.
from django.test import TestCase
# reverse() obtiene la URL a partir del nombre, igual que en las plantillas.
from django.urls import reverse

from .models import Atractivo, Categoria


class AtractivoCRUDTests(TestCase):
    # setUp se ejecuta antes de CADA test; así cada prueba parte de datos limpios.
    def setUp(self):
        self.usuario = get_user_model().objects.create_user(
            username="funcionario",
            password="clave-segura-123",
            # is_staff=True para que es_funcionario() devuelva True.
            is_staff=True,
        )
        self.categoria = Categoria.objects.create(nombre="Patrimonio")
        self.atractivo = Atractivo.objects.create(
            nombre="Museo de Casablanca",
            descripcion="Museo arqueológico y antropológico.",
            categoria=self.categoria,
            publicado=True,
        )

    def test_lista_publica(self):
        # self.client simula un navegador: hace la petición sin levantar runserver.
        respuesta = self.client.get(reverse("atractivos"))
        # assertContains falla si el HTML no incluye ese texto.
        self.assertContains(respuesta, "Museo de Casablanca")

    def test_gestion_requiere_login(self):
        respuesta = self.client.get(reverse("gestion_atractivos"))
        # 302 = redirección al login. Si diera 200, el panel estaría abierto al público.
        self.assertEqual(respuesta.status_code, 302)

    def test_funcionario_puede_crear(self):
        # force_login evita tener que pasar por el formulario de login en cada test.
        self.client.force_login(self.usuario)

        respuesta = self.client.post(
            reverse("atractivo_crear"),
            {
                "nombre": "Santuario de Lo Vásquez",
                "descripcion": "Santuario religioso.",
                # En un POST, la ForeignKey se envía como el pk numérico.
                "categoria": self.categoria.pk,
                "direccion": "Lo Vásquez",
                "publicado": True,
            },
        )

        # 302 = guardó y redirigió al listado.
        self.assertEqual(respuesta.status_code, 302)
        # Confirma que la fila realmente quedó en la base.
        self.assertTrue(
            Atractivo.objects.filter(nombre="Santuario de Lo Vásquez").exists()
        )