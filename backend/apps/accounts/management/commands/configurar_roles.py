from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

from apps.catalog.models import Categoria, Atractivo


class Command(BaseCommand):
    help = "Configura los grupos y permisos municipales"

    def handle(self, *args, **options):
        administradores, _ = Group.objects.get_or_create(
            name="Administradores"
        )

        editores, _ = Group.objects.get_or_create(
            name="Editores de contenido"
        )

        modelos = [Categoria, Atractivo]

        permisos_admin = []
        permisos_editor = []

        for modelo in modelos:
            content_type = ContentType.objects.get_for_model(modelo)

            for accion in ["add", "change", "delete", "view"]:
                permiso = Permission.objects.get(
                    content_type=content_type,
                    codename=f"{accion}_{modelo._meta.model_name}",
                )

                permisos_admin.append(permiso)

                if accion != "delete":
                    permisos_editor.append(permiso)

        administradores.permissions.set(permisos_admin)
        editores.permissions.set(permisos_editor)

        self.stdout.write(
            self.style.SUCCESS(
                "Roles municipales configurados correctamente."
            )
        )