from django.contrib import admin
from django.urls import path, include

from apps.mediafiles.views import archivo_multimedia


urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/v1/", include("apps.catalog.urls")),

    path("", include("apps.catalog.urls_gestion")),

    path("", include("apps.catalog.urls_public")),

    path("api/", include("apps.weather.urls")),

    path(
        "media/<path:ruta>",
        archivo_multimedia,
        name="archivo_multimedia",
    ),
]