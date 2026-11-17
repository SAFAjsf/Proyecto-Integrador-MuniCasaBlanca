# Manual de uso y estado del proyecto

**Plataforma turística de Casablanca** — Django 6.1.3
Última verificación: 17-11-2026, rama `integracion-django`, base de datos SQLite.

Este documento responde cuatro preguntas:

1. ¿Cómo se levanta y se usa la aplicación?
2. ¿Cómo se crean usuarios y atractivos?
3. ¿Qué debe continuar quien tome el proyecto?
4. ¿Qué falta por agregar?

---

## Índice

1. [Puesta en marcha](#1-puesta-en-marcha)
2. [Mapa de la aplicación](#2-mapa-de-la-aplicación)
3. [Uso del sitio público](#3-uso-del-sitio-público)
4. [Acceso al panel](#4-acceso-al-panel)
5. [Crear y administrar usuarios](#5-crear-y-administrar-usuarios)
6. [Crear y administrar atractivos](#6-crear-y-administrar-atractivos)
7. [Flujo completo de ejemplo](#7-flujo-completo-de-ejemplo)
8. [Comandos útiles](#8-comandos-útiles)
9. [Problemas comunes](#9-problemas-comunes)
10. [Qué debe continuar](#10-qué-debe-continuar)
11. [Qué falta por agregar](#11-qué-falta-por-agregar)
12. [Checklist antes de publicar](#12-checklist-antes-de-publicar)

---

## 1. Puesta en marcha

### Requisitos

- Python 3.12 o superior.
- Windows, macOS o Linux.
- Las dependencias del proyecto: `Django 6.1.3` y `Pillow 12.0.0` (`requirements.txt`).

### Primera vez

```bash
cd Proyecto-Integrador-MuniCasaBlanca

python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Abrir `http://127.0.0.1:8000/`.

### Las veces siguientes

```bash
cd Proyecto-Integrador-MuniCasaBlanca
venv\Scripts\activate
python manage.py runserver
```

### Direcciones importantes

| Qué | URL |
|---|---|
| Sitio público | `http://127.0.0.1:8000/` |
| Atractivos | `http://127.0.0.1:8000/atractivos/` |
| Panel municipal | `http://127.0.0.1:8000/gestion/` |
| Login de funcionarios | `http://127.0.0.1:8000/cuentas/login/` |
| Admin de Django | `http://127.0.0.1:8000/admin/` |

> La base de datos es el archivo `db.sqlite3`. **No está en Git** (por seguridad), así que cada persona que clone el repositorio debe ejecutar `migrate` y crear sus propios datos.

---

## 2. Mapa de la aplicación

Hay **tres formas** de entrar al sistema, y no son intercambiables:

| Zona | Quién entra | Qué puede hacer | Se protege con |
|---|---|---|---|
| **Sitio público** | Cualquiera | Ver atractivos, viñas, historia, noticias, cómo llegar | Nada: es abierto |
| **Panel `/gestion/`** | Funcionarios y administradores | CRUD de atractivos; los admin además CRUD de usuarios | `@user_passes_test` en cada vista |
| **Admin `/admin/`** | Solo staff / superusuario | Todo: categorías, imágenes, secciones, recomendaciones, usuarios, permisos | `is_staff` de Django |

### Estructura de archivos que importa

```
turismo/
  models.py        Categoria, Atractivo, ImagenAtractivo,
                   SeccionAtractivo, RecomendacionAtractivo
  views.py         vistas públicas + panel
  forms.py         formularios y formset de imágenes
  permissions.py   es_funcionario / es_administrador / rol_de
  admin.py         registro del admin con inlines
  urls.py          todas las rutas
  tests.py         3 pruebas automáticas
templates/
  *.html           8 páginas públicas
  atractivos/_dialogo.html   ficha modal de cada atractivo
  gestion/         plantillas del panel
  resgistration/   login (nombre mal escrito, ver pendientes)
static/            css, js e imágenes del diseño
media/             imágenes subidas desde el panel
```

---

## 3. Uso del sitio público

No requiere cuenta.

1. **`/`** — portada con la presentación de Casablanca.
2. **`/atractivos/`** — dos grillas: **Casablanca** arriba y **Quintay** abajo.
   - Cada tarjeta es un botón: al hacer clic abre la ficha en un cuadro de diálogo.
   - Se cierra con la **×**, con **Esc** o haciendo clic fuera.
   - La ficha muestra portada, categoría, descripción, secciones, recomendaciones y un enlace a Google Maps si el atractivo tiene dirección.
3. **`/vinas/`**, **`/quintay/`**, **`/historia/`**, **`/noticias/`**, **`/como-llegar/`**, **`/ruta-vino/`** — contenido informativo.
4. **Selector de idioma** (Español / English / Português) — traduce los textos fijos del diseño. **No traduce** lo que viene de la base de datos.

> Hoy el contenido de viñas, noticias e historia es fijo en las plantillas. Solo los atractivos son administrables desde el panel.

---

## 4. Acceso al panel

### Roles

| Rol | Cómo se identifica | Entra a `/gestion/` | Entra a `/admin/` | Gestiona usuarios |
|---|---|---|---|---|
| Anónimo | — | ❌ | ❌ | ❌ |
| **Funcionario municipal** | Miembro del grupo `Funcionarios municipales`, `is_staff = False` | ✅ | ❌ | ❌ |
| **Administrador** | `is_staff = True` | ✅ | ✅ | ✅ |
| **Superusuario** | `is_superuser = True` | ✅ | ✅ | ✅ |

Regla implementada en `turismo/permissions.py`:

```python
def es_funcionario(user):
    return user.is_authenticated and (
        user.is_staff
        or user.groups.filter(name="Funcionarios municipales").exists()
    )
```

### Entrar

1. Ir a `/cuentas/login/` o a `/gestion/` (redirige solo).
2. Escribir usuario y contraseña.
3. Si la cuenta existe pero **no** es funcionario, aparece:
   *"Esta cuenta no tiene permisos de funcionario municipal."*
4. Al entrar, se llega al **Resumen** del panel.

### Salir

Botón **Salir** en la barra superior del panel (envía POST, no basta cerrar la pestaña).

> Para probar dos roles a la vez: una ventana normal con `admin` y una ventana de incógnito con el funcionario. Cada una tiene su propia sesión.

---

## 5. Crear y administrar usuarios

### 5.1 Desde el panel (recomendado)

Requiere ser **staff**. Ruta: `/gestion/usuarios/` → **+ Nuevo usuario**.

| Campo | Obligatorio | Qué poner |
|---|---|---|
| Nombre de usuario | ✅ | Sin espacios, ej. `kmontt`. Es con lo que se inicia sesión |
| Correo electrónico | ❌ | Se usa solo para identificarlo en el listado |
| Nombre / Apellido | ❌ | Se muestran en la barra superior y en el listado |
| Contraseña | ✅ al crear | Mínimo **8 caracteres**. Se guarda hasheada |
| Repetir contraseña | ✅ al crear | Debe coincidir |
| Cuenta activa | — | Viene marcada. Si se desmarca, el usuario no puede iniciar sesión |
| Funcionario municipal | — | **Marcar** para que entre a `/gestion/` |
| Administrador | — | **Marcar** para que además entre a `/admin/` y gestione usuarios |

Pasos:

1. Completar usuario y contraseña (mínimo 8 caracteres).
2. Marcar **Funcionario municipal**.
3. Guardar.
4. El listado debe mostrar la etiqueta verde **Funcionario**.

### 5.2 Reglas de seguridad que ya están puestas

- No puedes **eliminar tu propia cuenta**.
- No puedes **quitarte** el rol de administrador ni desactivar tu propia cuenta al editarte.
- No se puede eliminar al **último superusuario**.
- Las contraseñas se guardan con `set_password()` (PBKDF2 + sal), nunca en texto plano.
- Al crear, la contraseña es obligatoria: no se puede dejar una cuenta sin clave.
- Crear un usuario en el panel **no** lo hace superusuario: eso solo se hace por consola o por `/admin/`.

### 5.3 Editar, desactivar y eliminar

| Acción | Cómo | Efecto |
|---|---|---|
| Editar datos | Listado → **Editar** | Cambia nombre, correo o rol |
| Cambiar contraseña | Editar → escribir en los dos campos | Si se dejan vacíos, la clave actual se mantiene |
| Desactivar | Editar → desmarcar **Cuenta activa** | No puede iniciar sesión, pero su historial se conserva |
| Eliminar | Listado → **Eliminar** → confirmar | Borra la cuenta definitivamente |

> **Recomendación:** para dar de baja a alguien, **desactivar** antes que eliminar.

### 5.4 Crear por consola (si no hay acceso al panel)

```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

Usuario = get_user_model()
grupo = Group.objects.get_or_create(name="Funcionarios municipales")[0]

u = Usuario.objects.create_user(
    username="kmontt",
    password="Casablanca2026",
    first_name="Karla",
    last_name="Montt",
    email="kmontt@municipalidad.cl",
)
u.is_staff = False      # True solo si debe entrar a /admin/
u.save()
u.groups.add(grupo)     # esto le da acceso a /gestion/
print(u.username, list(u.groups.values_list("name", flat=True)))
```

Comando de una línea para ver todos los usuarios y sus roles:

```bash
python manage.py shell -c "from django.contrib.auth import get_user_model as g; print(list(g().objects.values_list('username','is_staff','is_superuser','is_active')))"
```

### 5.5 Casos especiales

| Situación | Qué hacer |
|---|---|
| La persona olvidó su contraseña | Editar → escribir clave nueva en los dos campos |
| Quiero que sea admin | Editar → marcar **Administrador** (equivale a `is_staff`) |
| Quiero un superusuario | `python manage.py createsuperuser` (solo por consola) |
| Un funcionario ve el mensaje "no tiene permisos" | Verificar que esté en el grupo y que la cuenta esté activa |
| Un funcionario no puede entrar a `/admin/` | Es correcto: `is_staff = False` |

---

## 6. Crear y administrar atractivos

### 6.1 Antes de crear: las categorías

Las categorías se administran **solo desde `/admin/`** (el panel no las edita).

1. `/admin/` → **Categorías** → **Añadir**.
2. Nombre (ej. `Patrimonio`, `Naturaleza`, `Cultura y vida costera`).
3. Dejar **Activa** marcada: si se desmarca, **todos** sus atractivos desaparecen del sitio público.

Existen 2 categorías cargadas.

### 6.2 Crear el atractivo desde el panel

Ruta: `/gestion/atractivos/` → **Nuevo atractivo**.

| Campo | Obligatorio | Explicación |
|---|---|---|
| **Nombre** | ✅ | Genera automáticamente el slug de la URL (`Playa Blanca` → `playa-blanca`) |
| **Descripción** | ✅ | Texto principal. En la tarjeta se recortan las primeras 24 palabras; en la ficha se ve completa |
| **Categoría** | ✅ | Debe existir antes. Si no hay ninguna, el selector aparece vacío |
| **Zona** | ✅ | **Casablanca** o **Quintay**. Es lo que decide en cuál de las dos grillas aparece |
| **Dirección** | ❌ | Si se completa, la ficha muestra el botón "Cómo llegar" a Google Maps |
| **Publicado** | — | **Viene desmarcado.** Si no se marca, el atractivo existe en la base pero **no se ve en el sitio** |

### 6.3 Imágenes

El formulario trae **3 filas** de imagen. Cada fila tiene:

| Campo | Qué hace |
|---|---|
| Imagen | Archivo que se sube a `media/atractivos/` |
| Texto alternativo | Descripción para accesibilidad y SEO. Si se deja vacío, se usa el nombre del atractivo |
| Es portada | Marca la imagen principal. **Solo una puede estar marcada** |
| Orden | Número menor = aparece primero |
| (Eliminar) | Casilla para borrar una imagen existente al guardar |

Reglas:

- Si marcas dos portadas, el formulario rechaza el guardado: *"Solo puedes marcar una imagen como portada."*
- Si no marcas ninguna, **se usa la primera según el orden**.
- Las imágenes no se comprimen: sube archivos de menos de ~500 KB para no castigar la carga.
- Para agregar más de 3 imágenes, guardar y volver a editar: aparecen 3 filas nuevas.

### 6.4 Secciones y recomendaciones (solo desde `/admin/`)

El panel **no** edita estos dos bloques. Se hacen en `/admin/` → **Atractivos** → abrir el atractivo, donde aparecen como bloques dentro de la misma página:

- **Secciones:** título + contenido. Salen en la ficha como subtítulos (ej. "Historia", "Qué encontrarás").
- **Recomendaciones:** una línea de texto cada una. Salen como lista numerada.

### 6.5 Publicar, despublicar y cambiar de zona

| Quiero… | Qué hacer |
|---|---|
| Que aparezca en el sitio | Editar → marcar **Publicado** |
| Ocultarlo sin borrarlo | Editar → desmarcar **Publicado** |
| Moverlo de Casablanca a Quintay | Editar → cambiar **Zona** |
| Que desaparezca de ambas grillas | Despublicarlo, o desactivar su categoría |

### 6.6 Checklist para que un atractivo se vea

1. `publicado = True`.
2. Su categoría tiene `activa = True`.
3. Tiene al menos una imagen (si no, la tarjeta queda sin foto).
4. La zona es la correcta.
5. Estás mirando la grilla que corresponde: arriba Casablanca, abajo Quintay.

### 6.7 Editar y eliminar

- **Editar:** listado → **Editar**. Al guardar se actualiza `fecha_actualizacion` sola.
- **Eliminar:** listado → **Eliminar** → confirmar. Se borran también sus imágenes, secciones y recomendaciones (`CASCADE`).
- No se puede eliminar una **categoría** que tenga atractivos: la base lo impide (`PROTECT`). Primero hay que mover o borrar los atractivos.

### 6.8 Limitaciones actuales del panel de atractivos

- No tiene buscador ni paginación: con muchos registros se vuelve una lista larga.
- El formulario se muestra con `form.as_p`, así que no usa el diseño de tarjetas del resto del panel.
- No permite editar secciones ni recomendaciones (ver 6.4).
- No muestra la zona en el listado.

---

## 7. Flujo completo de ejemplo

Objetivo: publicar "Humedal del Estero de Jote" en Quintay.

1. Entrar como **admin** a `/gestion/`.
2. Ir a **Atractivos** → **Nuevo atractivo**.
3. Nombre: `Humedal del Estero de Jote`.
4. Descripción: dos o tres frases.
5. Categoría: `Naturaleza`.
6. Zona: **Quintay**.
7. Dirección: `Quintay, Casablanca`.
8. Marcar **Publicado**.
9. Subir una imagen, escribir el texto alternativo y marcar **Es portada**.
10. Guardar → vuelve al listado con el aviso verde.
11. Ir a `/atractivos/`: el atractivo aparece en la **grilla de Quintay**.
12. Hacer clic en la tarjeta: la ficha se abre con la descripción real.
13. (Opcional) En `/admin/` → Atractivos → abrirlo y agregar una sección "Historia" y dos recomendaciones.
14. Volver a `/atractivos/` y comprobar que la ficha ya muestra esos bloques.

---

## 8. Comandos útiles

| Comando | Para qué |
|---|---|
| `python manage.py runserver` | Levantar el sitio |
| `python manage.py check` | Verificar que no haya errores de configuración |
| `python manage.py test` | Ejecutar las pruebas (hoy: 2 pasan, 1 falla) |
| `python manage.py makemigrations` | Crear migración tras cambiar un modelo |
| `python manage.py migrate` | Aplicar migraciones a la base |
| `python manage.py createsuperuser` | Crear un superusuario |
| `python manage.py shell` | Consola interactiva con el ORM cargado |
| `python manage.py collectstatic` | Reunir estáticos para producción |
| `python manage.py dumpdata turismo --indent 2 > respaldo.json` | Respaldo de datos del catálogo |
| `python manage.py loaddata respaldo.json` | Restaurar ese respaldo |

Respaldo simple de toda la base (con el servidor detenido):

```powershell
Copy-Item db.sqlite3 "db-$(Get-Date -Format yyyyMMdd).sqlite3"
```

---

## 9. Problemas comunes

| Síntoma | Causa | Solución |
|---|---|---|
| La grilla de **Quintay** está vacía | Todos los atractivos tienen zona `casablanca` | Editar alguno y cambiar la zona |
| Un atractivo no aparece en el sitio | `publicado` desmarcado o categoría inactiva | Revisar ambos en `/gestion/` o `/admin/` |
| La tarjeta se ve sin imagen | El atractivo no tiene imágenes | Subir al menos una |
| La imagen subida da error 404 | `DEBUG=False` o falta `media/` | En desarrollo `DEBUG=True` sirve `/media/`; en producción lo configura el servidor |
| Fondo gris en Noticias, Quintay o Ruta del Vino | El CSS apunta a `../img/` y las fotos están en `static/images/` | Corregir `noticias.css:26`, `quintay.css:396`, `ruta-vino.css:14` |
| El login dice "no tiene permisos de funcionario" | No está en el grupo o está inactivo | Agregarlo al grupo / reactivar |
| En `/admin/` sale "Please enter the correct username and password for a staff account" | `is_staff = False` | Es correcto: usar `/gestion/`, o marcarlo como Administrador |
| `no such table: turismo_atractivo` | Falta migrar | `python manage.py migrate` |
| `python manage.py test` falla 1 de 3 | El POST del test no envía `zona`, campo ahora obligatorio | Agregar `"zona": "casablanca"` en `tests.py` |
| Al guardar un atractivo no pasa nada | Falta un campo obligatorio o hay dos portadas | Revisar los mensajes en rojo del formulario |
| Los estilos no cargan tras poner `DEBUG=False` | No se ejecutó `collectstatic` ni hay servidor de estáticos | `collectstatic` + WhiteNoise o servidor web |

---

## 10. Qué debe continuar

### 10.1 Primero: cerrar lo que ya existe (medio día)

Nada de esto agrega funcionalidad, pero sin esto el proyecto se ve inacabado:

| # | Tarea | Dónde | Tiempo |
|---|---|---|---|
| 1 | Arreglar el test que falla y ampliar a editar / eliminar / permisos / login | `turismo/tests.py` | 30 min |
| 2 | Renombrar `resgistration` → `registration` (y actualizar `template_name`) | `templates/`, `views.py` | 5 min |
| 3 | Corregir los 3 fondos CSS (`../img/` → `../images/`) | `static/css/` | 5 min |
| 4 | Crear `templates/atractivo_detalle.html` propio (hoy usa una plantilla del panel) | `templates/` | 15 min |
| 5 | Borrar `templates/atractivo_dialogo.html`, `static/js/atractivos.js` y el `id="descubre"` duplicado | — | 10 min |
| 6 | Cargar el catálogo completo y repartirlo entre las dos zonas | `/gestion/` | 20 min |
| 7 | `base.html` para las 8 plantillas públicas (hoy el header y el footer están copiados) | `templates/` | 2 h |
| 8 | Reescribir el `README.md` (describe un frontend estático que ya no existe) | raíz | 10 min |

### 10.2 Después: los sprints del informe de diseño

| Sprint | Módulo | Requerimientos | Entregable mínimo |
|---|---|---|---|
| **2** | Rutas autoguiadas | RF-03, RF-04, RF-05, RF-06 | Modelos `Ruta` y `Hito`; página de ruta con hitos; botones anterior/siguiente; QR por hito |
| **3** | Perfilamiento | RF-09, RF-10, RF-11, RF-12 | Rol prestador, modelo de registro de visitantes y validaciones |
| **4** | Gestión y análisis | RF-15, RF-16 | Consolidado e indicadores con gráficos |
| **5** | Mapa | RF-07, RF-08 | Latitud/longitud en `Atractivo`, mapa Leaflet y popups con ficha |

### 10.3 Transversal a todos los sprints

- **Decidir la base de datos**: hoy SQLite; el informe deja PostgreSQL "por validar". Si se decide, es cambiar `DATABASES` y migrar los datos.
- **Preparar el despliegue**: `DEBUG=False`, `ALLOWED_HOSTS`, `SECRET_KEY` en variable de entorno, `gunicorn`, `whitenoise`.
- **HTTPS**: obligatorio para RNF-08 y para el login.
- **Respaldos**: hoy no hay ninguno y `db.sqlite3` no está en Git.
- **Pruebas automatizadas de verdad**: hoy 3 tests; el informe menciona pytest, Selenium, Lighthouse y k6.

---

## 11. Qué falta por agregar

### 11.1 Funcionalidad (RF)

| RF | Estado | Qué falta exactamente |
|---|---|---|
| RF-01 Información turística | 🟡 | Modelos y CRUD para **noticias**, **viñas/bodegas** y **ruta del vino** (hoy son plantillas fijas) |
| RF-02 Multimedia | 🟡 | Galería de imágenes en la ficha (hoy solo portada); soporte de video/audio; compresión automática |
| RF-03 Rutas autoguiadas | ❌ | Modelo `Ruta` (nombre, descripción, duración, dificultad) y relación con atractivos |
| RF-04 Hitos de una ruta | ❌ | Modelo `Hito` (orden, título, contenido, atractivo asociado) y vista de recorrido |
| RF-05 Navegación entre hitos | ❌ | Botones anterior/siguiente, indicador de progreso y "finalizar ruta" |
| RF-06 Códigos QR | ❌ | Generar QR por hito y URL corta de destino; probar impresos |
| RF-07 Mapa turístico | ❌ | Campos `latitud`/`longitud` en `Atractivo`; integrar Leaflet; marcadores |
| RF-08 Puntos de interés | ❌ | Popup con nombre, foto y enlace a la ficha; filtros por zona |
| RF-09 Autenticación de prestadores | ❌ | Grupo/rol `Prestador`, modelo `Organizacion` y registro asociado |
| RF-10 Registro de visitantes | ❌ | Modelo `RegistroVisita`: edad, género, procedencia, motivación, gasto, duración |
| RF-11 Validación de esos datos | ❌ | Validaciones de rango y obligatoriedad en el formulario de registro |
| RF-12 Gestión por prestador | ❌ | Que un prestador vea y corrija **solo** sus registros |
| RF-13 Autenticación de administradores | ✅ | (Mejora: límite de intentos fallidos, expiración de sesión) |
| RF-14 Administración de contenido | 🟡 | CRUD de categorías, secciones y recomendaciones desde el panel; CRUD de noticias y viñas |
| RF-15 Información consolidada | ❌ | Vista con filtros por fecha, zona y procedencia |
| RF-16 Indicadores | ❌ | Gráficos (Chart.js) y exportación a CSV |

### 11.2 Calidad y seguridad (RNF)

| RNF | Estado | Qué falta |
|---|---|---|
| RNF-01 Móvil | ✅ | Probar en teléfono real y corregir detalles |
| RNF-02 Usabilidad | ✅ | — |
| RNF-03 Accesibilidad | 🟡 | Auditoría Lighthouse/WAVE, contraste, orden de tabulación, foco visible |
| RNF-04 Rendimiento | 🟡 | Medir, comprimir imágenes, cache, `collectstatic` |
| RNF-05 Disponibilidad | ❌ | Hosting, monitoreo y plan de mantenimiento |
| RNF-06 Roles | 🟡 | Falta el rol prestador; usar los 44 permisos en vez de solo el grupo |
| RNF-07 Credenciales | ✅ | Usar `validate_password` en `UsuarioForm` en vez de "8 caracteres" |
| RNF-08 HTTPS | ❌ | Certificado y configuración `SECURE_*` al desplegar |
| RNF-09 Minimización de datos | 🟡 | Definir qué se guarda cuando exista RF-10 y durante cuánto tiempo |
| RNF-10 Integridad | 🟡 | Validaciones del registro de visitantes |
| RNF-11 Respaldos | ❌ | Script periódico de `db.sqlite3` (o PostgreSQL) y prueba de restauración |
| RNF-12 Mantenibilidad | 🟡 | `base.html`, separar en apps (`catalogo`, `rutas`, `perfilamiento`) |

### 11.3 Deuda técnica concreta

| # | Problema | Arreglo |
|---|---|---|
| 1 | 1 de 3 tests falla (`zona` faltante en el POST) | Agregar el campo al test |
| 2 | `templates/resgistration/` mal escrito **y usado** por la vista | Renombrar carpeta y `template_name` |
| 3 | `/atractivos/<slug>/` renderiza `gestion/atractivo_detalle.html` | Plantilla pública propia o eliminar la ruta |
| 4 | `../img/` en 3 CSS | Cambiar a `../images/` |
| 5 | `id="descubre"` duplicado en `index.html` | Renombrar una sección |
| 6 | `templates/atractivo_dialogo.html` y `static/js/atractivos.js` sin uso | Borrar |
| 7 | `SECRET_KEY` escrita en `settings.py` | Variable de entorno |
| 8 | `DEBUG = True` permanente | Settings separados de producción |
| 9 | `requirements.txt` sin `gunicorn` ni `whitenoise` | Agregarlos |
| 10 | `README.md` desactualizado | Reescribir |
| 11 | Listado de atractivos sin buscador ni paginación | Agregar `Paginator` y filtro |
| 12 | El panel no edita secciones ni recomendaciones | Formset o CRUD propio |
| 13 | Contenido de la base no se traduce | Modelos de traducción o decidir que solo se traduce la interfaz |

### 11.4 Contenido pendiente

- Completar el catálogo de atractivos (hoy hay **3** cargados, todos en Casablanca).
- Fotos definitivas con derechos de uso, optimizadas.
- Textos revisados por el área de Turismo.
- Datos de contacto y horarios reales.
- Definir si las noticias se cargan a mano o desde un modelo.

---

## 12. Checklist antes de publicar

**Código**

- [ ] `python manage.py check` sin errores.
- [ ] `python manage.py test` en verde y con cobertura de CRUD, permisos y login.
- [ ] Sin archivos sin uso ni plantillas duplicadas.
- [ ] `README.md` actualizado.

**Seguridad**

- [ ] `DEBUG = False`.
- [ ] `SECRET_KEY` en variable de entorno.
- [ ] `ALLOWED_HOSTS` con el dominio real.
- [ ] HTTPS activo y `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`.
- [ ] Usuarios de prueba eliminados o desactivados.
- [ ] Permisos revisados: nadie de más en el grupo de funcionarios.

**Datos**

- [ ] Base de datos definitiva (SQLite o PostgreSQL) y migrada.
- [ ] Respaldo probado (generar y **restaurar**).
- [ ] Imágenes en `media/` con respaldo aparte.

**Operación**

- [ ] Hosting y dominio definidos.
- [ ] `collectstatic` y servidor de estáticos configurado.
- [ ] Responsable de actualizar contenidos designado.
- [ ] Documentado cómo dar de alta un funcionario nuevo.

---

*Documento generado a partir del estado real del repositorio: modelos, vistas, formularios, plantillas, tests y base de datos.*
