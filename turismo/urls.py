
from django.contrib.auth import views as auth_views
from django.urls import path

from . import views

urlpatterns = [
    path("", views.inicio, name="inicio"),
    path("atractivos/", views.atractivos, name="atractivos"),
    # <slug:slug> captura el texto de la URL y lo pasa como argumento 'slug' a la vista.
    path("atractivos/<slug:slug>/", views.atractivo_detalle, name="atractivo_detalle"),
    path("como-llegar/", views.como_llegar, name="como_llegar"),
    path("historia/", views.historia, name="historia"),
    path("noticias/", views.noticias, name="noticias"),
    path("quintay/", views.quintay, name="quintay"),
    path("ruta-vino/", views.ruta_vino, name="ruta_vino"),
    path("vinas/", views.vinas, name="vinas"),
    path("cuentas/login/", views.FuncionarioLoginView.as_view(), name="login"),
    path("cuentas/logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("gestion/", views.gestion_dashboard, name="gestion_dashboard"),
    path("gestion/atractivos/", views.gestion_atractivos, name="gestion_atractivos"),
    path("gestion/atractivos/nuevo/", views.atractivo_crear, name="atractivo_crear"),
    path("gestion/atractivos/<int:pk>/editar/", views.atractivo_editar, name="atractivo_editar"),
    path("gestion/atractivos/<int:pk>/eliminar/", views.atractivo_eliminar, name="atractivo_eliminar"),
    path("gestion/usuarios/", views.gestion_usuarios, name="gestion_usuarios"),
    path("gestion/usuarios/nuevo/", views.usuario_crear, name="usuario_crear"),
    path("gestion/usuarios/<int:pk>/editar/", views.usuario_editar, name="usuario_editar"),
    path("gestion/usuarios/<int:pk>/eliminar/", views.usuario_eliminar, name="usuario_eliminar"),
]