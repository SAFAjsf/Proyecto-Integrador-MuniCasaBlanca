# Casablanca — Frontend Unidad 3

Frontend inicial estático para la plataforma turística de Casablanca. Incluye cinco páginas públicas y está preparado para una futura integración con Django.

## Páginas
- `index.html`: página principal.
- `pages/historia.html`: historia y museo, con línea temporal interactiva.
- `pages/vinas.html`: valle, vino y naturaleza.
- `pages/quintay.html`: atractivos y patrimonio costero.
- `pages/como-llegar.html`: orientación de llegada desde Santiago y Valparaíso.

## Ejecutar localmente
Abrir `index.html` en un navegador o utilizar la extensión Live Server de Visual Studio Code. No requiere dependencias de Node ni servidor backend para esta versión estática.

## Organización
- `css/base.css`: tokens visuales, navegación, botones, footer y estilos compartidos.
- Un CSS por página para facilitar mantenimiento.
- `js/translations.js` y `js/i18n.js`: catálogo de español, inglés y portugués, con selector de idioma para navegación y textos comunes del pie.
- `js/main.js`: menú móvil, accesos rápidos a las secciones de cada página y línea temporal de Historia.
- `img/`: imágenes optimizadas copiadas del prototipo recibido.

## Integración futura con Django
El equipo de backend puede mover las páginas a `templates/` y los recursos a `static/`. Los enlaces y referencias a imágenes/CSS/JS deberán convertirse a `{% url %}` y `{% static %}` según las rutas y nombres definitivos de la aplicación Django.

## Pendientes antes de publicar
- Validar con el museo los textos históricos y los horarios vigentes.
- Incorporar fotografías definitivas y autorizadas para Quintay y sus atractivos específicos.
- Añadir enlaces oficiales de transporte y verificar rutas, horarios y tarifas antes de publicar datos concretos.
- Definir criterios municipales para incluir prestadores turísticos.
- Ejecutar pruebas de accesibilidad, responsive, enlaces y rendimiento.
- Añadir traducciones completas si se confirma que el inglés formará parte de esta entrega.

Los datos de transporte y horarios no se han inventado; las páginas los identifican como información que debe confirmarse antes de su publicación.
