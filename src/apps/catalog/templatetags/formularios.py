from django import forms
from django import template

register = template.Library()


# Nombres legibles para los formsets del editor de versiones
# y la sección del formulario a la que debe saltar cada enlace.
ETIQUETAS_FORMSET = {
    "imagenes": ("Fotografía", "sec-fotografias"),
    "secciones": ("Sección", "sec-secciones"),
    "recomendaciones": ("Recomendación", "sec-recomendaciones"),
}


@register.simple_tag
def widget_accesible(campo):
    """Renderiza un campo agregando clases y atributos ARIA.

    No valida ni transforma datos: solo decide cómo se pinta el widget
    para que el formulario sea más fácil de leer y de navegar con teclado
    o lector de pantalla.
    """

    widget = campo.field.widget
    attrs = {}

    clases = str(widget.attrs.get("class", "")).split()

    if isinstance(widget, forms.CheckboxInput):
        clases.append("g-checkbox")
    elif isinstance(widget, forms.Select):
        clases.extend(["g-control", "g-select"])
    elif isinstance(widget, forms.Textarea):
        clases.extend(["g-control", "g-textarea"])
    elif isinstance(widget, (forms.ClearableFileInput, forms.FileInput)):
        clases.append("g-file")
    else:
        clases.append("g-control")

    # dict.fromkeys quita duplicados sin perder el orden.
    attrs["class"] = " ".join(
        dict.fromkeys(clase for clase in clases if clase)
    )

    if campo.field.required:
        attrs["aria-required"] = "true"

    descripciones = []

    if campo.help_text:
        descripciones.append(f"ayuda-{campo.auto_id}")

    if campo.errors:
        attrs["aria-invalid"] = "true"
        descripciones.append(f"error-{campo.auto_id}")

    if descripciones:
        attrs["aria-describedby"] = " ".join(descripciones)

    return campo.as_widget(attrs=attrs)


@register.inclusion_tag("gestion/_resumen_errores.html")
def resumen_errores(form=None, *formsets):
    """Arma la lista de errores con enlaces a cada campo.

    Se usa al principio del formulario: quien usa lector de pantalla
    escucha el resumen y puede saltar al campo con el enlace.
    """

    errores = []

    def agregar(ancla, texto):
        errores.append({"ancla": ancla, "texto": texto})

    if form is not None:
        for nombre, mensajes in form.errors.items():
            if nombre == "__all__":
                for mensaje in mensajes:
                    agregar("resumen-errores", mensaje)
                continue

            campo = form[nombre]

            for mensaje in mensajes:
                agregar(
                    campo.auto_id,
                    f"{campo.label or nombre}: {mensaje}",
                )

    for formset in formsets:
        singular, ancla_formset = ETIQUETAS_FORMSET.get(
            formset.prefix,
            (formset.prefix, "resumen-errores"),
        )

        for mensaje in formset.non_form_errors():
            agregar(ancla_formset, f"{singular}: {mensaje}")

        for posicion, subformulario in enumerate(formset.forms, start=1):
            for nombre, mensajes in subformulario.errors.items():
                if nombre == "__all__":
                    for mensaje in mensajes:
                        agregar(
                            ancla_formset,
                            f"{singular} {posicion}: {mensaje}",
                        )
                    continue

                campo = subformulario[nombre]

                for mensaje in mensajes:
                    agregar(
                        campo.auto_id,
                        f"{singular} {posicion} · "
                        f"{campo.label or nombre}: {mensaje}",
                    )

    return {"errores": errores}
