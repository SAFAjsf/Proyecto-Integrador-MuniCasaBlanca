from django.shortcuts import get_object_or_404, render

from .models import Atractivo


def atractivos_publicados():
    return (
        Atractivo.objects.filter(
            publicado=True,
            categoria__activa=True,
        )
        .select_related("categoria")
        .prefetch_related(
            "imagenes",
            "secciones",
            "recomendaciones",
        )
    )


def inicio(request):
    return render(request, "index.html")


def atractivos(request):
    base = atractivos_publicados()

    return render(
        request,
        "atractivos.html",
        {
            "atractivos": base.filter(
                zona=Atractivo.Zona.CASABLANCA
            ),
            "atractivos_quintay": base.filter(
                zona=Atractivo.Zona.QUINTAY
            ),
        },
    )


def atractivo_detalle(request, slug):
    atractivo = get_object_or_404(
        atractivos_publicados(),
        slug=slug,
    )

    return render(
        request,
        "gestion/atractivo_detalle.html",
        {"atractivo": atractivo},
    )


def como_llegar(request):
    return render(request, "como-llegar.html")


def historia(request):
    return render(request, "historia.html")


def noticias(request):
    return render(request, "noticias.html")


def quintay(request):
    return render(request, "quintay.html")


def ruta_vino(request):
    return render(request, "ruta-vino.html")


def vinas(request):
    return render(request, "vinas.html")

def clima(request):
    return render(request, "clima.html")