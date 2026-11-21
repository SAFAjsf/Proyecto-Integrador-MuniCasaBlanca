
/* =========================================
   MAPA INTERACTIVO DE QUINTAY
   Casablanca Chile
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";

  /*
   * CONFIGURACIÓN DE BACKEND
   *
   * Dejar vacío mientras el endpoint no esté definido.
   * Cuando el encargado de Django confirme la ruta,
   * se podrá configurar aquí.
   *
   * Ejemplo ilustrativo:
   * const API_ENDPOINT = "/api/atractivos/quintay/";
   *
   * No utilizar esa ruta hasta que el backend la confirme.
   */

  const API_ENDPOINT = "";


  /* =========================================
     DATOS INICIALES
  ========================================= */

  const atractivosLocales = [

    {
      id: 1,
      nombre: "Cerro Curauma",
      imagen: "../img/quintay/cerro-curauma.jpg",
      descripcion: "Atractivo identificado en el mapa turístico municipal de Quintay.",
      ubicacion: "Quintay",
      x: 66.2,
      y: 0.0
    },

    {
      id: 2,
      nombre: "Cueva del Pirata",
      imagen: "../img/quintay/cueva-pirata.jpg",
      descripcion: "Punto de interés identificado en el mapa turístico municipal.",
      ubicacion: "Quintay",
      x: 68.3,
      y: 5.7
    },

    {
      id: 3,
      nombre: "Playa Grande",
      imagen: "../img/quintay/playa-grande.jpg",
      descripcion: "Playa identificada entre los principales atractivos costeros de Quintay.",
      ubicacion: "Quintay",
      x: 68.2,
      y: 12.7
    },

    {
      id: 4,
      nombre: "Humedal El Jote",
      imagen: "../img/quintay/humedal-jote.jpg",
      descripcion: "Humedal identificado en el mapa turístico municipal de Quintay.",
      ubicacion: "Quintay",
      x: 87.3,
      y: 17.9
    },

    {
      id: 5,
      nombre: "Centro Recreacional Quintay",
      imagen: "../img/quintay/centro-recreacional.jpg",
      descripcion: "Centro recreacional señalado en el mapa turístico municipal.",
      ubicacion: "Quintay",
      x: 91.4,
      y: 29.3
    },

    {
      id: 6,
      nombre: "Iglesia Católica",
      imagen: "../img/quintay/iglesia-catolica.jpg",
      descripcion: "Punto de interés religioso identificado en el mapa municipal.",
      ubicacion: "Quintay",
      x: 55.4,
      y: 41.9
    },

    {
      id: 7,
      nombre: "Iglesia Evangélica",
      imagen: "../img/quintay/iglesia-evangelica.jpg",
      descripcion: "Punto de interés religioso identificado en el mapa municipal.",
      ubicacion: "Quintay",
      x: 70.1,
      y: 36.1
    },

    {
      id: 8,
      nombre: "Escuela San Pedro",
      imagen: "../img/quintay/escuela-san-pedro.jpg",
      descripcion: "Establecimiento educacional identificado en el mapa turístico municipal.",
      ubicacion: "Quintay",
      x: 91.8,
      y: 35.9
    },

    {
      id: 9,
      nombre: "Plaza",
      imagen: "../img/quintay/plaza.jpg",
      descripcion: "Espacio público identificado en el mapa turístico municipal.",
      ubicacion: "Quintay",
      x: 54.5,
      y: 49.8
    },

    {
      id: 10,
      nombre: "Caleta",
      imagen: "../img/quintay/caleta.jpg",
      descripcion: "Sector de la caleta identificado en el mapa turístico municipal.",
      ubicacion: "Quintay",
      x: 34.4,
      y: 42.2
    },

    {
      id: 11,
      nombre: "Feria Artesanal",
      imagen: "../img/quintay/feria-artesanal.jpg",
      descripcion: "Feria artesanal identificada en el mapa turístico municipal.",
      ubicacion: "Quintay",
      x: 20.7,
      y: 35.4
    },

    {
      id: 12,
      nombre: "Muelle",
      imagen: "../img/quintay/muelle.jpg",
      descripcion: "Muelle identificado entre los puntos de interés del mapa municipal.",
      ubicacion: "Quintay",
      x: 23.8,
      y: 28.7
    },

    {
      id: 13,
      nombre: "Museo Ex Ballenera",
      imagen: "../img/quintay/museoballenera.jpg",
      descripcion: "Museo identificado en el mapa turístico municipal de Quintay.",
      ubicacion: "Quintay",
      x: 15.1,
      y: 31.4
    },

    {
      id: 14,
      nombre: "Universidad Andrés Bello",
      imagen: "../img/quintay/andres-bello.jpg",
      descripcion: "Institución identificada en el mapa turístico municipal.",
      ubicacion: "Quintay",
      x: 13.0,
      y: 35.5
    },

    {
      id: 15,
      nombre: "Playa Chica",
      imagen: "../img/quintay/playa-chica.jpg",
      descripcion: "Playa identificada entre los atractivos costeros de Quintay.",
      ubicacion: "Quintay",
      x: 61.4,
      y: 69.4
    }

  ];


  /* =========================================
     TRADUCCIONES LOCALES
  ========================================= */

  const textos = {

    es: {
      heroEyebrow: "QUINTAY · COSTA DE CASABLANCA",
      heroTitle: "Explora Quintay.",
      heroDescription: "Descubre sus playas, paisajes, patrimonio y lugares característicos mediante el mapa turístico de la localidad.",
      heroButton: "Explorar el mapa",
      introEyebrow: "DESCUBRE LA COSTA",
      introTitle: "15 lugares para descubrir.",
      introDescription: "Selecciona los números del mapa para conocer los distintos atractivos que forman parte de Quintay.",
      mapEyebrow: "EXPLORACIÓN INTERACTIVA",
      mapTitle: "Mapa turístico de Quintay",
      reset: "Restablecer selección",
      expand: "Ampliar mapa",
      mapInstruction: "Selecciona un número para conocer cada atractivo.",
      mapSource: "Material turístico municipal de Quintay.",
      cardEyebrow: "DESCUBRE QUINTAY",
      cardTitle: "Elige tu próximo destino.",
      cardDescription: "Selecciona uno de los puntos numerados del mapa para conocer más sobre ese lugar.",
      counterTitle: "Lugares identificados",
      counterDescription: "Disponibles para explorar",
      detailEyebrow: "ATRACTIVO TURÍSTICO · QUINTAY",
      locationLabel: "Localidad",
      detailNote: "Información descriptiva preliminar basada en la identificación del mapa municipal. Su contenido puede ampliarse con información oficial.",
      legendTitle: "SIMBOLOGÍA DEL MAPA MUNICIPAL",
      legendDescription: "El mapa también identifica servicios y referencias útiles para los visitantes.",
      legendParking: "Estacionamiento",
      legendFishing: "Zona de pesca",
      legendDiving: "Escuela de buceo",
      legendMedical: "Centro médico",
      legendMuseum: "Museo",
      legendLodging: "Alojamiento",
      legendFood: "Gastronomía",
      legendMarket: "Supermercado",
      legendFire: "Bomberos",
      closingEyebrow: "HISTORIAS ENTRE EL VALLE Y EL MAR",
      closingTitle: "Quintay tiene mucho más por descubrir.",
      closingDescription: "Continúa explorando la costa y los demás atractivos de la comuna de Casablanca.",
      backButton: "Volver a Quintay",
      dialogTitle: "Mapa turístico de Quintay",
      dialogInstruction: "Selecciona un número para consultar su información.",
      markerLabel: "Ver información de",
      imageAlt: "Fotografía de"
    },

    en: {
      heroEyebrow: "QUINTAY · CASABLANCA COAST",
      heroTitle: "Explore Quintay.",
      heroDescription: "Discover its beaches, landscapes, heritage and characteristic places through the local tourist map.",
      heroButton: "Explore the map",
      introEyebrow: "DISCOVER THE COAST",
      introTitle: "15 places to discover.",
      introDescription: "Select the numbers on the map to learn about Quintay's different attractions.",
      mapEyebrow: "INTERACTIVE EXPLORATION",
      mapTitle: "Quintay tourist map",
      reset: "Reset selection",
      expand: "Enlarge map",
      mapInstruction: "Select a number to learn about each attraction.",
      mapSource: "Quintay municipal tourism material.",
      cardEyebrow: "DISCOVER QUINTAY",
      cardTitle: "Choose your next destination.",
      cardDescription: "Select a numbered point on the map to learn more about that place.",
      counterTitle: "Identified places",
      counterDescription: "Available to explore",
      detailEyebrow: "TOURIST ATTRACTION · QUINTAY",
      locationLabel: "Location",
      detailNote: "Preliminary descriptive information based on the municipal map. Further official information may be added.",
      legendTitle: "MUNICIPAL MAP LEGEND",
      legendDescription: "The map also identifies useful services and visitor references.",
      legendParking: "Parking",
      legendFishing: "Fishing area",
      legendDiving: "Diving school",
      legendMedical: "Medical center",
      legendMuseum: "Museum",
      legendLodging: "Accommodation",
      legendFood: "Food and dining",
      legendMarket: "Supermarket",
      legendFire: "Fire station",
      closingEyebrow: "STORIES BETWEEN THE VALLEY AND THE SEA",
      closingTitle: "There is much more to discover in Quintay.",
      closingDescription: "Continue exploring the coast and other attractions in the Casablanca municipality.",
      backButton: "Back to Quintay",
      dialogTitle: "Quintay tourist map",
      dialogInstruction: "Select a number to view its information.",
      markerLabel: "View information about",
      imageAlt: "Photograph of"
    },

    pt: {
      heroEyebrow: "QUINTAY · COSTA DE CASABLANCA",
      heroTitle: "Explore Quintay.",
      heroDescription: "Descubra suas praias, paisagens, patrimônio e lugares característicos por meio do mapa turístico local.",
      heroButton: "Explorar o mapa",
      introEyebrow: "DESCUBRA A COSTA",
      introTitle: "15 lugares para descobrir.",
      introDescription: "Selecione os números do mapa para conhecer os diferentes atrativos de Quintay.",
      mapEyebrow: "EXPLORAÇÃO INTERATIVA",
      mapTitle: "Mapa turístico de Quintay",
      reset: "Redefinir seleção",
      expand: "Ampliar mapa",
      mapInstruction: "Selecione um número para conhecer cada atrativo.",
      mapSource: "Material turístico municipal de Quintay.",
      cardEyebrow: "DESCUBRA QUINTAY",
      cardTitle: "Escolha seu próximo destino.",
      cardDescription: "Selecione um dos pontos numerados do mapa para saber mais sobre esse lugar.",
      counterTitle: "Lugares identificados",
      counterDescription: "Disponíveis para explorar",
      detailEyebrow: "ATRAÇÃO TURÍSTICA · QUINTAY",
      locationLabel: "Localidade",
      detailNote: "Informações descritivas preliminares baseadas no mapa municipal. O conteúdo poderá ser ampliado com informações oficiais.",
      legendTitle: "SIMBOLOGIA DO MAPA MUNICIPAL",
      legendDescription: "O mapa também identifica serviços e referências úteis para os visitantes.",
      legendParking: "Estacionamento",
      legendFishing: "Zona de pesca",
      legendDiving: "Escola de mergulho",
      legendMedical: "Centro médico",
      legendMuseum: "Museu",
      legendLodging: "Hospedagem",
      legendFood: "Gastronomia",
      legendMarket: "Supermercado",
      legendFire: "Bombeiros",
      closingEyebrow: "HISTÓRIAS ENTRE O VALE E O MAR",
      closingTitle: "Quintay tem muito mais para descobrir.",
      closingDescription: "Continue explorando a costa e os outros atrativos da comuna de Casablanca.",
      backButton: "Voltar a Quintay",
      dialogTitle: "Mapa turístico de Quintay",
      dialogInstruction: "Selecione um número para consultar suas informações.",
      markerLabel: "Ver informações sobre",
      imageAlt: "Fotografia de"
    },

    fr: {
      heroEyebrow: "QUINTAY · CÔTE DE CASABLANCA",
      heroTitle: "Explorez Quintay.",
      heroDescription: "Découvrez ses plages, ses paysages, son patrimoine et ses lieux emblématiques grâce à la carte touristique locale.",
      heroButton: "Explorer la carte",
      introEyebrow: "DÉCOUVREZ LA CÔTE",
      introTitle: "15 lieux à découvrir.",
      introDescription: "Sélectionnez les numéros sur la carte pour découvrir les différentes attractions de Quintay.",
      mapEyebrow: "EXPLORATION INTERACTIVE",
      mapTitle: "Carte touristique de Quintay",
      reset: "Réinitialiser la sélection",
      expand: "Agrandir la carte",
      mapInstruction: "Sélectionnez un numéro pour découvrir chaque attraction.",
      mapSource: "Documentation touristique municipale de Quintay.",
      cardEyebrow: "DÉCOUVREZ QUINTAY",
      cardTitle: "Choisissez votre prochaine destination.",
      cardDescription: "Sélectionnez un point numéroté sur la carte pour en savoir plus.",
      counterTitle: "Lieux identifiés",
      counterDescription: "Disponibles à explorer",
      detailEyebrow: "ATTRACTION TOURISTIQUE · QUINTAY",
      locationLabel: "Localité",
      detailNote: "Informations descriptives préliminaires basées sur la carte municipale. Le contenu pourra être complété avec des informations officielles.",
      legendTitle: "LÉGENDE DE LA CARTE MUNICIPALE",
      legendDescription: "La carte indique également des services et des repères utiles aux visiteurs.",
      legendParking: "Stationnement",
      legendFishing: "Zone de pêche",
      legendDiving: "École de plongée",
      legendMedical: "Centre médical",
      legendMuseum: "Musée",
      legendLodging: "Hébergement",
      legendFood: "Gastronomie",
      legendMarket: "Supermarché",
      legendFire: "Pompiers",
      closingEyebrow: "HISTOIRES ENTRE LA VALLÉE ET LA MER",
      closingTitle: "Quintay a encore beaucoup à faire découvrir.",
      closingDescription: "Continuez à explorer la côte et les autres attractions de la commune de Casablanca.",
      backButton: "Retour à Quintay",
      dialogTitle: "Carte touristique de Quintay",
      dialogInstruction: "Sélectionnez un numéro pour consulter ses informations.",
      markerLabel: "Voir les informations sur",
      imageAlt: "Photographie de"
    }

  };


  /* =========================================
     ELEMENTOS HTML
  ========================================= */

  const mapaMarcadores = document.getElementById("mq-markers");
  const mapaMarcadoresAmpliado = document.getElementById("mq-markers-expanded");

  const fichaInicial = document.getElementById("mq-initial");
  const fichaContenido = document.getElementById("mq-content");

  const fichaImagen = document.getElementById("mq-image");
  const fichaNumero = document.getElementById("mq-number");
  const fichaNombre = document.getElementById("mq-name");
  const fichaDescripcion = document.getElementById("mq-description");
  const fichaUbicacion = document.getElementById("mq-location");
  const ficha = document.getElementById("mq-card");

  const botonRestablecer = document.getElementById("mq-reset");
  const botonAmpliar = document.getElementById("mq-expand");

  const dialogo = document.getElementById("mq-dialog");
  const mapaViewport = document.getElementById("mq-map-viewport");
  const botonCerrar = document.getElementById("mq-close");
  const panelAmpliado = document.getElementById("mq-dialog-panel");
  const botonCerrarFicha = document.getElementById("mq-dialog-panel-close");
  const espacioFichaAmpliada = document.getElementById("mq-dialog-card-slot");

  const fichaPlaceholder = document.createComment(
    "Ubicación original de la ficha"
  );

  if (ficha && ficha.parentNode) {
    ficha.parentNode.insertBefore(fichaPlaceholder, ficha);
  }

  if (
    !mapaMarcadores ||
    !mapaMarcadoresAmpliado ||
    !fichaInicial ||
    !fichaContenido ||
    !fichaImagen ||
    !dialogo ||
    !mapaViewport ||
    !ficha ||
    !panelAmpliado ||
    !botonCerrarFicha ||
    !espacioFichaAmpliada
  ) {
    console.warn("No se encontraron todos los elementos del mapa de Quintay.");
    return;
  }


  /* =========================================
     ESTADO
  ========================================= */

  let atractivos = [...atractivosLocales];
  let atractivoSeleccionado = null;

  const idiomaActual = () => {
    return window.CasablancaI18n?.getLanguage?.() || "es";
  };

  const texto = (key) => {
    const idioma = idiomaActual();
    return textos[idioma]?.[key] || textos.es[key] || key;
  };


  /* =========================================
     TRADUCIR INTERFAZ LOCAL
  ========================================= */

  function traducirInterfaz() {

    document.querySelectorAll("[data-mq]").forEach((elemento) => {

      const key = elemento.dataset.mq;

      if (textos[idiomaActual()]?.[key]) {
        elemento.textContent = texto(key);
      }

    });

    if (atractivoSeleccionado !== null) {
      seleccionarAtractivo(atractivoSeleccionado);
    }

  }


  /* =========================================
     PREPARAR DATOS RECIBIDOS DEL BACKEND
  ========================================= */

  function normalizarAtractivos(datos) {

    if (!Array.isArray(datos)) {
      throw new Error("La respuesta del backend no contiene una lista de atractivos.");
    }

    return datos.map((item) => ({

      id: Number(item.id),

      nombre: item.nombre || item.name || `Atractivo ${item.id}`,

      imagen: item.imagen || item.image || "",

      descripcion:
        item.descripcion ||
        item.description ||
        "Información descriptiva pendiente de actualización.",

      ubicacion: item.ubicacion || item.location || "Quintay",

      x: Number(item.x),
      y: Number(item.y)

    })).filter((item) => (
      Number.isInteger(item.id) &&
      item.id > 0 &&
      Number.isFinite(item.x) &&
      Number.isFinite(item.y)
    ));

  }


  /* =========================================
     CARGAR DATOS
  ========================================= */

  async function cargarAtractivos() {

    if (!API_ENDPOINT) {
      return atractivosLocales;
    }

    try {

      const respuesta = await fetch(API_ENDPOINT, {
        headers: {
          "Accept": "application/json"
        }
      });

      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }

      const datos = await respuesta.json();

      const lista = normalizarAtractivos(datos);

      if (!lista.length) {
        throw new Error("El backend no devolvió atractivos válidos.");
      }

      return lista;

    } catch (error) {

      console.warn(
        "No fue posible cargar los atractivos desde Django. Se utilizarán los datos locales.",
        error
      );

      return atractivosLocales;

    }

  }


  /* =========================================
     GENERAR MARCADORES
  ========================================= */

  function generarMarcadores(contenedor) {

    contenedor.innerHTML = "";

    atractivos.forEach((atractivo) => {

      const marcador = document.createElement("button");

      marcador.type = "button";
      marcador.className = "mq-marker";

      marcador.textContent = atractivo.id;

      marcador.style.left = `${atractivo.x}%`;
      marcador.style.top = `${atractivo.y}%`;

      marcador.dataset.id = atractivo.id;

      marcador.setAttribute(
        "aria-label",
        `${texto("markerLabel")} ${atractivo.nombre}`
      );

      marcador.setAttribute("aria-pressed", "false");

      marcador.addEventListener("click", () => {
        seleccionarAtractivo(atractivo.id);
      });

      contenedor.appendChild(marcador);

    });

  }


  /* =========================================
     SELECCIONAR ATRACTIVO
  ========================================= */

  function seleccionarAtractivo(id) {

    const atractivo = atractivos.find(
      (item) => item.id === Number(id)
    );

    if (!atractivo) return;

    atractivoSeleccionado = atractivo.id;

    fichaInicial.hidden = true;
    fichaContenido.hidden = false;

    fichaNombre.textContent = atractivo.nombre;
    fichaDescripcion.textContent = atractivo.descripcion;
    fichaNumero.textContent = atractivo.id;
    fichaUbicacion.textContent = atractivo.ubicacion;

    fichaImagen.onerror = () => {

      fichaImagen.onerror = null;

      fichaImagen.removeAttribute("src");
      fichaImagen.alt = "";

    };

    fichaImagen.src = atractivo.imagen;

    fichaImagen.alt = `${texto("imageAlt")} ${atractivo.nombre}`;

    // Sincronizar selección en ambos mapas.

    document.querySelectorAll(".mq-marker").forEach((marcador) => {

      const seleccionado =
        Number(marcador.dataset.id) === atractivo.id;

      marcador.classList.toggle("is-active", seleccionado);

      marcador.setAttribute(
        "aria-pressed",
        String(seleccionado)
      );

    });

    if (dialogo.open) {
      panelAmpliado.hidden = false;
    }

  }


  /* =========================================
     RESTABLECER MAPA
  ========================================= */

  function restablecerMapa() {

    atractivoSeleccionado = null;

    fichaContenido.hidden = true;
    fichaInicial.hidden = false;
    cerrarFichaAmpliada();

    document.querySelectorAll(".mq-marker").forEach((marcador) => {

      marcador.classList.remove("is-active");

      marcador.setAttribute("aria-pressed", "false");

    });

  }


  /* =========================================
     AMPLIAR MAPA
  ========================================= */

  function abrirMapa() {

    if (!dialogo.open) {
      espacioFichaAmpliada.appendChild(ficha);
      cerrarFichaAmpliada();
      dialogo.showModal();
    }

  }

  function devolverFichaAlMapa() {

    if (fichaPlaceholder.parentNode) {
      fichaPlaceholder.parentNode.insertBefore(
        ficha,
        fichaPlaceholder
      );
    }

  }

  function cerrarFichaAmpliada() {

    panelAmpliado.hidden = true;

  }


  function cerrarMapa() {

    if (dialogo.open) {
      dialogo.close();
      cerrarFichaAmpliada();
      devolverFichaAlMapa();
    }

  }


  /* =========================================
     EVENTOS
  ========================================= */

  botonRestablecer?.addEventListener("click", restablecerMapa);

  botonAmpliar?.addEventListener("click", abrirMapa);

  botonCerrar?.addEventListener("click", cerrarMapa);
  botonCerrarFicha.addEventListener("click", cerrarFichaAmpliada);

  let panPointerId = null;
  let panStartX = 0;
  let panStartY = 0;
  let panScrollLeft = 0;
  let panScrollTop = 0;

  mapaViewport.addEventListener("pointerdown", (event) => {
    if (
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      event.target.closest("button")
    ) {
      return;
    }

    panPointerId = event.pointerId;
    panStartX = event.clientX;
    panStartY = event.clientY;
    panScrollLeft = mapaViewport.scrollLeft;
    panScrollTop = mapaViewport.scrollTop;
    mapaViewport.setPointerCapture(event.pointerId);
    mapaViewport.classList.add("is-panning");
  });

  mapaViewport.addEventListener("pointermove", (event) => {
    if (event.pointerId !== panPointerId) return;

    mapaViewport.scrollLeft = panScrollLeft - (event.clientX - panStartX);
    mapaViewport.scrollTop = panScrollTop - (event.clientY - panStartY);
  });

  function finalizarDesplazamiento(event) {
    if (event.pointerId !== panPointerId) return;

    panPointerId = null;
    mapaViewport.classList.remove("is-panning");
  }

  mapaViewport.addEventListener("pointerup", finalizarDesplazamiento);
  mapaViewport.addEventListener("pointercancel", finalizarDesplazamiento);

  dialogo.addEventListener("close", () => {
    cerrarFichaAmpliada();
    devolverFichaAlMapa();
  });

  dialogo.addEventListener("cancel", () => {
    cerrarFichaAmpliada();
    devolverFichaAlMapa();
  });

  dialogo.addEventListener("click", (event) => {

    if (event.target === dialogo) {
      cerrarMapa();
    }

  });

  document.addEventListener("casablanca:languagechange", () => {

    traducirInterfaz();

    generarMarcadores(mapaMarcadores);
    generarMarcadores(mapaMarcadoresAmpliado);

    if (atractivoSeleccionado !== null) {
      seleccionarAtractivo(atractivoSeleccionado);
    }

  });


  /* =========================================
     INICIALIZACIÓN
  ========================================= */

  async function inicializar() {

    atractivos = await cargarAtractivos();

    generarMarcadores(mapaMarcadores);
    generarMarcadores(mapaMarcadoresAmpliado);

    traducirInterfaz();

  }

  inicializar();

});
