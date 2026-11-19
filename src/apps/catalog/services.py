from django.core.exceptions import PermissionDenied, ValidationError
from django.db import transaction
from django.db.models import Max
from django.utils import timezone

from apps.audit.models import EventoEditorial

from .models import (
    Atractivo,
    VersionAtractivo,
    ImagenAtractivo,
    SeccionAtractivo,
    RecomendacionAtractivo,
    ImagenVersionAtractivo,
    SeccionVersionAtractivo,
    RecomendacionVersionAtractivo,
)

from .permissions import (
    es_funcionario,
    es_administrador,
)


# ==================================================
# AUDITORÍA EDITORIAL
# ==================================================

def registrar_evento(
    atractivo,
    version,
    usuario,
    accion,
    descripcion="",
):
    return EventoEditorial.objects.create(
        atractivo=atractivo,
        version=version,
        usuario=usuario,
        accion=accion,
        descripcion=descripcion,
    )


# ==================================================
# BLOQUEO DE REGISTROS
# ==================================================

def obtener_version_bloqueada(version_id):

    atractivo_id = VersionAtractivo.objects.values_list(
        "atractivo_id",
        flat=True,
    ).get(pk=version_id)

    atractivo = Atractivo.objects.select_for_update().get(
        pk=atractivo_id,
    )

    version = VersionAtractivo.objects.select_for_update().get(
        pk=version_id,
        atractivo=atractivo,
    )

    return atractivo, version


# ==================================================
# CREAR NUEVA VERSIÓN
# ==================================================

@transaction.atomic
def crear_version(atractivo_id, usuario):

    if not es_funcionario(usuario):
        raise PermissionDenied(
            "No tienes permisos para crear versiones."
        )

    atractivo = Atractivo.objects.select_for_update().get(
        pk=atractivo_id,
    )

    version_existente = atractivo.version_en_edicion

    if version_existente:
        return version_existente

    origen = atractivo.version_publicada

    if origen is None:
        origen = atractivo

    ultimo_numero = (
        atractivo.versiones.aggregate(
            ultimo=Max("numero_version"),
        )["ultimo"] or 0
    )

    version = VersionAtractivo.objects.create(
        atractivo=atractivo,
        numero_version=ultimo_numero + 1,
        nombre=origen.nombre,
        descripcion=origen.descripcion,
        categoria=origen.categoria,
        direccion=origen.direccion,
        zona=origen.zona,
        estado=VersionAtractivo.Estado.BORRADOR,
        creado_por=usuario,
    )

    ImagenVersionAtractivo.objects.bulk_create([
        ImagenVersionAtractivo(
            version=version,
            imagen=imagen.imagen.name,
            texto_alternativo=imagen.texto_alternativo,
            es_portada=imagen.es_portada,
            orden=imagen.orden,
        )
        for imagen in origen.imagenes.all()
    ])

    SeccionVersionAtractivo.objects.bulk_create([
        SeccionVersionAtractivo(
            version=version,
            titulo=seccion.titulo,
            contenido=seccion.contenido,
            orden=seccion.orden,
        )
        for seccion in origen.secciones.all()
    ])

    RecomendacionVersionAtractivo.objects.bulk_create([
        RecomendacionVersionAtractivo(
            version=version,
            texto=recomendacion.texto,
            orden=recomendacion.orden,
        )
        for recomendacion in origen.recomendaciones.all()
    ])

    registrar_evento(
        atractivo=atractivo,
        version=version,
        usuario=usuario,
        accion=EventoEditorial.Accion.CREACION,
        descripcion=(
            f"Creación de versión {version.numero_version}."
        ),
    )

    return version


# ==================================================
# ENVIAR A REVISIÓN
# ==================================================

@transaction.atomic
def enviar_a_revision(version_id, usuario):

    if not es_funcionario(usuario):
        raise PermissionDenied(
            "No puedes enviar versiones a revisión."
        )

    atractivo, version = obtener_version_bloqueada(
        version_id
    )

    if not version.es_editable:
        raise ValidationError(
            "Esta versión no puede enviarse a revisión."
        )

    version.full_clean()

    version.estado = VersionAtractivo.Estado.PENDIENTE

    version.fecha_envio = timezone.now()

    version.revisado_por = None

    version.fecha_revision = None

    version.save()

    registrar_evento(
        atractivo=atractivo,
        version=version,
        usuario=usuario,
        accion=EventoEditorial.Accion.ENVIO,
        descripcion="Versión enviada a revisión.",
    )

    return version


# ==================================================
# SOLICITAR CORRECCIONES
# ==================================================

@transaction.atomic
def observar_version(
    version_id,
    usuario,
    observaciones,
):

    if (
        not es_administrador(usuario)
        or not usuario.has_perm("catalog.observar_version")
    ):
        raise PermissionDenied(
            "No tienes permisos para revisar versiones."
        )

    atractivo, version = obtener_version_bloqueada(
        version_id
    )

    if version.estado != VersionAtractivo.Estado.PENDIENTE:
        raise ValidationError(
            "Solo puedes revisar versiones pendientes."
        )

    observaciones = observaciones.strip()

    if not observaciones:
        raise ValidationError(
            "Debes indicar las correcciones necesarias."
        )

    version.estado = VersionAtractivo.Estado.OBSERVADA

    version.observaciones = observaciones

    version.revisado_por = usuario

    version.fecha_revision = timezone.now()

    version.save(
        update_fields=[
            "estado",
            "observaciones",
            "revisado_por",
            "fecha_revision",
            "fecha_actualizacion",
        ]
    )

    registrar_evento(
        atractivo=atractivo,
        version=version,
        usuario=usuario,
        accion=EventoEditorial.Accion.OBSERVACION,
        descripcion=observaciones,
    )

    return version


# ==================================================
# APROBAR Y PUBLICAR
# ==================================================

@transaction.atomic
def aprobar_version(version_id, usuario):

    if (
        not es_administrador(usuario)
        or not usuario.has_perm("catalog.aprobar_version")
    ):
        raise PermissionDenied(
            "No tienes permisos para publicar versiones."
        )

    atractivo, version = obtener_version_bloqueada(
        version_id
    )

    # Los administradores y superusuarios pueden publicar directamente,
    # sin pasar por revisión ni depender de otro administrador.
    # Los editores no llegan aquí: la vista exige el permiso
    # catalog.aprobar_version.

    estados_aprobables = (
        VersionAtractivo.Estado.BORRADOR,
        VersionAtractivo.Estado.OBSERVADA,
        VersionAtractivo.Estado.PENDIENTE,
    )

    if version.estado not in estados_aprobables:
        raise ValidationError(
            "Esta versión no se puede aprobar."
        )

    if not version.categoria.activa:
        raise ValidationError(
            "No puedes publicar en una categoría inactiva."
        )

    version.full_clean()

    # Actualizamos los datos públicos del atractivo.
    # El slug permanece intacto.

    atractivo.nombre = version.nombre

    atractivo.descripcion = version.descripcion

    atractivo.categoria = version.categoria

    atractivo.direccion = version.direccion

    atractivo.zona = version.zona

    # Reemplazamos las relaciones públicas.
    # Las relaciones históricas de cada versión
    # permanecen intactas.

    atractivo.imagenes.all().delete()

    ImagenAtractivo.objects.bulk_create([
        ImagenAtractivo(
            atractivo=atractivo,
            imagen=imagen.imagen.name,
            texto_alternativo=imagen.texto_alternativo,
            es_portada=imagen.es_portada,
            orden=imagen.orden,
        )
        for imagen in version.imagenes.all()
    ])

    atractivo.secciones.all().delete()

    SeccionAtractivo.objects.bulk_create([
        SeccionAtractivo(
            atractivo=atractivo,
            titulo=seccion.titulo,
            contenido=seccion.contenido,
            orden=seccion.orden,
        )
        for seccion in version.secciones.all()
    ])

    atractivo.recomendaciones.all().delete()

    RecomendacionAtractivo.objects.bulk_create([
        RecomendacionAtractivo(
            atractivo=atractivo,
            texto=recomendacion.texto,
            orden=recomendacion.orden,
        )
        for recomendacion in version.recomendaciones.all()
    ])

    # Marcamos la versión como aprobada.

    version.estado = VersionAtractivo.Estado.APROBADA

    version.revisado_por = usuario

    version.fecha_revision = timezone.now()

    version.save()

    # Establecemos la nueva versión pública.

    atractivo.version_publicada = version

    atractivo.publicado = True

    atractivo.save()

    registrar_evento(
        atractivo=atractivo,
        version=version,
        usuario=usuario,
        accion=EventoEditorial.Accion.APROBACION,
        descripcion=(
            f"Versión {version.numero_version} "
            "aprobada y publicada."
        ),
    )

    return version


# ==================================================
# RETIRAR PUBLICACIÓN
# ==================================================

@transaction.atomic
def retirar_publicacion(atractivo_id, usuario):

    if not es_administrador(usuario):
        raise PermissionDenied(
            "No tienes permisos para retirar publicaciones."
        )

    atractivo = Atractivo.objects.select_for_update().get(
        pk=atractivo_id
    )

    if not atractivo.publicado:
        raise ValidationError(
            "El atractivo no está publicado."
        )

    atractivo.publicado = False

    atractivo.save(
        update_fields=[
            "publicado",
            "fecha_actualizacion",
        ]
    )

    registrar_evento(
        atractivo=atractivo,
        version=atractivo.version_publicada,
        usuario=usuario,
        accion=EventoEditorial.Accion.RETIRO,
        descripcion="Publicación retirada.",
    )

    return atractivo