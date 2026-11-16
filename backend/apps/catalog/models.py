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
            self.slug = slugify(self.nombre)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre