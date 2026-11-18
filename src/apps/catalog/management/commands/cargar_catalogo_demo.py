from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import (
    BaseCommand,
    CommandError,
)
from django.db import transaction
from django.db.models import Q

from apps.audit.models import EventoEditorial

from apps.catalog.models import (
    Categoria,
    Atractivo,
    ImagenAtractivo,
    SeccionAtractivo,
    RecomendacionAtractivo,
    VersionAtractivo,
    ImagenVersionAtractivo,
    SeccionVersionAtractivo,
    RecomendacionVersionAtractivo,
)

from .datos_catalogo import ATRACTIVOS


class Command(BaseCommand):

    help = (
        "Importa el catálogo turístico inicial "
        "con versionado y auditoría."
    )

    def add_arguments(self, parser):

        parser.add_argument(
            "--simular",
            action="store_true",
            help="Valida los archivos sin modificar la base de datos.",
        )

    def handle(self, *args, **options):

        creados = 0
        omitidos = 0
        imagenes = {}

        # Validar todas las imágenes antes de importar.

        for datos in ATRACTIVOS:

            nombre_imagen = datos["imagen"]

            rutas = [
                Path(settings.BASE_DIR)
                / "static" / "images" / "atractivos"
                / nombre_imagen,

                Path(settings.BASE_DIR)
                / "static" / "img" / "atractivos"
                / nombre_imagen,
            ]

            ruta = next(
                (ruta for ruta in rutas if ruta.is_file()),
                None,
            )

            if ruta is None:
                raise CommandError(
                    f"No se encontró la imagen {nombre_imagen}"
                )

            imagenes[nombre_imagen] = ruta

        self.stdout.write(
            self.style.SUCCESS(
                "Las ocho imágenes están disponibles."
            )
        )

        for datos in ATRACTIVOS:

            existe = Atractivo.objects.filter(
                Q(slug=datos["slug"])
                | Q(nombre__iexact=datos["nombre"])
            ).exists()

            if existe:

                omitidos += 1

                self.stdout.write(
                    self.style.WARNING(
                        f"Omitido: {datos['nombre']}"
                    )
                )

                continue

            if options["simular"]:

                self.stdout.write(
                    f"Se importaría: {datos['nombre']}"
                )

                continue

            self.importar_atractivo(
                datos,
                imagenes[datos["imagen"]],
            )

            creados += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"Importado: {datos['nombre']}"
                )
            )

        self.stdout.write("")
        self.stdout.write(f"Creados: {creados}")
        self.stdout.write(f"Omitidos: {omitidos}")

        if options["simular"]:
            self.stdout.write("Simulación finalizada.")
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    "Importación finalizada."
                )
            )

    def importar_atractivo(self, datos, ruta_imagen):

        archivo_guardado = None

        try:

            with transaction.atomic():

                categoria, _ = Categoria.objects.get_or_create(
                    nombre=datos["categoria"],
                    defaults={"activa": True},
                )

                if not categoria.activa:
                    raise CommandError(
                        f"Categoría inactiva: {categoria.nombre}"
                    )

                atractivo = Atractivo.objects.create(
                    nombre=datos["nombre"],
                    slug=datos["slug"],
                    descripcion=datos["descripcion"],
                    categoria=categoria,
                    zona=datos["zona"],
                    publicado=False,
                )

                version = VersionAtractivo.objects.create(
                    atractivo=atractivo,
                    numero_version=1,
                    nombre=atractivo.nombre,
                    descripcion=atractivo.descripcion,
                    categoria=categoria,
                    zona=atractivo.zona,
                    direccion=atractivo.direccion,
                    estado=VersionAtractivo.Estado.APROBADA,
                    importada=True,
                )

                imagen = ImagenAtractivo(
                    atractivo=atractivo,
                    texto_alternativo=atractivo.nombre,
                    es_portada=True,
                    orden=0,
                )

                with ruta_imagen.open("rb") as archivo:

                    imagen.imagen.save(
                        ruta_imagen.name,
                        File(archivo),
                        save=False,
                    )

                archivo_guardado = (
                    imagen.imagen.storage,
                    imagen.imagen.name,
                )

                imagen.save()

                ImagenVersionAtractivo.objects.create(
                    version=version,
                    imagen=imagen.imagen.name,
                    texto_alternativo=imagen.texto_alternativo,
                    es_portada=True,
                    orden=0,
                )

                for orden, seccion in enumerate(
                    datos["secciones"]
                ):

                    titulo, contenido = seccion

                    SeccionAtractivo.objects.create(
                        atractivo=atractivo,
                        titulo=titulo,
                        contenido=contenido,
                        orden=orden,
                    )

                    SeccionVersionAtractivo.objects.create(
                        version=version,
                        titulo=titulo,
                        contenido=contenido,
                        orden=orden,
                    )

                for orden, texto in enumerate(
                    datos["recomendaciones"]
                ):

                    RecomendacionAtractivo.objects.create(
                        atractivo=atractivo,
                        texto=texto,
                        orden=orden,
                    )

                    RecomendacionVersionAtractivo.objects.create(
                        version=version,
                        texto=texto,
                        orden=orden,
                    )

                atractivo.version_publicada = version
                atractivo.publicado = True

                atractivo.save()

                EventoEditorial.objects.create(
                    atractivo=atractivo,
                    version=version,
                    usuario=None,
                    accion=EventoEditorial.Accion.IMPORTACION,
                    descripcion=(
                        "Importación inicial del catálogo "
                        "turístico de demostración."
                    ),
                )

        except Exception:

            if archivo_guardado is not None:
                storage, nombre = archivo_guardado
                storage.delete(nombre)

            raise