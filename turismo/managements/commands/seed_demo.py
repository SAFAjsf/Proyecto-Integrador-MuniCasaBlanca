
from django.core.management.base import BaseCommand
from turismo.models import Atractivo, Categoria


class Command(BaseCommand):
    help = "Carga categorías y atractivos de ejemplo."

    def handle(self, *args, **options):
        datos = {
            "Patrimonio": ["Museo Arqueológico", "Lagunillas"],
            "Naturaleza": ["Humedal de El Jote", "Playa Grande"],
            "Religioso": ["Santuario de Lo Vásquez"],
        }

        for nombre_categoria, atractivos in datos.items():
            categoria, _ = Categoria.objects.get_or_create(nombre=nombre_categoria)

            for nombre in atractivos:
                Atractivo.objects.get_or_create(
                    nombre=nombre,
                    defaults={
                        "descripcion": f"Descripción de {nombre}.",
                        "categoria": categoria,
                        "publicado": True,
                    },
                )

        self.stdout.write(self.style.SUCCESS("Datos de ejemplo cargados."))