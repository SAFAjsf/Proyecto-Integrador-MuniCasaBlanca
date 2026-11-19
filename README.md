# Casablanca — Portal turístico municipal

Portal turístico de la Municipalidad de Casablanca (Chile), con catálogo de
atractivos, versionado editorial y panel de gestión.

## Estructura

- `src/` — proyecto Django (apps, templates, static).
- `src/apps/catalog/` — catálogo, versionado editorial, formularios y permisos.
- `src/apps/accounts/` — usuarios y roles del panel.
- `src/apps/audit/` — eventos editoriales.
- `src/apps/mediafiles/` — proxy de archivos multimedia.
- `src/apps/weather/` — integración meteorológica.
- `src/templates/gestion/` — plantillas del panel.
- `src/static/` — CSS y JS.

## Desarrollo local

```powershell
cd src
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env   # completar DJANGO_SECRET_KEY
python manage.py migrate
python manage.py runserver
```

## Pruebas

```powershell
cd src
python manage.py check
python manage.py test
```

## Notas

- El entorno virtual (`.venv/`) y la base de datos (`db.sqlite3`) no se
  versionan (ver `.gitignore`).
- La importación del catálogo inicial se hace con
  `python manage.py cargar_catalogo_demo`.