# Nombre del grupo que da acceso al panel municipal.
# Se usa en varios archivos: centralizarlo evita errores de tipeo.
GRUPO_FUNCIONARIOS = "Funcionarios municipales"

# Funciones de permisos y roles de usuario
#Si los usuarios no estan autenticados o no son funcionarios, no pueden acceder a las vistas de gestion de atractivos
def es_funcionario(user):
    if not user.is_authenticated:
        return False
    if user.is_staff:
        return True
    return user.groups.filter(name=GRUPO_FUNCIONARIOS).exists()


def es_administrador(user):
    return user.is_authenticated and user.is_staff


def rol_de(usuario):
    if usuario.is_superuser:
        return "superusuario"
    if usuario.is_staff:
        return "administrador"
    if any(grupo.name == GRUPO_FUNCIONARIOS for grupo in usuario.groups.all()):
        return "funcionario"
    return "sin_acceso"