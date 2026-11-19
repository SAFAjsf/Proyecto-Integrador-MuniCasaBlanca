from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.forms import inlineformset_factory

from .permissions import (
    GRUPO_FUNCIONARIOS,
    GRUPO_ADMINISTRADORES,
    es_funcionario,
)


Usuario = get_user_model()


# ==================================================
# AUTENTICACIÓN MUNICIPAL
# ==================================================

class FuncionarioAuthenticationForm(AuthenticationForm):

    def confirm_login_allowed(self, user):

        super().confirm_login_allowed(user)

        if not es_funcionario(user):
            raise ValidationError(
                "Esta cuenta no tiene permisos municipales.",
                code="no_funcionario",
            )


# ==================================================
# VALIDACIÓN DE IMÁGENES
# ==================================================

class BaseImagenFormSet(forms.BaseInlineFormSet):

    def clean(self):

        super().clean()

        if any(self.errors):
            return

        portadas = 0

        for formulario in self.forms:

            datos = getattr(
                formulario,
                "cleaned_data",
                None,
            )

            if not datos:
                continue

            if datos.get("DELETE"):
                continue

            if datos.get("es_portada"):
                portadas += 1

        if portadas > 1:
            raise ValidationError(
                "Solo puedes marcar una imagen como portada."
            )


# ==================================================
# FORMULARIO DE USUARIOS MUNICIPALES
# ==================================================

class UsuarioForm(forms.ModelForm):

    password1 = forms.CharField(
        label="Contraseña",
        required=False,
        widget=forms.PasswordInput(
            attrs={
                "autocomplete": "new-password",
            }
        ),
    )

    password2 = forms.CharField(
        label="Repetir contraseña",
        required=False,
        widget=forms.PasswordInput(
            attrs={
                "autocomplete": "new-password",
            }
        ),
    )

    es_funcionario = forms.BooleanField(
        label="Editor de contenido",
        required=False,
    )

    es_administrador = forms.BooleanField(
        label="Administrador",
        required=False,
    )

    class Meta:
        model = Usuario

        fields = (
            "username",
            "first_name",
            "last_name",
            "email",
            "is_active",
        )

        labels = {
            "username": "Nombre de usuario",
            "first_name": "Nombre",
            "last_name": "Apellido",
            "email": "Correo electrónico",
            "is_active": "Cuenta activa",
        }

    def __init__(
        self,
        *args,
        usuario_actual=None,
        **kwargs,
    ):

        self.usuario_actual = usuario_actual

        super().__init__(*args, **kwargs)

        if self.instance.pk:

            self.fields["password1"].help_text = (
                "Déjala en blanco para mantener "
                "la contraseña actual."
            )

            self.fields["es_funcionario"].initial = (
                self.instance.groups.filter(
                    name=GRUPO_FUNCIONARIOS
                ).exists()
            )

            self.fields["es_administrador"].initial = (
                self.instance.is_superuser
                or self.instance.groups.filter(
                    name=GRUPO_ADMINISTRADORES
                ).exists()
            )

        else:

            self.fields["password1"].required = True

            self.fields["password2"].required = True

            self.fields["is_active"].initial = True

        # Proteger la cuenta del usuario actual.
        if (
            self.instance.pk
            and usuario_actual
            and self.instance.pk == usuario_actual.pk
        ):

            self.fields["is_active"].disabled = True

            self.fields["es_administrador"].disabled = True

    def clean(self):

        datos = super().clean()

        password1 = datos.get("password1")
        password2 = datos.get("password2")

        if password1 or password2:

            if password1 != password2:

                self.add_error(
                    "password2",
                    "Las contraseñas no coinciden.",
                )

            elif password1:

                usuario_validacion = Usuario(
                    username=datos.get("username", ""),
                    first_name=datos.get("first_name", ""),
                    last_name=datos.get("last_name", ""),
                    email=datos.get("email", ""),
                )

                try:

                    validate_password(
                        password1,
                        user=usuario_validacion,
                    )

                except ValidationError as error:

                    self.add_error(
                        "password1",
                        error,
                    )

        return datos

    def save(self, commit=True):

        usuario = super().save(commit=False)

        administrador = self.cleaned_data[
            "es_administrador"
        ]

        editor = self.cleaned_data[
            "es_funcionario"
        ]

        # Si tiene ambos roles, prevalece administrador.
        if administrador:
            editor = False

        # Los editores trabajan desde el panel municipal.
        # El acceso a Django Admin queda reservado
        # para administradores y superusuarios.
        usuario.is_staff = (
            administrador
            or usuario.is_superuser
        )

        password = self.cleaned_data.get(
            "password1"
        )

        if password:
            usuario.set_password(password)

        if commit:

            usuario.save()

            grupo_editor, _ = Group.objects.get_or_create(
                name=GRUPO_FUNCIONARIOS
            )

            grupo_admin, _ = Group.objects.get_or_create(
                name=GRUPO_ADMINISTRADORES
            )

            if editor:
                usuario.groups.add(grupo_editor)
            else:
                usuario.groups.remove(grupo_editor)

            if administrador:
                usuario.groups.add(grupo_admin)
            else:
                usuario.groups.remove(grupo_admin)

        return usuario
    
# ==================================================
# FORMULARIOS DE VERSIONAMIENTO EDITORIAL
# ==================================================

from .models import (
    VersionAtractivo,
    ImagenVersionAtractivo,
    SeccionVersionAtractivo,
    RecomendacionVersionAtractivo,
)


class VersionAtractivoForm(forms.ModelForm):

    class Meta:
        model = VersionAtractivo

        fields = (
            "nombre",
            "descripcion",
            "categoria",
            "zona",
            "direccion",
        )

        widgets = {
            "descripcion": forms.Textarea(
                attrs={"rows": 6}
            ),
        }


ImagenVersionFormSet = inlineformset_factory(
    VersionAtractivo,
    ImagenVersionAtractivo,
    formset=BaseImagenFormSet,
    fields=(
        "imagen",
        "texto_alternativo",
        "es_portada",
        "orden",
    ),
    extra=1,
    can_delete=True,
)


SeccionVersionFormSet = inlineformset_factory(
    VersionAtractivo,
    SeccionVersionAtractivo,
    fields=(
        "titulo",
        "contenido",
        "orden",
    ),
    extra=1,
    can_delete=True,
)


RecomendacionVersionFormSet = inlineformset_factory(
    VersionAtractivo,
    RecomendacionVersionAtractivo,
    fields=(
        "texto",
        "orden",
    ),
    extra=1,
    can_delete=True,
)


class ObservacionEditorialForm(forms.Form):

    observaciones = forms.CharField(
        label="Observaciones del administrador",
        widget=forms.Textarea(
            attrs={"rows": 4}
        ),
        required=True,
        max_length=3000,
    )