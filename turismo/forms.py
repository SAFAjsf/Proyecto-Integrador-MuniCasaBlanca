from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.forms import inlineformset_factory

from .models import Atractivo, ImagenAtractivo
from .permissions import GRUPO_FUNCIONARIOS, es_funcionario

Usuario = get_user_model()


# ------------------------------ ATRACTIVOS ------------------------------

class AtractivoForm(forms.ModelForm):
    class Meta:
        model = Atractivo
        fields = (
            "nombre",
            "descripcion",
            "categoria",
            "zona",
            "direccion",
            "publicado",
        )
        widgets = {
            "descripcion": forms.Textarea(attrs={"rows": 6}),
        }


class FuncionarioAuthenticationForm(AuthenticationForm):
    def confirm_login_allowed(self, user):
        super().confirm_login_allowed(user)

        if not es_funcionario(user):
            raise ValidationError(
                "Esta cuenta no tiene permisos de funcionario municipal.",
                code="no_funcionario",
            )


class BaseImagenFormSet(forms.BaseInlineFormSet):
    def clean(self):
        super().clean()

        portadas = 0
        for form in self.forms:
            if not form.cleaned_data:
                continue
            if form.cleaned_data.get("DELETE"):
                continue
            if form.cleaned_data.get("es_portada"):
                portadas += 1

        if portadas > 1:
            raise forms.ValidationError(
                "Solo puedes marcar una imagen como portada."
            )


ImagenFormSet = inlineformset_factory(
    Atractivo,
    ImagenAtractivo,
    formset=BaseImagenFormSet,
    fields=("imagen", "texto_alternativo", "es_portada", "orden"),
    extra=3,
    can_delete=True,
)


# ------------------------------- USUARIOS -------------------------------

class UsuarioForm(forms.ModelForm):
    # Campos que no existen en el modelo: se manejan a mano.
    password1 = forms.CharField(
        label="Contraseña",
        required=False,
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password"}),
    )
    password2 = forms.CharField(
        label="Repetir contraseña",
        required=False,
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password"}),
    )
    es_funcionario = forms.BooleanField(
        label="Funcionario municipal",
        required=False,
    )
    es_administrador = forms.BooleanField(
        label="Administrador",
        required=False,
    )

    class Meta:
        model = Usuario
        fields = ("username", "first_name", "last_name", "email", "is_active")
        labels = {
            "username": "Nombre de usuario",
            "first_name": "Nombre",
            "last_name": "Apellido",
            "email": "Correo electrónico",
            "is_active": "Cuenta activa",
        }

    def __init__(self, *args, usuario_actual=None, **kwargs):
        # usuario_actual sirve para impedir que alguien se quite a sí mismo
        # el rol de administrador o se desactive su propia cuenta.
        self.usuario_actual = usuario_actual
        super().__init__(*args, **kwargs)

        if self.instance.pk:
            # Edición: la contraseña es opcional.
            self.fields["password1"].help_text = (
                "Déjala en blanco para mantener la contraseña actual."
            )
            self.fields["es_funcionario"].initial = any(
                grupo.name == GRUPO_FUNCIONARIOS
                for grupo in self.instance.groups.all()
            )
            self.fields["es_administrador"].initial = self.instance.is_staff
        else:
            # Creación: la contraseña es obligatoria.
            self.fields["password1"].required = True
            self.fields["password2"].required = True
            self.fields["is_active"].initial = True

        # Editando tu propia cuenta: no puedes desactivarte ni dejar de ser admin.
        if self.instance.pk and usuario_actual and self.instance.pk == usuario_actual.pk:
            self.fields["is_active"].disabled = True
            self.fields["es_administrador"].disabled = True
            self.fields["es_administrador"].help_text = (
                "No puedes quitarte el rol de administrador a ti mismo."
            )

    def clean(self):
        datos = super().clean()

        password1 = datos.get("password1")
        password2 = datos.get("password2")

        if password1 or password2:
            if password1 != password2:
                self.add_error("password2", "Las contraseñas no coinciden.")
            elif len(password1) < 8:
                self.add_error(
                    "password1",
                    "Usa al menos 8 caracteres.",
                )

        return datos

    def save(self, commit=True):
        usuario = super().save(commit=False)

        usuario.is_staff = self.cleaned_data["es_administrador"]

        # Un superusuario nunca pierde is_staff desde este formulario.
        if usuario.pk and usuario.is_superuser:
            usuario.is_staff = True

        if self.cleaned_data.get("password1"):
            usuario.set_password(self.cleaned_data["password1"])

        if commit:
            usuario.save()

            grupo, _ = Group.objects.get_or_create(name=GRUPO_FUNCIONARIOS)

            if self.cleaned_data["es_funcionario"]:
                usuario.groups.add(grupo)
            else:
                usuario.groups.remove(grupo)

        return usuario