from functools import wraps

from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.views import LoginView, redirect_to_login
from django.core.exceptions import PermissionDenied
from django.db import models, transaction
from django.db.models import Count
from django.shortcuts import get_object_or_404, redirect, render

from .forms import (
    AtractivoForm,
    FuncionarioAuthenticationForm,
    ImagenFormSet,
    UsuarioForm,
)

from .models import Atractivo

from .permissions import (
    es_administrador,
    es_funcionario,
    puede_gestionar_usuarios,
    rol_de,
)


Usuario = get_user_model()


# ==================================================
# CONTROL DE ACCESO
# ==================================================

def requiere_permiso(comprobar_permiso):
    """
    Redirige al login a usuarios anónimos.
    Devuelve HTTP 403 a usuarios sin autorización.
    """

    def decorador(vista):

        @wraps(vista)
        def vista_protegida(request, *args, **kwargs):

            if not request.user.is_authenticated:
                return redirect_to_login(
                    request.get_full_path()
                )

            if not comprobar_permiso(request.user):
                raise PermissionDenied(
                    "No tienes permisos para realizar esta acción."
                )

            return vista(request, *args, **kwargs)

        return vista_protegida

    return decorador


# ==================================================
# AUTENTICACIÓN MUNICIPAL
# ==================================================

class FuncionarioLoginView(LoginView):

    template_name = "registration/login.html"

    authentication_form = FuncionarioAuthenticationForm

    redirect_authenticated_user = False


# ==================================================
# DASHBOARD MUNICIPAL
# ==================================================

@requiere_permiso(es_funcionario)
def gestion_dashboard(request):

    resumen = Atractivo.objects.aggregate(
        total=Count("id"),

        publicados=Count(
            "id",
            filter=models.Q(publicado=True),
        ),

        borradores=Count(
            "id",
            filter=models.Q(publicado=False),
        ),
    )

    resumen["es_administrador"] = es_administrador(
        request.user
    )

    return render(
        request,
        "gestion/dashboard.html",
        resumen,
    )


# ==================================================
# LISTADO DE ATRACTIVOS
# ==================================================

@requiere_permiso(es_funcionario)
def gestion_atractivos(request):

    atractivos = (
        Atractivo.objects
        .select_related("categoria")
        .order_by("nombre")
    )

    busqueda = request.GET.get("q", "").strip()
    zona = request.GET.get("zona", "").strip()

    if busqueda:
        atractivos = atractivos.filter(
            models.Q(nombre__icontains=busqueda)
            | models.Q(descripcion__icontains=busqueda)
            | models.Q(categoria__nombre__icontains=busqueda)
            | models.Q(direccion__icontains=busqueda)
        )

    if zona in Atractivo.Zona.values:
        atractivos = atractivos.filter(zona=zona)

    return render(
        request,
        "gestion/atractivo_list.html",
        {
            "atractivos": atractivos,
            "busqueda": busqueda,
            "zona": zona,
            "es_administrador": es_administrador(
                request.user
            ),
        },
    )


# ==================================================
# CREAR ATRACTIVO
# ==================================================

@requiere_permiso(es_funcionario)
@transaction.atomic
def atractivo_crear(request):

    administrador = es_administrador(request.user)

    datos = (
        request.POST
        if request.method == "POST"
        else None
    )

    archivos = (
        request.FILES
        if request.method == "POST"
        else None
    )

    form = AtractivoForm(datos)

    # Los editores no pueden publicar directamente.
    if not administrador:
        if "publicado" in form.fields:
            form.fields["publicado"].disabled = True
            form.fields["publicado"].initial = False

    formset = ImagenFormSet(
        datos,
        archivos,
        instance=form.instance,
    )

    if request.method == "POST":

        formulario_valido = form.is_valid()
        imagenes_validas = formset.is_valid()

        if formulario_valido and imagenes_validas:

            atractivo = form.save(commit=False)

            if not administrador:
                atractivo.publicado = False

            atractivo.save()

            formset.instance = atractivo
            formset.save()

            messages.success(
                request,
                "Atractivo creado correctamente.",
            )

            return redirect("gestion_atractivos")

    return render(
        request,
        "gestion/atractivo_form.html",
        {
            "form": form,
            "formset": formset,
            "titulo": "Nuevo atractivo",
            "es_administrador": administrador,
        },
    )


# ==================================================
# EDITAR ATRACTIVO
# ==================================================

@requiere_permiso(es_funcionario)
@transaction.atomic
def atractivo_editar(request, pk):

    atractivo = get_object_or_404(
        Atractivo.objects.select_for_update(),
        pk=pk,
    )

    administrador = es_administrador(request.user)

    # Protección provisional de contenido publicado.
    # Se reemplazará con el flujo de versiones.
    if atractivo.publicado and not administrador:
        raise PermissionDenied(
            "No puedes modificar directamente "
            "un atractivo publicado."
        )

    datos = (
        request.POST
        if request.method == "POST"
        else None
    )

    archivos = (
        request.FILES
        if request.method == "POST"
        else None
    )

    form = AtractivoForm(
        datos,
        instance=atractivo,
    )

    if not administrador:

        if "publicado" in form.fields:
            form.fields["publicado"].disabled = True

    formset = ImagenFormSet(
        datos,
        archivos,
        instance=atractivo,
    )

    if request.method == "POST":

        formulario_valido = form.is_valid()
        imagenes_validas = formset.is_valid()

        if formulario_valido and imagenes_validas:

            atractivo = form.save(commit=False)

            if not administrador:
                atractivo.publicado = False

            atractivo.save()

            formset.instance = atractivo
            formset.save()

            messages.success(
                request,
                "Atractivo actualizado correctamente.",
            )

            return redirect("gestion_atractivos")

    return render(
        request,
        "gestion/atractivo_form.html",
        {
            "form": form,
            "formset": formset,
            "atractivo": atractivo,
            "titulo": "Editar atractivo",
            "es_administrador": administrador,
        },
    )


# ==================================================
# ELIMINAR ATRACTIVO
# ==================================================

@requiere_permiso(es_administrador)
@transaction.atomic
def atractivo_eliminar(request, pk):

    atractivo = get_object_or_404(
        Atractivo.objects.select_for_update(),
        pk=pk,
    )

    if request.method == "POST":

        atractivo.delete()

        messages.success(
            request,
            "Atractivo eliminado correctamente.",
        )

        return redirect("gestion_atractivos")

    return render(
        request,
        "gestion/atractivo_confirm_delete.html",
        {
            "atractivo": atractivo,
        },
    )


# ==================================================
# LISTADO DE USUARIOS
# ==================================================

@requiere_permiso(puede_gestionar_usuarios)
def gestion_usuarios(request):

    busqueda = request.GET.get("q", "").strip()

    usuarios = (
        Usuario.objects
        .prefetch_related("groups")
        .order_by("username")
    )

    if busqueda:

        usuarios = usuarios.filter(
            models.Q(username__icontains=busqueda)
            | models.Q(first_name__icontains=busqueda)
            | models.Q(last_name__icontains=busqueda)
            | models.Q(email__icontains=busqueda)
        )

    filas = []

    for usuario in usuarios:

        nombre = (
            usuario.get_full_name().strip()
            or usuario.username
        )

        iniciales = "".join(
            parte[0]
            for parte in nombre.split()[:2]
        ).upper()

        filas.append(
            {
                "usuario": usuario,
                "rol": rol_de(usuario),
                "nombre": nombre,
                "iniciales": iniciales,
            }
        )

    return render(
        request,
        "gestion/usuario_list.html",
        {
            "filas": filas,
            "busqueda": busqueda,
        },
    )


# ==================================================
# CREAR USUARIO
# ==================================================

@requiere_permiso(puede_gestionar_usuarios)
@transaction.atomic
def usuario_crear(request):

    form = UsuarioForm(
        request.POST
        if request.method == "POST"
        else None,
        usuario_actual=request.user,
    )

    if request.method == "POST" and form.is_valid():

        form.save()

        messages.success(
            request,
            "Usuario creado correctamente.",
        )

        return redirect("gestion_usuarios")

    return render(
        request,
        "gestion/usuario_form.html",
        {
            "form": form,
            "titulo": "Nuevo usuario",
        },
    )


# ==================================================
# EDITAR USUARIO
# ==================================================

@requiere_permiso(puede_gestionar_usuarios)
@transaction.atomic
def usuario_editar(request, pk):

    usuario = get_object_or_404(
        Usuario.objects.select_for_update(),
        pk=pk,
    )

    form = UsuarioForm(
        request.POST
        if request.method == "POST"
        else None,

        instance=usuario,

        usuario_actual=request.user,
    )

    if request.method == "POST" and form.is_valid():

        if usuario.is_superuser:
            superusuarios_restantes = (
                Usuario.objects
                .filter(
                    is_superuser=True,
                    is_active=True,
                )
                .exclude(pk=usuario.pk)
                .exists()
            )

            if (
                not form.cleaned_data["is_active"]
                and not superusuarios_restantes
            ):
                form.add_error(
                    "is_active",
                    "No puedes desactivar al último "
                    "superusuario activo.",
                )

            else:
                form.save()

                messages.success(
                    request,
                    "Usuario actualizado correctamente.",
                )

                return redirect("gestion_usuarios")

        else:

            form.save()

            messages.success(
                request,
                "Usuario actualizado correctamente.",
            )

            return redirect("gestion_usuarios")

    return render(
        request,
        "gestion/usuario_form.html",
        {
            "form": form,
            "titulo": "Editar usuario",
            "usuario": usuario,
        },
    )


# ==================================================
# ELIMINAR USUARIO
# ==================================================

@requiere_permiso(puede_gestionar_usuarios)
@transaction.atomic
def usuario_eliminar(request, pk):

    usuario = get_object_or_404(
        Usuario.objects.select_for_update(),
        pk=pk,
    )

    if usuario.pk == request.user.pk:

        messages.error(
            request,
            "No puedes eliminar tu propia cuenta.",
        )

        return redirect("gestion_usuarios")

    if usuario.is_superuser:

        existen_otros = (
            Usuario.objects
            .filter(
                is_superuser=True,
                is_active=True,
            )
            .exclude(pk=usuario.pk)
            .exists()
        )

        if not existen_otros:

            messages.error(
                request,
                "No puedes eliminar al último "
                "superusuario activo.",
            )

            return redirect("gestion_usuarios")

    if request.method == "POST":

        usuario.delete()

        messages.success(
            request,
            "Usuario eliminado correctamente.",
        )

        return redirect("gestion_usuarios")

    return render(
        request,
        "gestion/usuario_confirm_delete.html",
        {
            "usuario": usuario,
        },
    )