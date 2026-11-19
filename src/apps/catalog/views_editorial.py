from django.contrib import messages
from django.core.exceptions import PermissionDenied, ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST

from apps.audit.models import EventoEditorial

from .forms import (
    VersionAtractivoForm,
    ImagenVersionFormSet,
    SeccionVersionFormSet,
    RecomendacionVersionFormSet,
    ObservacionEditorialForm,
)

from .models import Atractivo, VersionAtractivo

from .permissions import (
    es_funcionario,
    es_administrador,
)

from .services import (
    crear_version,
    enviar_a_revision,
    observar_version,
    aprobar_version,
    retirar_publicacion,
    registrar_evento,
    obtener_version_bloqueada,
)

from .views_gestion import requiere_permiso


# ==================================================
# CREAR ATRACTIVO
# ==================================================

@requiere_permiso(es_funcionario)
@transaction.atomic
def atractivo_crear(request):

    form = VersionAtractivoForm(
        request.POST
        if request.method == "POST"
        else None
    )

    if request.method == "POST" and form.is_valid():

        atractivo = Atractivo.objects.create(
            nombre=form.cleaned_data["nombre"],
            descripcion=form.cleaned_data["descripcion"],
            categoria=form.cleaned_data["categoria"],
            zona=form.cleaned_data["zona"],
            direccion=form.cleaned_data["direccion"],
            publicado=False,
        )

        version = crear_version(
            atractivo.pk,
            request.user,
        )

        messages.success(
            request,
            "Borrador creado correctamente.",
        )

        return redirect(
            "version_editar",
            version_id=version.pk,
        )

    return render(
        request,
        "gestion/editorial_crear.html",
        {"form": form},
    )


# ==================================================
# CONSULTAR HISTORIAL
# ==================================================

@requiere_permiso(es_funcionario)
def atractivo_editar(request, pk):

    atractivo = get_object_or_404(
        Atractivo,
        pk=pk,
    )

    versiones = atractivo.versiones.select_related(
        "creado_por",
        "revisado_por",
    )

    return render(
        request,
        "gestion/editorial_historial.html",
        {
            "atractivo": atractivo,
            "versiones": versiones,
            "es_administrador": es_administrador(
                request.user
            ),
        },
    )


# ==================================================
# CREAR NUEVA VERSIÓN
# ==================================================

@requiere_permiso(es_funcionario)
@require_POST
def version_crear(request, pk):

    atractivo = get_object_or_404(
        Atractivo,
        pk=pk,
    )

    version = crear_version(
        atractivo.pk,
        request.user,
    )

    return redirect(
        "version_editar",
        version_id=version.pk,
    )


# ==================================================
# EDITAR VERSIÓN
# ==================================================

@requiere_permiso(es_funcionario)
@transaction.atomic
def version_editar(request, version_id):

    get_object_or_404(
        VersionAtractivo,
        pk=version_id,
    )

    atractivo, version = obtener_version_bloqueada(
        version_id
    )

    if not version.es_editable:

        messages.info(
            request,
            "Esta versión no permite modificaciones.",
        )

        return redirect(
            "version_detalle",
            version_id=version.pk,
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

    form = VersionAtractivoForm(
        datos,
        instance=version,
    )

    imagenes = ImagenVersionFormSet(
        datos,
        archivos,
        instance=version,
        prefix="imagenes",
    )

    secciones = SeccionVersionFormSet(
        datos,
        instance=version,
        prefix="secciones",
    )

    recomendaciones = RecomendacionVersionFormSet(
        datos,
        instance=version,
        prefix="recomendaciones",
    )

    if request.method == "POST":

        resultados = [
            form.is_valid(),
            imagenes.is_valid(),
            secciones.is_valid(),
            recomendaciones.is_valid(),
        ]

        if all(resultados):

            version = form.save()

            # Evita conflictos al cambiar la portada.
            imagenes.instance.imagenes.filter(
                es_portada=True
            ).update(es_portada=False)

            imagenes_guardadas = imagenes.save(
                commit=False
            )

            for imagen in imagenes.deleted_objects:
                imagen.delete()

            for imagen in imagenes_guardadas:
                imagen.es_portada = False
                imagen.save()

            for formulario in imagenes.forms:

                datos_imagen = formulario.cleaned_data

                if (
                    datos_imagen
                    and not datos_imagen.get("DELETE")
                    and datos_imagen.get("es_portada")
                    and formulario.instance.pk
                ):
                    version.imagenes.filter(
                        pk=formulario.instance.pk
                    ).update(es_portada=True)

            secciones.save()

            recomendaciones.save()

            registrar_evento(
                atractivo=atractivo,
                version=version,
                usuario=request.user,
                accion=EventoEditorial.Accion.EDICION,
                descripcion="Contenido editorial actualizado.",
            )

            messages.success(
                request,
                "Versión guardada correctamente.",
            )

            return redirect(
                "version_detalle",
                version_id=version.pk,
            )

    return render(
        request,
        "gestion/editorial_form.html",
        {
            "atractivo": atractivo,
            "version": version,
            "form": form,
            "imagenes": imagenes,
            "secciones": secciones,
            "recomendaciones": recomendaciones,
        },
    )


# ==================================================
# DETALLE DE VERSIÓN
# ==================================================

@requiere_permiso(es_funcionario)
def version_detalle(request, version_id):

    version = get_object_or_404(
        VersionAtractivo.objects.select_related(
            "atractivo",
            "categoria",
            "creado_por",
            "revisado_por",
        ).prefetch_related(
            "imagenes",
            "secciones",
            "recomendaciones",
            "eventos_editoriales",
        ),
        pk=version_id,
    )

    # Administradores y superusuarios pueden publicar directamente,
    # incluida su propia versión. Los editores no tienen este permiso.
    puede_aprobar = (
        es_administrador(request.user)
        and request.user.has_perm(
            "catalog.aprobar_version"
        )
    )

    puede_observar = (
        es_administrador(request.user)
        and request.user.has_perm(
            "catalog.observar_version"
        )
    )

    return render(
        request,
        "gestion/editorial_detalle.html",
        {
            "version": version,
            "puede_aprobar": puede_aprobar,
            "puede_observar": puede_observar,
            "observacion_form": ObservacionEditorialForm(),
        },
    )


# ==================================================
# ENVIAR A REVISIÓN
# ==================================================

@requiere_permiso(es_funcionario)
@require_POST
def version_enviar(request, version_id):

    get_object_or_404(
        VersionAtractivo,
        pk=version_id,
    )

    try:

        enviar_a_revision(
            version_id,
            request.user,
        )

        messages.success(
            request,
            "Versión enviada a revisión.",
        )

    except ValidationError as error:

        messages.error(
            request,
            " ".join(error.messages),
        )

    return redirect(
        "version_detalle",
        version_id=version_id,
    )


# ==================================================
# APROBAR VERSIÓN
# ==================================================

@requiere_permiso(es_administrador)
@require_POST
def version_aprobar(request, version_id):

    get_object_or_404(
        VersionAtractivo,
        pk=version_id,
    )

    try:

        aprobar_version(
            version_id,
            request.user,
        )

        messages.success(
            request,
            "Versión aprobada y publicada.",
        )

    except ValidationError as error:

        messages.error(
            request,
            " ".join(error.messages),
        )

    return redirect(
        "version_detalle",
        version_id=version_id,
    )


# ==================================================
# SOLICITAR CORRECCIONES
# ==================================================

@requiere_permiso(es_administrador)
@require_POST
def version_observar(request, version_id):

    get_object_or_404(
        VersionAtractivo,
        pk=version_id,
    )

    form = ObservacionEditorialForm(request.POST)

    if form.is_valid():

        try:

            observar_version(
                version_id,
                request.user,
                form.cleaned_data["observaciones"],
            )

            messages.success(
                request,
                "Versión devuelta al equipo editorial.",
            )

        except ValidationError as error:

            messages.error(
                request,
                " ".join(error.messages),
            )

    else:

        messages.error(
            request,
            "Debes ingresar observaciones válidas.",
        )

    return redirect(
        "version_detalle",
        version_id=version_id,
    )


# ==================================================
# RETIRAR PUBLICACIÓN
# ==================================================

@requiere_permiso(es_administrador)
@require_POST
def atractivo_retirar(request, pk):

    get_object_or_404(Atractivo, pk=pk)

    try:

        retirar_publicacion(
            pk,
            request.user,
        )

        messages.success(
            request,
            "Publicación retirada correctamente.",
        )

    except ValidationError as error:

        messages.error(
            request,
            " ".join(error.messages),
        )

    return redirect(
        "atractivo_editar",
        pk=pk,
    )