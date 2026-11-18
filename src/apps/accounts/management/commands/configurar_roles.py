
from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Configura los grupos y permisos del catálogo turístico."

    def handle(self, *args, **options):
        permisos_editor = {
            "categoria": ["add", "change", "view"],
            "atractivo": ["add", "change", "view"],
            "imagenatractivo": ["add", "change", "view"],
            "seccionatractivo": ["add", "change", "view"],
            "recomendacionatractivo": ["add", "change", "view"],
        }

        permisos_admin = {
            modelo: ["add", "change", "delete", "view"]
            for modelo in permisos_editor
        }

        self.configurar_grupo(
            "Editores de contenido",
            permisos_editor,
        )

        self.configurar_grupo(
            "Administradores",
            permisos_admin,
        )
        
        grupo_admin = Group.objects.get(name="Administradores")
        permisos_editoriales = Permission.objects.filter(
            content_type__app_label="catalog",
            codename__in=[
                "aprobar_version",
                "observar_version",
            ]
        )
        grupo_admin.permissions.add(*permisos_editoriales)

        self.stdout.write(
            self.style.SUCCESS(
                "Grupos y permisos configurados correctamente."
            )
        )

    def configurar_grupo(self, nombre, configuracion):
        permisos = []

        for modelo, acciones in configuracion.items():
            for accion in acciones:
                codename = f"{accion}_{modelo}"

                try:
                    permiso = Permission.objects.get(
                        content_type__app_label="catalog",
                        codename=codename,
                    )
                except Permission.DoesNotExist:
                    raise CommandError(
                        f"No existe el permiso catalog.{codename}. "
                        "Comprueba que las migraciones estén aplicadas."
                    )

                permisos.append(permiso)

        grupo, creado = Group.objects.get_or_create(
            name=nombre
        )

        grupo.permissions.set(permisos)

        estado = "creado" if creado else "actualizado"

        self.stdout.write(
            f"{nombre}: {estado}, "
            f"{len(permisos)} permisos asignados."
        )
