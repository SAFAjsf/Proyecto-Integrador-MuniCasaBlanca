from django.contrib.auth import get_user_model
from django.contrib import messages
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.views import LoginView
from django.db import models
from django.db.models import Count
from django.shortcuts import get_object_or_404, redirect, render

from .forms import AtractivoForm, FuncionarioAuthenticationForm, ImagenFormSet, UsuarioForm
from .models import Atractivo
from .permissions import es_administrador, es_funcionario, rol_de

Usuario = get_user_model()


# ============================ SITIO PÚBLICO ============================

def inicio(request):
    return render(request, "index.html")


def atractivos(request):
    # QuerySet base: publicado, de categoría activa, con su categoría e imágenes.
    base = (
        Atractivo.objects
        .filter(publicado=True, categoria__activa=True)
        .select_related("categoria")
        .prefetch_related("imagenes", "secciones", "recomendaciones")
    )

    # Un solo QuerySet base, dos filtros: evita escribir la consulta dos veces.
    return render(request, "atractivos.html", {
        "atractivos": base.filter(zona=Atractivo.Zona.CASABLANCA),
        "atractivos_quintay": base.filter(zona=Atractivo.Zona.QUINTAY),
    })


def atractivo_detalle(request, slug):
    atractivo = get_object_or_404(
        Atractivo.objects
        .select_related("categoria")
        .prefetch_related("imagenes", "secciones", "recomendaciones"),
        slug=slug,
        publicado=True,
    )
    return render(request, "gestion/atractivo_detalle.html", {"atractivo": atractivo})


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


# ============================== LOGIN ==============================

class FuncionarioLoginView(LoginView):
    template_name = "resgistration/login.html"
    authentication_form = FuncionarioAuthenticationForm
    redirect_authenticated_user = True


# ============================ PANEL PRIVADO ============================

@user_passes_test(es_funcionario, login_url="login")
def gestion_dashboard(request):
    resumen = Atractivo.objects.aggregate(
        total=Count("id"),
        publicados=Count("id", filter=models.Q(publicado=True)),
    )
    return render(request, "gestion/dashboard.html", resumen)


@user_passes_test(es_funcionario, login_url="login")
def gestion_atractivos(request):
    atractivos = Atractivo.objects.select_related("categoria")
    return render(request, "gestion/atractivo_list.html", {"atractivos": atractivos})


@user_passes_test(es_funcionario, login_url="login")
def atractivo_crear(request):
    form = AtractivoForm(request.POST or None)
    formset = ImagenFormSet(request.POST or None, request.FILES or None)

    if request.method == "POST" and form.is_valid() and formset.is_valid():
        atractivo = form.save()
        # La instancia se asigna ANTES de guardar el formset:
        # así cada imagen queda ligada al atractivo recién creado.
        formset.instance = atractivo
        formset.save()

        messages.success(request, "Atractivo creado correctamente.")
        return redirect("gestion_atractivos")

    return render(
        request,
        "gestion/atractivo_form.html",
        {"form": form, "formset": formset, "titulo": "Nuevo atractivo"},
    )


@user_passes_test(es_funcionario, login_url="login")
def atractivo_editar(request, pk):
    atractivo = get_object_or_404(Atractivo, pk=pk)
    form = AtractivoForm(request.POST or None, instance=atractivo)
    formset = ImagenFormSet(
        request.POST or None,
        request.FILES or None,
        instance=atractivo,
    )

    if request.method == "POST" and form.is_valid() and formset.is_valid():
        form.save()
        formset.save()
        messages.success(request, "Atractivo actualizado correctamente.")
        return redirect("gestion_atractivos")

    return render(
        request,
        "gestion/atractivo_form.html",
        {"form": form, "formset": formset, "titulo": "Editar atractivo"},
    )


@user_passes_test(es_funcionario, login_url="login")
def atractivo_eliminar(request, pk):
    atractivo = get_object_or_404(Atractivo, pk=pk)

    if request.method == "POST":
        atractivo.delete()
        messages.success(request, "Atractivo eliminado correctamente.")
        return redirect("gestion_atractivos")

    return render(
        request,
        "gestion/atractivo_confirm_delete.html",
        {"atractivo": atractivo},
    )

# =========================== USUARIOS DEL PANEL ===========================

@user_passes_test(es_administrador, login_url="login")
def gestion_usuarios(request):
    busqueda = request.GET.get("q", "").strip()

    usuarios = Usuario.objects.prefetch_related("groups").order_by("username")

    if busqueda:
        usuarios = usuarios.filter(
            models.Q(username__icontains=busqueda)
            | models.Q(first_name__icontains=busqueda)
            | models.Q(last_name__icontains=busqueda)
            | models.Q(email__icontains=busqueda)
        )

    # Se arma la fila ya calculada: el template no tiene que adivinar el rol.
    filas = []
    for usuario in usuarios:
        nombre = usuario.get_full_name().strip() or usuario.username
        iniciales = "".join(parte[0] for parte in nombre.split()[:2]).upper()

        filas.append({
            "usuario": usuario,
            "rol": rol_de(usuario),
            "nombre": nombre,
            "iniciales": iniciales,
        })

    return render(request, "gestion/usuario_list.html", {
        "filas": filas,
        "busqueda": busqueda,
    })


@user_passes_test(es_administrador, login_url="login")
def usuario_crear(request):
    form = UsuarioForm(
        request.POST or None,
        usuario_actual=request.user,
    )

    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Usuario creado correctamente.")
        return redirect("gestion_usuarios")

    return render(
        request,
        "gestion/usuario_form.html",
        {"form": form, "titulo": "Nuevo usuario"},
    )


@user_passes_test(es_administrador, login_url="login")
def usuario_editar(request, pk):
    usuario = get_object_or_404(Usuario, pk=pk)

    form = UsuarioForm(
        request.POST or None,
        instance=usuario,
        usuario_actual=request.user,
    )

    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Usuario actualizado correctamente.")
        return redirect("gestion_usuarios")

    return render(
        request,
        "gestion/usuario_form.html",
        {"form": form, "titulo": "Editar usuario", "usuario": usuario},
    )


@user_passes_test(es_administrador, login_url="login")
def usuario_eliminar(request, pk):
    usuario = get_object_or_404(Usuario, pk=pk)

    # No puedes borrar tu propia cuenta.
    if usuario == request.user:
        messages.error(request, "No puedes eliminar tu propia cuenta.")
        return redirect("gestion_usuarios")

    # Nunca dejar el sistema sin superusuario.
    if usuario.is_superuser and Usuario.objects.filter(is_superuser=True).count() <= 1:
        messages.error(request, "No puedes eliminar al último superusuario.")
        return redirect("gestion_usuarios")

    if request.method == "POST":
        usuario.delete()
        messages.success(request, "Usuario eliminado correctamente.")
        return redirect("gestion_usuarios")

    return render(
        request,
        "gestion/usuario_confirm_delete.html",
        {"usuario": usuario},
    )