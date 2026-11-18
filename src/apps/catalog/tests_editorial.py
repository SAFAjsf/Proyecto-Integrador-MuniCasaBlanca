from tempfile import TemporaryDirectory

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.exceptions import PermissionDenied, ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings
from django.urls import reverse

from apps.audit.models import EventoEditorial

from .models import (
    Categoria,
    Atractivo,
    VersionAtractivo,
    ImagenVersionAtractivo,
)

from .services import (
    crear_version,
    enviar_a_revision,
    observar_version,
    aprobar_version,
    retirar_publicacion,
)


Usuario = get_user_model()


class FlujoEditorialTests(TestCase):

    @classmethod
    def setUpTestData(cls):

        call_command("configurar_roles", verbosity=0)

        cls.editor = Usuario.objects.create_user(
            username="editor_test",
            password="ClaveEditorial2026!",
            is_staff=False,
        )

        cls.editor.groups.add(
            Group.objects.get(
                name="Editores de contenido"
            )
        )

        cls.administrador = Usuario.objects.create_user(
            username="admin_test",
            password="ClaveAdministrativa2026!",
            is_staff=True,
        )

        cls.administrador.groups.add(
            Group.objects.get(
                name="Administradores"
            )
        )

        cls.categoria = Categoria.objects.create(
            nombre="Patrimonio",
            activa=True,
        )

        cls.atractivo = Atractivo.objects.create(
            nombre="Museo de Casablanca",
            descripcion="Descripción original",
            categoria=cls.categoria,
            publicado=True,
        )

        cls.version_inicial = VersionAtractivo.objects.create(
            atractivo=cls.atractivo,
            numero_version=1,
            nombre=cls.atractivo.nombre,
            descripcion=cls.atractivo.descripcion,
            categoria=cls.categoria,
            zona=cls.atractivo.zona,
            estado=VersionAtractivo.Estado.APROBADA,
            importada=True,
        )

        cls.atractivo.version_publicada = cls.version_inicial

        cls.atractivo.save()


    # ==============================================
    # CREACIÓN DE VERSIONES
    # ==============================================

    def test_editor_puede_crear_version(self):

        version = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        self.assertEqual(
            version.numero_version,
            2,
        )

        self.assertEqual(
            version.estado,
            VersionAtractivo.Estado.BORRADOR,
        )


    def test_no_duplica_borradores(self):

        primera = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        segunda = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        self.assertEqual(
            primera.pk,
            segunda.pk,
        )


    # ==============================================
    # CONSERVACIÓN DEL CONTENIDO PÚBLICO
    # ==============================================

    def test_borrador_no_modifica_publicacion(self):

        version = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        version.descripcion = "Descripción modificada"

        version.save()

        self.atractivo.refresh_from_db()

        self.assertEqual(
            self.atractivo.descripcion,
            "Descripción original",
        )

        self.assertEqual(
            self.atractivo.version_publicada_id,
            self.version_inicial.pk,
        )

        respuesta = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": self.atractivo.slug},
            )
        )

        self.assertEqual(
            respuesta.status_code,
            200,
        )

        self.assertEqual(
            respuesta.json()["descripcion"],
            "Descripción original",
        )


    # ==============================================
    # ENVÍO Y REVISIÓN
    # ==============================================

    def test_editor_puede_enviar_a_revision(self):

        version = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        enviar_a_revision(
            version.pk,
            self.editor,
        )

        version.refresh_from_db()

        self.assertEqual(
            version.estado,
            VersionAtractivo.Estado.PENDIENTE,
        )

        self.assertFalse(version.es_editable)


    def test_editor_no_puede_aprobar(self):

        version = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        enviar_a_revision(
            version.pk,
            self.editor,
        )

        with self.assertRaises(PermissionDenied):

            aprobar_version(
                version.pk,
                self.editor,
            )


    def test_administrador_puede_observar(self):

        version = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        enviar_a_revision(
            version.pk,
            self.editor,
        )

        observar_version(
            version.pk,
            self.administrador,
            "Ampliar descripción",
        )

        version.refresh_from_db()

        self.assertEqual(
            version.estado,
            VersionAtractivo.Estado.OBSERVADA,
        )

        self.assertTrue(version.es_editable)

        self.assertEqual(
            version.observaciones,
            "Ampliar descripción",
        )


    def test_editor_puede_corregir_y_reenviar(self):

        version = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        enviar_a_revision(
            version.pk,
            self.editor,
        )

        observar_version(
            version.pk,
            self.administrador,
            "Corregir contenido",
        )

        version.refresh_from_db()

        version.descripcion = "Contenido corregido"

        version.save()

        enviar_a_revision(
            version.pk,
            self.editor,
        )

        version.refresh_from_db()

        self.assertEqual(
            version.estado,
            VersionAtractivo.Estado.PENDIENTE,
        )


    # ==============================================
    # APROBACIÓN Y PUBLICACIÓN
    # ==============================================

    def test_administrador_puede_publicar(self):

        version = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        version.descripcion = "Contenido actualizado"

        version.save()

        enviar_a_revision(
            version.pk,
            self.editor,
        )

        aprobar_version(
            version.pk,
            self.administrador,
        )

        version.refresh_from_db()

        self.atractivo.refresh_from_db()

        self.assertEqual(
            version.estado,
            VersionAtractivo.Estado.APROBADA,
        )

        self.assertEqual(
            self.atractivo.version_publicada_id,
            version.pk,
        )

        self.assertEqual(
            self.atractivo.descripcion,
            "Contenido actualizado",
        )

        respuesta = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": self.atractivo.slug},
            )
        )

        self.assertEqual(
            respuesta.json()["descripcion"],
            "Contenido actualizado",
        )


    def test_no_permite_autoaprobacion(self):

        version = crear_version(
            self.atractivo.pk,
            self.administrador,
        )

        enviar_a_revision(
            version.pk,
            self.administrador,
        )

        with self.assertRaises(ValidationError):

            aprobar_version(
                version.pk,
                self.administrador,
            )


    def test_conserva_version_anterior(self):

        version = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        enviar_a_revision(
            version.pk,
            self.editor,
        )

        aprobar_version(
            version.pk,
            self.administrador,
        )

        self.assertTrue(
            VersionAtractivo.objects.filter(
                pk=self.version_inicial.pk,
                estado=VersionAtractivo.Estado.APROBADA,
            ).exists()
        )

        self.assertEqual(
            self.atractivo.versiones.count(),
            2,
        )


    def test_administrador_puede_retirar_publicacion(self):

        retirar_publicacion(
            self.atractivo.pk,
            self.administrador,
        )

        self.atractivo.refresh_from_db()

        self.assertFalse(
            self.atractivo.publicado
        )

        respuesta = self.client.get(
            reverse(
                "atractivo-detail",
                kwargs={"slug": self.atractivo.slug},
            )
        )

        self.assertEqual(
            respuesta.status_code,
            404,
        )


    # ==============================================
    # SEGURIDAD DEL PANEL
    # ==============================================

    def test_editor_no_accede_a_usuarios(self):

        self.client.force_login(self.editor)

        respuesta = self.client.get(
            reverse("gestion_usuarios")
        )

        self.assertEqual(
            respuesta.status_code,
            403,
        )


    def test_editor_no_aprueba_mediante_post(self):

        version = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        enviar_a_revision(
            version.pk,
            self.editor,
        )

        self.client.force_login(self.editor)

        respuesta = self.client.post(
            reverse(
                "version_aprobar",
                kwargs={"version_id": version.pk},
            )
        )

        self.assertEqual(
            respuesta.status_code,
            403,
        )


    def test_version_pendiente_no_se_edita(self):

        version = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        enviar_a_revision(
            version.pk,
            self.editor,
        )

        self.client.force_login(self.editor)

        respuesta = self.client.post(
            reverse(
                "version_editar",
                kwargs={"version_id": version.pk},
            ),
            {
                "descripcion": "Cambio no autorizado",
            },
        )

        self.assertEqual(
            respuesta.status_code,
            302,
        )

        version.refresh_from_db()

        self.assertEqual(
            version.descripcion,
            "Descripción original",
        )


    def test_admin_no_modifica_catalogo_directamente(self):

        self.client.force_login(
            self.administrador
        )

        respuesta = self.client.post(
            reverse(
                "admin:catalog_atractivo_change",
                args=[self.atractivo.pk],
            ),
            {
                "nombre": "Cambio directo",
            },
        )

        self.assertEqual(
            respuesta.status_code,
            403,
        )

        self.atractivo.refresh_from_db()

        self.assertEqual(
            self.atractivo.nombre,
            "Museo de Casablanca",
        )


    # ==============================================
    # AUDITORÍA
    # ==============================================

    def test_registra_eventos_editoriales(self):

        version = crear_version(
            self.atractivo.pk,
            self.editor,
        )

        enviar_a_revision(
            version.pk,
            self.editor,
        )

        aprobar_version(
            version.pk,
            self.administrador,
        )

        acciones = list(
            EventoEditorial.objects.filter(
                version=version
            ).values_list(
                "accion",
                flat=True,
            )
        )

        self.assertIn("creacion", acciones)

        self.assertIn("envio", acciones)

        self.assertIn("aprobacion", acciones)


    # ==============================================
    # PROTECCIÓN MULTIMEDIA
    # ==============================================

    def test_imagen_borrador_no_es_publica(self):

        with TemporaryDirectory() as directorio:

            with override_settings(
                MEDIA_ROOT=directorio
            ):

                version = crear_version(
                    self.atractivo.pk,
                    self.editor,
                )

                imagen = ImagenVersionAtractivo.objects.create(
                    version=version,
                    imagen=SimpleUploadedFile(
                        "prueba.png",
                        b"contenido-de-prueba",
                        content_type="image/png",
                    ),
                )

                respuesta = self.client.get(
                    imagen.imagen.url
                )

                self.assertEqual(
                    respuesta.status_code,
                    404,
                )

                self.client.force_login(self.editor)

                respuesta = self.client.get(
                    imagen.imagen.url
                )

                self.assertEqual(
                    respuesta.status_code,
                    200,
                )

                respuesta.close()