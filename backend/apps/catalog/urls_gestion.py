from django.contrib.auth import views as auth_views
from django.urls import path

from . import views_gestion as gestion
from . import views_editorial as editorial


urlpatterns = [

    # ==================================================
    # AUTENTICACIÓN
    # ==================================================

    path(
        "cuentas/login/",
        gestion.FuncionarioLoginView.as_view(),
        name="login",
    ),

    path(
        "cuentas/logout/",
        auth_views.LogoutView.as_view(),
        name="logout",
    ),


    # ==================================================
    # DASHBOARD MUNICIPAL
    # ==================================================

    path(
        "gestion/",
        gestion.gestion_dashboard,
        name="gestion_dashboard",
    ),


    # ==================================================
    # GESTIÓN DE ATRACTIVOS
    # ==================================================

    path(
        "gestion/atractivos/",
        gestion.gestion_atractivos,
        name="gestion_atractivos",
    ),

    path(
        "gestion/atractivos/nuevo/",
        editorial.atractivo_crear,
        name="atractivo_crear",
    ),

    path(
        "gestion/atractivos/<int:pk>/editar/",
        editorial.atractivo_editar,
        name="atractivo_editar",
    ),

    path(
        "gestion/atractivos/<int:pk>/retirar/",
        editorial.atractivo_retirar,
        name="atractivo_retirar",
    ),


    # ==================================================
    # VERSIONAMIENTO EDITORIAL
    # ==================================================

    path(
        "gestion/atractivos/<int:pk>/versiones/nueva/",
        editorial.version_crear,
        name="version_crear",
    ),

    path(
        "gestion/versiones/<int:version_id>/",
        editorial.version_detalle,
        name="version_detalle",
    ),

    path(
        "gestion/versiones/<int:version_id>/editar/",
        editorial.version_editar,
        name="version_editar",
    ),

    path(
        "gestion/versiones/<int:version_id>/enviar/",
        editorial.version_enviar,
        name="version_enviar",
    ),

    path(
        "gestion/versiones/<int:version_id>/aprobar/",
        editorial.version_aprobar,
        name="version_aprobar",
    ),

    path(
        "gestion/versiones/<int:version_id>/observar/",
        editorial.version_observar,
        name="version_observar",
    ),


    # ==================================================
    # GESTIÓN DE USUARIOS
    # ==================================================

    path(
        "gestion/usuarios/",
        gestion.gestion_usuarios,
        name="gestion_usuarios",
    ),

    path(
        "gestion/usuarios/nuevo/",
        gestion.usuario_crear,
        name="usuario_crear",
    ),

    path(
        "gestion/usuarios/<int:pk>/editar/",
        gestion.usuario_editar,
        name="usuario_editar",
    ),

    path(
        "gestion/usuarios/<int:pk>/eliminar/",
        gestion.usuario_eliminar,
        name="usuario_eliminar",
    ),
]