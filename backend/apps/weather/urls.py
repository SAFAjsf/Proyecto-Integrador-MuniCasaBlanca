from django.urls import path

from . import views


urlpatterns = [
    path(
        "clima/",
        views.clima_api,
        name="clima_api",
    ),
]