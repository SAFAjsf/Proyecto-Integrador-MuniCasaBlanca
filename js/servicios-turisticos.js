
/* ==========================================
   FUNCIONALIDAD DEL DIRECTORIO TURÍSTICO
   Casablanca, Chile
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";

  const establecimientos = window.ServiciosTuristicosData || [];

  const buscador = document.getElementById("services-search");
  const filtroCategoria = document.getElementById("services-category");
  const filtroLocalidad = document.getElementById("services-location");
  const botonReset = document.getElementById("services-reset");

  const contenedor = document.getElementById("services-grid");
  const contador = document.getElementById("services-results-count");
  const mensajeVacio = document.getElementById("services-empty");

  if (
    !buscador ||
    !filtroCategoria ||
    !filtroLocalidad ||
    !contenedor ||
    !contador
  ) {
    return;
  }


  // ========================================
  // TRADUCCIONES
  // ========================================

  function traducir(clave) {
    return window.CasablancaI18n
      ? window.CasablancaI18n.t(clave)
      : clave;
  }


  // ========================================
  // NORMALIZAR TEXTO PARA BÚSQUEDAS
  // ========================================

  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }


  // ========================================
  // PREPARAR LOCALIDADES
  // ========================================

  function prepararLocalidades() {

    const localidades = [
      ...new Set(
        establecimientos
          .map(item => item.localidad)
          .filter(Boolean)
      )
    ].sort((a, b) => a.localeCompare(b, "es"));

    localidades.forEach(localidad => {

      const opcion = document.createElement("option");

      opcion.value = localidad;
      opcion.textContent = localidad;

      filtroLocalidad.appendChild(opcion);

    });

  }


  // ========================================
  // OBTENER CATEGORÍA TRADUCIDA
  // ========================================

  function obtenerCategoria(categoria) {

    const categorias = {
      gastronomia: "services.category.food",
      alojamiento: "services.category.stay",
      experiencia: "services.category.experience"
    };

    return traducir(categorias[categoria] || categoria);

  }


  // ========================================
  // CREAR ELEMENTO DE CONTACTO
  // ========================================

  function crearDetalle(etiqueta, valor) {

    if (!valor) return null;

    const fila = document.createElement("div");
    fila.className = "service-card-detail";

    const titulo = document.createElement("strong");
    titulo.textContent = traducir(etiqueta);

    const contenido = document.createElement("span");
    contenido.textContent = valor;

    fila.append(titulo, contenido);

    return fila;

  }


  // ========================================
  // CREAR TARJETA
  // ========================================

  function crearTarjeta(servicio) {

    const tarjeta = document.createElement("article");
    tarjeta.className = "service-card";
    tarjeta.dataset.id = servicio.id;

    // Encabezado

    const encabezado = document.createElement("div");
    encabezado.className = "service-card-top";

    const categoria = document.createElement("span");
    categoria.className = "service-card-category";
    categoria.textContent = obtenerCategoria(servicio.categoria);

    const localidad = document.createElement("span");
    localidad.className = "service-card-location";
    localidad.textContent = servicio.localidad || "";

    encabezado.append(categoria, localidad);

    // Nombre

    const nombre = document.createElement("h3");
    nombre.textContent = servicio.nombre;

    tarjeta.append(encabezado, nombre);

    // Información adicional de experiencias

    if (servicio.experiencia) {

      const experiencia = document.createElement("p");

      experiencia.className = "service-card-experience";
      experiencia.textContent = servicio.experiencia;

      tarjeta.appendChild(experiencia);

    }

    // Datos de contacto

    const detalles = document.createElement("div");
    detalles.className = "service-card-details";

    const direccion = crearDetalle(
      "services.card.address",
      servicio.direccion
    );

    const telefono = crearDetalle(
      "services.card.phone",
      servicio.telefono
    );

    const correo = crearDetalle(
      "services.card.email",
      servicio.correo
    );

    if (direccion) detalles.appendChild(direccion);
    if (telefono) detalles.appendChild(telefono);
    if (correo) detalles.appendChild(correo);

    tarjeta.appendChild(detalles);

    return tarjeta;

  }


  // ========================================
  // FILTRAR ESTABLECIMIENTOS
  // ========================================

  function obtenerResultados() {

    const texto = normalizar(buscador.value);
    const categoriaSeleccionada = filtroCategoria.value;
    const localidadSeleccionada = filtroLocalidad.value;

    return establecimientos.filter(servicio => {

      const coincideNombre =
        normalizar(servicio.nombre).includes(texto);

      const coincideDireccion =
        normalizar(servicio.direccion).includes(texto);

      const coincideLocalidadTexto =
        normalizar(servicio.localidad).includes(texto);

      const coincideCategoria =
        categoriaSeleccionada === "todos" ||
        servicio.categoria === categoriaSeleccionada;

      const coincideLocalidad =
        localidadSeleccionada === "todos" ||
        servicio.localidad === localidadSeleccionada;

      const coincideBusqueda =
        !texto ||
        coincideNombre ||
        coincideDireccion ||
        coincideLocalidadTexto;

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincideLocalidad
      );

    });

  }


  // ========================================
  // ACTUALIZAR CONTADOR
  // ========================================

  function actualizarContador(cantidad) {

    const clave = cantidad === 1
      ? "services.results.one"
      : "services.results.many";

    contador.textContent = `${cantidad} ${traducir(clave)}`;

  }


  // ========================================
  // MOSTRAR RESULTADOS
  // ========================================

  function renderizarServicios() {

    const resultados = obtenerResultados();

    contenedor.replaceChildren();

    resultados.forEach(servicio => {

      const tarjeta = crearTarjeta(servicio);

      contenedor.appendChild(tarjeta);

    });

    actualizarContador(resultados.length);

    mensajeVacio.hidden = resultados.length !== 0;

  }


  // ========================================
  // RESTABLECER FILTROS
  // ========================================

  function limpiarFiltros() {

    buscador.value = "";
    filtroCategoria.value = "todos";
    filtroLocalidad.value = "todos";

    renderizarServicios();

  }


  // ========================================
  // EVENTOS
  // ========================================

  buscador.addEventListener("input", renderizarServicios);

  filtroCategoria.addEventListener("change", renderizarServicios);

  filtroLocalidad.addEventListener("change", renderizarServicios);

  if (botonReset) {
    botonReset.addEventListener("click", limpiarFiltros);
  }


  // ========================================
  // CAMBIO DE IDIOMA
  // ========================================

  document.addEventListener("casablanca:languagechange", () => {

    renderizarServicios();

  });


  // ========================================
  // INICIALIZACIÓN
  // ========================================

  prepararLocalidades();

  // Permite abrir el directorio directamente
  // con una localidad seleccionada.
  const parametros = new URLSearchParams(window.location.search);
  const localidadInicial = parametros.get("localidad");

  if (localidadInicial) {

    const opcionDisponible = Array.from(filtroLocalidad.options)
      .some(opcion => normalizar(opcion.value) === normalizar(localidadInicial));

    if (opcionDisponible) {
      const opcion = Array.from(filtroLocalidad.options)
        .find(opcion => normalizar(opcion.value) === normalizar(localidadInicial));

      filtroLocalidad.value = opcion.value;
    }

  }

  renderizarServicios();

});
