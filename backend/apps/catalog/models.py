from django.db import models
from django.utils.text import slugify


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    activa = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Atractivo(models.Model):
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

    direccion = models.CharField(
        max_length=255,
        blank=True,
    )

    publicado = models.BooleanField(default=False)

    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Atractivo turístico"
        verbose_name_plural = "Atractivos turísticos"
        ordering = ["nombre"]

    def save(self, *args, **kwargs):
        if not self.slug:
            slug_base = slugify(self.nombre) or "atractivo"
            slug_base = slug_base[:self._meta.get_field("slug").max_length]

            slug = slug_base
            contador = 2

            while Atractivo.objects.filter(
                slug=slug
            ).exclude(pk=self.pk).exists():
                sufijo = f"-{contador}"
                slug = (
                    slug_base[
                        :self._meta.get_field("slug").max_length
                        - len(sufijo)
                    ]
                    + sufijo
                )
                contador += 1

            self.slug = slug

        super().save(*args, **kwargs)


    def __str__(self):
        return self.nombre
    
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

    es_portada = models.BooleanField(default=False)

    orden = models.PositiveIntegerField(default=0)

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


class SeccionAtractivo(models.Model):
    atractivo = models.ForeignKey(
        Atractivo,
        on_delete=models.CASCADE,
        related_name="secciones",
    )

    titulo = models.CharField(max_length=200)

    contenido = models.TextField()

    orden = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Sección de atractivo"
        verbose_name_plural = "Secciones de atractivos"
        ordering = ["orden", "id"]

    def __str__(self):
        return f"{self.atractivo.nombre} - {self.titulo}"


class RecomendacionAtractivo(models.Model):
    atractivo = models.ForeignKey(
        Atractivo,
        on_delete=models.CASCADE,
        related_name="recomendaciones",
    )

    texto = models.TextField()

    orden = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Recomendación de atractivo"
        verbose_name_plural = "Recomendaciones de atractivos"
        ordering = ["orden", "id"]

    def __str__(self):
        return f"Recomendación de {self.atractivo.nombre}"