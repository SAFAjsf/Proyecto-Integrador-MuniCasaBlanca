from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Usuario del sistema de administración municipal.

    Utiliza el sistema de autenticación y permisos
    proporcionado por Django.
    """

    class Meta:
        verbose_name = "Usuario municipal"
        verbose_name_plural = "Usuarios municipales"

    def __str__(self):
        return self.username