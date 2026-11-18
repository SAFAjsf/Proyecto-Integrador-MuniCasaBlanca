GRUPO_FUNCIONARIOS = "Editores de contenido"
GRUPO_ADMINISTRADORES = "Administradores"


def es_administrador(user):
    return (
        user.is_authenticated
        and user.is_active
        and (
            user.is_superuser
            or user.groups.filter(
                name=GRUPO_ADMINISTRADORES
            ).exists()
        )
    )


def es_funcionario(user):
    return (
        user.is_authenticated
        and user.is_active
        and (
            es_administrador(user)
            or user.groups.filter(
                name=GRUPO_FUNCIONARIOS
            ).exists()
        )
    )


def puede_gestionar_usuarios(user):
    return (
        user.is_authenticated
        and user.is_active
        and user.is_superuser
    )


def rol_de(usuario):
    if usuario.is_superuser:
        return "superusuario"

    if es_administrador(usuario):
        return "administrador"

    if es_funcionario(usuario):
        return "funcionario"

    return "sin_acceso"