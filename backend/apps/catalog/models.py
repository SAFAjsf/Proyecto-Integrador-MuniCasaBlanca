from django.conf import settings
from django.db import models
from django.urls import reverse
from django.utils.text import slugify


# ==================================================
# CATEGORÍAS
# ==================================================

class Categoria(models.Model):

    nombre = models.CharField(
        max_length=100,
        unique=True,
    )

    descripcion = models.TextField(blank=True)

    activa = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


# ==================================================
# ATRACTIVOS TURÍSTICOS
# ==================================================

class Atractivo(models.Model):

    class Zona(models.TextChoices):
        CASABLANCA = "casablanca", "Casablanca"
        QUINTAY = "quintay", "Quintay"

    nombre = models.CharField(max_length=200)

    slug = models.SlugField(
        max_length=220,
        unique=True,
        blank=True,
    )

    descripcion = models.TextField()

    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name="atractivos",
    )

    zona = models.CharField(
        max_length=20,
        choices=Zona.choices,
        default=Zona.CASABLANCA,
    )

    direccion = models.CharField(
        max_length=255,
        blank=True,
    )

    publicado = models.BooleanField(default=False)

    version_publicada = models.ForeignKey(
        "VersionAtractivo",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
        editable=False,
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
    )

    fecha_actualizacion = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        verbose_name = "Atractivo turístico"
        verbose_name_plural = "Atractivos turísticos"
        ordering = ["nombre"]

    def save(self, *args, **kwargs):
        """
        Genera un slug único al crear el atractivo.
        Conserva el slug existente al editarlo.
        """

        if not self.slug:

            longitud_maxima = self._meta.get_field(
                "slug"
            ).max_length

            slug_base = (
                slugify(self.nombre) or "atractivo"
            )[:longitud_maxima]

            slug = slug_base
            contador = 2

            while Atractivo.objects.filter(
                slug=slug
            ).exclude(pk=self.pk).exists():

                sufijo = f"-{contador}"

                slug = (
                    slug_base[
                        :longitud_maxima - len(sufijo)
                    ]
                    + sufijo
                )

                contador += 1

            self.slug = slug

        super().save(*args, **kwargs)

    def get_absolute_url(self):
        """
        Devuelve la URL pública del atractivo.
        """

        return reverse(
            "atractivo_detalle",
            kwargs={"slug": self.slug},
        )

    @property
    def imagen_portada(self):
        """
        Devuelve la portada o, en su defecto,
        la primera imagen disponible.
        """

        imagenes = list(self.imagenes.all())

        for imagen in imagenes:
            if imagen.es_portada:
                return imagen

        return imagenes[0] if imagenes else None

    @property
    def version_en_edicion(self):
        """
        Devuelve la versión editorial activa,
        si existe.
        """

        return self.versiones.filter(
            estado__in=[
                "borrador",
                "pendiente",
                "observada",
            ]
        ).first()

    def __str__(self):
        return self.nombre


# ==================================================
# IMÁGENES DEL CATÁLOGO PÚBLICO
# ==================================================

class ImagenAtractivo(models.Model):

    atractivo = models.ForeignKey(
        Atractivo,
        on_delete=models.CASCADE,
        related_name="imagenes",
    )

    imagen = models.ImageField(
        upload_to="atractivos/",
    )

    texto_alternativo = models.CharField(
        max_length=255,
        blank=True,
    )

    es_portada = models.BooleanField(
        default=False,
    )

    orden = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        verbose_name = "Imagen de atractivo"
        verbose_name_plural = "Imágenes de atractivos"

        ordering = ["orden", "id"]

        constraints = [
            models.UniqueConstraint(
                fields=["atractivo"],
                condition=models.Q(es_portada=True),
                name="catalog_una_portada_por_atractivo",
            ),
        ]

    def __str__(self):
        return f"Imagen de {self.atractivo.nombre}"


# ==================================================
# SECCIONES INFORMATIVAS DEL CATÁLOGO
# ==================================================

class SeccionAtractivo(models.Model):

    atractivo = models.ForeignKey(
        Atractivo,
        on_delete=models.CASCADE,
        related_name="secciones",
    )

    titulo = models.CharField(max_length=200)

    contenido = models.TextField()

    orden = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        verbose_name = "Sección de atractivo"
        verbose_name_plural = "Secciones de atractivos"

        ordering = ["orden", "id"]

    def __str__(self):
        return f"{self.atractivo.nombre} - {self.titulo}"


# ==================================================
# RECOMENDACIONES DEL CATÁLOGO
# ==================================================

class RecomendacionAtractivo(models.Model):

    atractivo = models.ForeignKey(
        Atractivo,
        on_delete=models.CASCADE,
        related_name="recomendaciones",
    )

    texto = models.TextField()

    orden = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        verbose_name = "Recomendación de atractivo"
        verbose_name_plural = "Recomendaciones de atractivos"

        ordering = ["orden", "id"]

    def __str__(self):
        return f"Recomendación de {self.atractivo.nombre}"


# ==================================================
# VERSIONAMIENTO EDITORIAL
# ==================================================

class VersionAtractivo(models.Model):

    class Estado(models.TextChoices):
        BORRADOR = "borrador", "Borrador"
        PENDIENTE = "pendiente", "Pendiente de revisión"
        OBSERVADA = "observada", "Observada"
        APROBADA = "aprobada", "Aprobada"

    atractivo = models.ForeignKey(
        Atractivo,
        on_delete=models.CASCADE,
        related_name="versiones",
    )

    numero_version = models.PositiveIntegerField()

    nombre = models.CharField(max_length=200)

    descripcion = models.TextField()

    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name="versiones_atractivos",
    )

    zona = models.CharField(
        max_length=20,
        choices=Atractivo.Zona.choices,
        default=Atractivo.Zona.CASABLANCA,
    )

    direccion = models.CharField(
        max_length=255,
        blank=True,
    )

    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.BORRADOR,
    )

    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="versiones_creadas",
    )

    revisado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="versiones_revisadas",
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
    )

    fecha_actualizacion = models.DateTimeField(
        auto_now=True,
    )

    fecha_envio = models.DateTimeField(
        null=True,
        blank=True,
    )

    fecha_revision = models.DateTimeField(
        null=True,
        blank=True,
    )

    observaciones = models.TextField(blank=True)

    importada = models.BooleanField(
        default=False,
        editable=False,
    )

    class Meta:
        verbose_name = "Versión de atractivo"
        verbose_name_plural = "Versiones de atractivos"

        ordering = ["-numero_version"]

        permissions = [
            (
                "aprobar_version",
                "Puede aprobar versiones de atractivos",
            ),
            (
                "observar_version",
                "Puede solicitar correcciones de versiones",
            ),
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "atractivo",
                    "numero_version",
                ],
                name="catalog_numero_version_unico",
            ),

            models.UniqueConstraint(
                fields=["atractivo"],
                condition=models.Q(
                    estado__in=[
                        "borrador",
                        "pendiente",
                        "observada",
                    ]
                ),
                name="catalog_una_version_en_edicion",
            ),
        ]

    @property
    def es_editable(self):
        """
        Solo los borradores y versiones observadas
        pueden recibir modificaciones.
        """

        return self.estado in (
            self.Estado.BORRADOR,
            self.Estado.OBSERVADA,
        )

    @property
    def es_version_publicada(self):
        """
        Indica si esta versión corresponde
        a la publicación actualmente visible.
        """

        return (
            self.atractivo.publicado
            and self.atractivo.version_publicada_id == self.pk
            and self.estado == self.Estado.APROBADA
        )

    @property
    def imagen_portada(self):

        imagenes = list(self.imagenes.all())

        for imagen in imagenes:
            if imagen.es_portada:
                return imagen

        return imagenes[0] if imagenes else None

    def __str__(self):

        return (
            f"{self.nombre} - "
            f"V{self.numero_version} - "
            f"{self.get_estado_display()}"
        )


# ==================================================
# IMÁGENES DE VERSIONES EDITORIALES
# ==================================================

class ImagenVersionAtractivo(models.Model):

    version = models.ForeignKey(
        VersionAtractivo,
        on_delete=models.CASCADE,
        related_name="imagenes",
    )

    imagen = models.ImageField(
        upload_to="versiones/atractivos/",
    )

    texto_alternativo = models.CharField(
        max_length=255,
        blank=True,
    )

    es_portada = models.BooleanField(
        default=False,
    )

    orden = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        verbose_name = "Imagen de versión"
        verbose_name_plural = "Imágenes de versiones"

        ordering = ["orden", "id"]

        constraints = [
            models.UniqueConstraint(
                fields=["version"],
                condition=models.Q(es_portada=True),
                name="catalog_una_portada_por_version",
            ),
        ]

    def __str__(self):
        return f"Imagen de {self.version}"


# ==================================================
# SECCIONES DE VERSIONES EDITORIALES
# ==================================================

class SeccionVersionAtractivo(models.Model):

    version = models.ForeignKey(
        VersionAtractivo,
        on_delete=models.CASCADE,
        related_name="secciones",
    )

    titulo = models.CharField(max_length=200)

    contenido = models.TextField()

    orden = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        verbose_name = "Sección de versión"
        verbose_name_plural = "Secciones de versiones"

        ordering = ["orden", "id"]

    def __str__(self):
        return f"{self.version} - {self.titulo}"


# ==================================================
# RECOMENDACIONES DE VERSIONES EDITORIALES
# ==================================================

class RecomendacionVersionAtractivo(models.Model):

    version = models.ForeignKey(
        VersionAtractivo,
        on_delete=models.CASCADE,
        related_name="recomendaciones",
    )

    texto = models.TextField()

    orden = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        verbose_name = "Recomendación de versión"
        verbose_name_plural = "Recomendaciones de versiones"

        ordering = ["orden", "id"]

    def __str__(self):
        return f"Recomendación de {self.version}"