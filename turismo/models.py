from django.db import models
#reverse sirve para obtener la url por nombre de la vista, en vez de poner la url completa
from django.urls import reverse
#slugify sirve para crear una cadena de texto a un texto limpio, sin tildes ni espacios, para usarlo en la url
from django.utils.text import slugify

# Create your models here.

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    #blank=True permite dejar el campo en blanco
    descripcion = models.TextField(blank=True)
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ['nombre']
        verbose_name = "categoria"
        verbose_name_plural = "categorias"

    def __str__(self):
        return self.nombre


class Atractivo(models.Model):
    nombre = models.CharField(max_length=200)
    # SlugField es un CharField que solo acepta letras, números, guiones y guiones bajos.
    # blank=True porque lo generamos automáticamente en save().
    # unique=True para que dos atractivos no compartan URL.
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    descripcion = models.TextField()
    # ForeignKey = relación muchos-a-uno: muchos atractivos pertenecen a una categoría.
    # PROTECT impide borrar una categoría que todavía tiene atractivos (protege los datos).
    # related_name="atractivos" permite escribir categoria.atractivos.all()
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name="atractivos",
    )
    direccion = models.CharField(max_length=255, blank=True)
    publicado = models.BooleanField(default=False)
    #Zona a la que pertenece el atractivo por ejemplo quintay o casablanca, esto es para filtrar los atractivos por zona en la vista de usuario
    class Zona(models.TextChoices):
        CASABLANCA = "casablanca", "Casablanca"
        QUINTAY = "quintay", "Quintay"
    # El primer valor de cada opción es lo que se guarda en la base de datos;
    # el segundo es lo que ve el funcionario en el selector.
    zona = models.CharField(
        max_length=20,
        choices=Zona.choices,
        default=Zona.CASABLANCA,
    )
    #auto_now_add=True hace que la fecha se guarde automáticamente al crear el objeto, y no se pueda modificar después.
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nombre"]
        verbose_name = "Atractivo turístico"
        verbose_name_plural = "Atractivos turísticos"

    #Este bloque de codigo lo que hace es generar un slug unico para cada atraccion turistica, lo calcula y se lo asigna
    # Si no hay slug, lo genera a partir del nombre
    #por ejemplo si el nombre es "Playa Blanca" el slug sera "playa-blanca" y usará la url /atractivo/playa-blanca/
    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.nombre) or "atractivo"
            base = base[: self._meta.get_field("slug").max_length]

            slug = base
            contador = 2
            while (
                Atractivo.objects
                .filter(slug=slug)
                .exclude(pk=self.pk)
                .exists()
            ):
                sufijo = f"-{contador}"
                slug = (
                    base[
                        : self._meta.get_field("slug").max_length
                        - len(sufijo)
                    ]
                    + sufijo
                )
                contador += 1
            self.slug = slug
        super().save(*args, **kwargs)


    def get_absolute_url(self):
        return reverse("atractivo_detalle", args=[self.slug])

    #Esta funcion devuelve las imagenes asiganadas a una atraccion turistica con la foreing key
    #le da prioridad ala imagen de combre es_portada, si no hay ninguna imagen con es_portada=True, devuelve la primera imagen de la lista
    @property
    def imagen_portada(self):
        imagenes = list(self.imagenes.all())

        for imagen in imagenes:
            if imagen.es_portada:
                return imagen

        return imagenes[0] if imagenes else None

    def __str__(self):
        return self.nombre

class ImagenAtractivo(models.Model):
     #Cascade significa que si se borra un atractivo, se borran todas sus imagenes
    atractivo = models.ForeignKey(
        Atractivo,
        on_delete=models.CASCADE,
        related_name="imagenes",
    )
    #upload_to="atractivos/" significa que las imagenes se guardan en la carpeta media/atractivos/
    imagen = models.ImageField(upload_to="atractivos/")
    texto_alternativo = models.CharField(max_length=255, blank=True)
    es_portada = models.BooleanField(default=False)
    # sirve para ordenar a mano las imagenes de un atractivo
    # por ejemplo si quiero que la primera imagen sea la portada, la segunda imagen sea la galeria, etc.
    orden = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["orden", "id"]
        # Restricción a nivel de base de datos: solo una fila con es_portada=True
        # por cada atractivo. Aunque el admin o un script lo intenten, la BD lo rechaza.
        constraints = [
            models.UniqueConstraint(
                fields=["atractivo"],
                condition=models.Q(es_portada=True),
                name="una_portada_por_atractivo",
            )
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
        ordering = ["orden", "id"]

    def __str__(self):
        return f"{self.titulo} de {self.atractivo.nombre}"

class RecomendacionAtractivo(models.Model):
    atractivo = models.ForeignKey(
        Atractivo,
        on_delete=models.CASCADE,
        related_name="recomendaciones",
    )
    texto = models.TextField()
    orden = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["orden", "id"]

    def __str__(self):
        return f"Recomendación de {self.atractivo.nombre}"

