/* =====================================
   EXPLORADOR DE ATRACTIVOS TURÍSTICOS
   Casablanca Chile
===================================== */

(() => {
  "use strict";


  // =====================================
  // INFORMACIÓN DE LOS ATRACTIVOS
  // =====================================

  const atractivos = {

    "lo-vasquez": {
      claveTraduccion: "attractions.detail.loVasquez",
      numero: "01",
      categoria: "TURISMO RELIGIOSO",
      titulo: "Santuario Purísima Virgen de Lo Vásquez",
      imagen: "../img/atractivos/lo-vasquez.jpg",
      alt: "Santuario Purísima Virgen de Lo Vásquez",

      introduccion:
        "Uno de los lugares de peregrinación más importantes de Chile. " +
        "El Santuario de Lo Vásquez es un espacio de encuentro religioso " +
        "que cada año recibe a miles de fieles y visitantes.",

      secciones: [
        {
          titulo: "Un lugar de fe y tradición",
          texto:
            "En este santuario se venera la imagen de la Inmaculada " +
            "Concepción de la Virgen María. Su importancia religiosa " +
            "se expresa especialmente durante la celebración anual " +
            "del 8 de diciembre, cuando llegan peregrinos desde " +
            "distintos lugares del país."
        },
        {
          titulo: "La celebración del 8 de diciembre",
          texto:
            "Cada año, miles de personas participan en la festividad " +
            "de la Inmaculada Concepción. Esta celebración constituye " +
            "una de las manifestaciones religiosas más reconocidas " +
            "del territorio de Casablanca."
        }
      ],

      recomendaciones: [
        "Infórmate sobre las actividades y celebraciones antes de visitar.",
        "Considera la alta afluencia de personas durante el 8 de diciembre.",
        "Respeta los espacios de oración y las indicaciones del santuario."
      ],

      nota:
        "Las actividades, horarios y condiciones de visita deben " +
        "confirmarse directamente con el santuario."
    },


    museo: {
      claveTraduccion: "attractions.detail.museum",
      numero: "02",
      categoria: "HISTORIA Y CULTURA",
      titulo: "Museo Arqueológico y Antropológico de Casablanca",
      imagen: "../img/atractivos/museo.jpg",
      alt: "Museo Arqueológico y Antropológico de Casablanca",

      introduccion:
        "Un espacio dedicado a investigar, conservar y contextualizar " +
        "objetos históricos, acercando al público a distintas etapas " +
        "de la memoria y el patrimonio de Casablanca.",

      secciones: [
        {
          titulo: "Un espacio para conocer la historia",
          texto:
            "El Museo Arqueológico y Antropológico de Casablanca fue " +
            "inaugurado en octubre de 1995. Desde entonces, se dedica " +
            "a investigar, conservar y contextualizar objetos históricos, " +
            "presentándolos al público como parte de un relato que " +
            "refleja la historia del territorio."
        },
        {
          titulo: "Patrimonio y memoria",
          texto:
            "Sus colecciones permiten acercarse a la historia local " +
            "y a los vestigios de las comunidades que habitaron " +
            "este territorio. Es una oportunidad para complementar " +
            "el recorrido por los espacios patrimoniales de la comuna."
        }
      ],

      recomendaciones: [
        "Consulta previamente los horarios de atención.",
        "Respeta las indicaciones del personal y las normas del museo.",
        "Infórmate sobre las exposiciones y actividades disponibles."
      ],

      nota:
        "La disponibilidad de visitas, horarios y actividades debe " +
        "confirmarse antes de acudir.",

      enlaces: [
        {
          texto: "Explorar la historia de Casablanca",
          url: "historia.html",
          secundario: false
        }
      ]
    },


    tunquen: {
      claveTraduccion: "attractions.detail.tunquen",
      numero: "03",
      categoria: "NATURALEZA Y CONSERVACIÓN",
      titulo: "Tunquén: playa y humedal",
      imagen: "../img/atractivos/tunquen.jpg",
      alt: "Playa y Humedal de Tunquén",

      introduccion:
        "Un destino de paisajes costeros, tranquilidad y naturaleza. " +
        "La playa de Tunquén destaca por su extensión, sus arenas " +
        "y dunas naturales. En sus cercanías se encuentra el Santuario " +
        "de la Naturaleza Humedal de Tunquén, un ecosistema de gran " +
        "valor para la biodiversidad del sector.",

      secciones: [
        {
          titulo: "Un paisaje para contemplar",
          texto:
            "La playa y su entorno natural ofrecen paisajes donde " +
            "el mar, las dunas y los humedales forman parte de un " +
            "mismo territorio. Es un lugar que invita a caminar, " +
            "observar el paisaje y disfrutar de la naturaleza."
        },
        {
          titulo: "Un ecosistema que debemos proteger",
          texto:
            "El Santuario de la Naturaleza Humedal de Tunquén " +
            "resguarda ambientes costeros y especies de flora y fauna. " +
            "Su conservación depende también del comportamiento " +
            "de quienes visitan el sector."
        }
      ],

      recomendaciones: [
        "Infórmate sobre las condiciones de acceso antes de visitar.",
        "Respeta los senderos y las áreas de conservación.",
        "Sigue las indicaciones de la administración del santuario."
      ],

      normasTitulo: "Recomendaciones para una visita responsable",

      normasIntroduccion:
        "El folleto informativo del humedal establece las siguientes " +
        "recomendaciones para proteger la flora, la fauna y el entorno:",

      normas: [
        "No ingreses con mascotas.",
        "No vueles drones.",
        "No caces ni captures animales.",
        "No realices deportes acuáticos.",
        "Sigue siempre los caminos y senderos marcados.",
        "Realiza el recorrido a pie.",
        "Evita reproducir música y generar ruidos fuertes.",
        "No enciendas fuego ni provoques situaciones de riesgo de incendio.",
        "Llévate todos tus residuos y desechos.",
        "No acampes."
      ],

      nota:
        "Estas recomendaciones se han transcrito del folleto informativo " +
        "compartido. Consulta el sitio oficial para conocer las condiciones " +
        "de acceso y las indicaciones vigentes.",

      enlaces: [
        {
          texto: "Sitio oficial del humedal",
          url: "https://www.humedaltunquen.cl/",
          secundario: false,
          externo: true
        },
        {
          texto: "Instagram del santuario",
          url: "https://www.instagram.com/santuario.humedaltunquen/",
          secundario: true,
          externo: true
        }
      ]
    },


    lagunillas: {
      claveTraduccion: "attractions.detail.lagunillas",
      numero: "04",
      categoria: "PATRIMONIO RURAL",
      titulo: "Lagunillas: tradición y patrimonio rural",
      imagen: "../img/atractivos/lagunillas.jpg",
      alt: "Iglesia Nuestra Señora de las Mercedes de Lagunillas",

      introduccion:
        "Lagunillas es una localidad de Casablanca que conserva " +
        "una identidad rural marcada por su arquitectura tradicional, " +
        "sus construcciones patrimoniales y su historia local.",

      secciones: [
        {
          titulo: "Una localidad con identidad propia",
          texto:
            "Su paisaje y arquitectura permiten reconocer elementos " +
            "de la vida rural tradicional. Sus casas patrimoniales " +
            "y construcciones conservan parte de la memoria " +
            "arquitectónica de la localidad."
        },
        {
          titulo: "Iglesia Nuestra Señora de las Mercedes",
          texto:
            "La iglesia Nuestra Señora de las Mercedes constituye " +
            "uno de los elementos destacados del patrimonio de " +
            "Lagunillas. Su presencia forma parte de la identidad " +
            "histórica y cultural de esta comunidad."
        }
      ],

      recomendaciones: [
        "Recorre la localidad respetando sus espacios y construcciones.",
        "Cuida el entorno y evita dejar residuos.",
        "Respeta la tranquilidad de sus habitantes.",
        "Considera que algunos espacios pueden ser de acceso privado."
      ],

      nota:
        "La disponibilidad de acceso a edificios y espacios patrimoniales " +
        "debe confirmarse antes de la visita."
    },

    "museo-ballenera": {
      claveTraduccion: "attractions.detail.whalingMuseum",
      numero: "01",
      categoria: "HISTORIA Y CONSERVACIÓN",
      titulo: "Museo de la ex Ballenera de Quintay",
      imagen: "../img/atractivos/museoballenera.jpg",
      alt: "Museo de la ex Ballenera de Quintay",

      introduccion:
        "La ex Ballenera de Quintay es un espacio para conocer la historia " +
        "de esta actividad y acercarse al trabajo de conservación del " +
        "ecosistema marino de la localidad.",

      secciones: [
        {
          titulo: "Un patrimonio ballenero singular",
          texto:
            "De las cinco plantas balleneras que existieron en Chile, " +
            "la de Quintay fue una de las más grandes y es la única que " +
            "se conserva íntegra."
        },
        {
          titulo: "Conservación del ecosistema marino",
          texto:
            "En el museo puedes conocer el trabajo de conservación del " +
            "ecosistema marino y la importancia de proteger la vida del océano."
        }
      ],

      recomendaciones: [
        "Infórmate sobre los horarios y las condiciones de visita antes de acudir.",
        "Respeta las indicaciones y los espacios patrimoniales."
      ],

      nota:
        "Los horarios y la disponibilidad de visitas pueden variar; " +
        "confírmalos antes de tu recorrido."
    },

    "caleta-quintay": {
      claveTraduccion: "attractions.detail.cove",
      numero: "02",
      categoria: "CULTURA Y VIDA COSTERA",
      titulo: "Caleta de pescadores de Quintay",
      imagen: "../img/atractivos/caleta.jpg",
      alt: "Caleta de pescadores de Quintay",

      introduccion:
        "La caleta reúne vida local, oficios y sabores, y permite acercarse " +
        "a la relación cotidiana de Quintay con el mar.",

      secciones: [
        {
          titulo: "Artesanía, buceo y vida marina",
          texto:
            "Puedes recorrer la feria de artesanía local o conocer las " +
            "escuelas de buceo que invitan a explorar la rica fauna marina " +
            "de la zona."
        },
        {
          titulo: "Sabores de la costa",
          texto:
            "La caleta ofrece una variada propuesta gastronómica típica " +
            "del lugar para disfrutar durante tu visita."
        }
      ],

      recomendaciones: [
        "Consulta directamente con las escuelas de buceo sobre actividades y condiciones.",
        "Respeta el trabajo de pescadores y comerciantes locales."
      ],

      nota:
        "La disponibilidad de servicios y actividades puede variar según " +
        "la temporada y las condiciones del mar."
    },

    "humedal-estero-jote": {
      claveTraduccion: "attractions.detail.wetland",
      numero: "03",
      categoria: "NATURALEZA Y BIODIVERSIDAD",
      titulo: "Humedal Estero El Jote",
      imagen: "../img/atractivos/humedal-jote.jpg",
      alt: "Humedal Estero El Jote en Quintay",

      introduccion:
        "El Humedal Estero El Jote es un refugio natural de biodiversidad " +
        "donde el paisaje invita a observar y disfrutar la naturaleza.",

      secciones: [
        {
          titulo: "Un refugio de flora y fauna",
          texto:
            "En este entorno puedes descubrir distintas especies de flora " +
            "y fauna, entre ellas pilpilenes, garzas y cormoranes yecos."
        },
        {
          titulo: "Observar con respeto",
          texto:
            "La visita es una oportunidad para apreciar el entorno natural " +
            "y la vida silvestre que habita el humedal."
        }
      ],

      recomendaciones: [
        "Observa la fauna a distancia y evita perturbarla.",
        "Mantente en los espacios habilitados y no dejes residuos."
      ],

      nota:
        "Infórmate sobre las condiciones de acceso y las recomendaciones " +
        "vigentes antes de visitar."
    },

    "playa-grande-quintay": {
      claveTraduccion: "attractions.detail.beach",
      numero: "04",
      categoria: "PLAYA Y PAISAJE COSTERO",
      titulo: "Playa Grande de Quintay",
      imagen: "../img/atractivos/playa-grande.jpg",
      alt: "Playa Grande junto al Estero El Jote en Quintay",

      introduccion:
        "Ubicada junto al estero y resguardada por cerros, Playa Grande " +
        "ofrece un paisaje costero para descansar, desconectarse del ritmo " +
        "urbano y renovar energías en un entorno sereno.",

      secciones: [
        {
          titulo: "Mar, estero y cerros",
          texto:
            "La cercanía del estero y los cerros que rodean la playa " +
            "conforman un paisaje natural único en Quintay."
        },
        {
          titulo: "Un espacio para hacer una pausa",
          texto:
            "Más que un destino, es un refugio para reencontrarse con la " +
            "calma y disfrutar de un entorno natural, puro y sereno."
        }
      ],

      recomendaciones: [
        "Revisa las condiciones del mar y respeta las señalizaciones.",
        "Cuida el entorno y no dejes residuos."
      ],

      nota:
        "Las condiciones del mar y los servicios disponibles pueden variar; " +
        "consulta la información local antes de tu visita."
    }

  };


  // =====================================
  // ELEMENTOS HTML
  // =====================================

  const tarjetas = document.querySelectorAll("[data-attraction]");

  const dialogo = document.getElementById("attraction-dialog");

  const botonCerrar = document.getElementById(
    "attraction-dialog-close"
  );

  const imagen = document.getElementById(
    "attraction-dialog-img"
  );

  const numero = document.getElementById(
    "attraction-dialog-number"
  );

  const categoria = document.getElementById(
    "attraction-dialog-category"
  );

  const titulo = document.getElementById(
    "attraction-dialog-title"
  );

  const introduccion = document.getElementById(
    "attraction-dialog-intro"
  );

  const detalles = document.getElementById(
    "attraction-dialog-details"
  );

  const contenedorNormas = document.getElementById(
    "attraction-dialog-rules"
  );

  const enlaces = document.getElementById(
    "attraction-dialog-links"
  );

  const traducir = (atractivo, campo, respaldo) => {
    const clave = `${atractivo.claveTraduccion}.${campo}`;
    const traduccion = window.CasablancaI18n?.t(clave);

    return traduccion && traduccion !== clave
      ? traduccion
      : respaldo;
  };


  // Evitar errores si los elementos no existen.
  if (
    !dialogo ||
    !botonCerrar ||
    !imagen ||
    !titulo ||
    !detalles
  ) {
    console.warn(
      "No se encontraron todos los elementos del explorador de atractivos."
    );

    return;
  }


  // =====================================
  // GENERAR SECCIONES DE INFORMACIÓN
  // =====================================

  function generarDetalles(atractivo) {

    detalles.replaceChildren();

    atractivo.secciones.forEach((seccion, index) => {

      const bloque = document.createElement("section");

      bloque.className = "attraction-detail-section";

      const encabezado = document.createElement("h3");

      encabezado.textContent = traducir(
        atractivo,
        `section${index + 1}Title`,
        seccion.titulo
      );

      const texto = document.createElement("p");

      texto.textContent = traducir(
        atractivo,
        `section${index + 1}Text`,
        seccion.texto
      );

      bloque.append(encabezado, texto);

      detalles.append(bloque);

    });


    // Recomendaciones generales.

    if (atractivo.recomendaciones?.length) {

      const bloque = document.createElement("section");

      bloque.className = "attraction-detail-section";

      const encabezado = document.createElement("h3");

      encabezado.textContent = traducir(
        atractivo,
        "recommendationsTitle",
        "Recomendaciones para tu visita"
      );

      const lista = document.createElement("ul");

      lista.className = "attraction-detail-list";

      atractivo.recomendaciones.forEach((recomendacion, index) => {

        const elemento = document.createElement("li");

        elemento.textContent = traducir(
          atractivo,
          `recommendation${index + 1}`,
          recomendacion
        );

        lista.append(elemento);

      });

      bloque.append(encabezado, lista);

      detalles.append(bloque);

    }


    // Nota informativa.

    if (atractivo.nota) {

      const bloque = document.createElement("section");

      bloque.className = "attraction-detail-section";

      const texto = document.createElement("p");

      texto.textContent = traducir(
        atractivo,
        "note",
        atractivo.nota
      );

      bloque.append(texto);

      detalles.append(bloque);

    }

  }


  // =====================================
  // GENERAR NORMAS DE TUNQUÉN
  // =====================================

  function generarNormas(atractivo) {

    contenedorNormas.replaceChildren();

    if (!atractivo.normas?.length) {

      contenedorNormas.hidden = true;

      return;

    }

    contenedorNormas.hidden = false;

    const encabezado = document.createElement("h3");

    encabezado.textContent = traducir(
      atractivo,
      "rulesTitle",
      atractivo.normasTitulo
    );

    const introduccionNormas = document.createElement("p");

    introduccionNormas.textContent = traducir(
      atractivo,
      "rulesIntroduction",
      atractivo.normasIntroduccion
    );

    const lista = document.createElement("ol");

    lista.className = "attraction-rules-list";

    atractivo.normas.forEach((norma, index) => {

      const elemento = document.createElement("li");

      elemento.textContent = traducir(
        atractivo,
        `rule${index + 1}`,
        norma
      );

      lista.append(elemento);

    });

    contenedorNormas.append(
      encabezado,
      introduccionNormas,
      lista
    );

  }


  // =====================================
  // GENERAR ENLACES
  // =====================================

  function generarEnlaces(atractivo) {

    enlaces.replaceChildren();

    if (!atractivo.enlaces?.length) return;

    atractivo.enlaces.forEach((enlace, index) => {

      const link = document.createElement("a");

      link.href = enlace.url;

      link.textContent = traducir(
        atractivo,
        `link${index + 1}`,
        enlace.texto
      );

      if (enlace.secundario) {
        link.classList.add("secondary");
      }

      if (enlace.externo) {

        link.target = "_blank";

        link.rel = "noopener noreferrer";

      }

      enlaces.append(link);

    });

  }


  // =====================================
  // ABRIR FICHA
  // =====================================

  let ultimaTarjeta = null;
  let atractivoActual = null;

  function renderizarAtractivo(atractivo) {

    numero.textContent = atractivo.numero;

    categoria.textContent = traducir(
      atractivo,
      "category",
      atractivo.categoria
    );

    titulo.textContent = traducir(
      atractivo,
      "title",
      atractivo.titulo
    );

    introduccion.textContent = traducir(
      atractivo,
      "introduction",
      atractivo.introduccion
    );

    imagen.src = atractivo.imagen;

    imagen.alt = traducir(
      atractivo,
      "alt",
      atractivo.alt || atractivo.titulo
    );

    generarDetalles(atractivo);

    generarNormas(atractivo);

    generarEnlaces(atractivo);
  }

  function abrirAtractivo(clave, tarjeta) {

    const atractivo = atractivos[clave];

    if (!atractivo) return;

    ultimaTarjeta = tarjeta;
    atractivoActual = atractivo;

    renderizarAtractivo(atractivo);

    if (!dialogo.open) {
      dialogo.showModal();
    }

    botonCerrar.focus();

  }


  // =====================================
  // CERRAR FICHA
  // =====================================

  function cerrarAtractivo() {

    if (dialogo.open) {
      dialogo.close();
    }

  }


  botonCerrar.addEventListener(
    "click",
    cerrarAtractivo
  );


  // Cerrar al pulsar fuera del contenido.

  dialogo.addEventListener("click", (evento) => {

    if (evento.target === dialogo) {
      cerrarAtractivo();
    }

  });


  // Escape es gestionado de forma nativa por <dialog>.
  // Al cerrar, devolver el foco a la tarjeta seleccionada.

  dialogo.addEventListener("close", () => {
    atractivoActual = null;

    if (ultimaTarjeta) {
      ultimaTarjeta.focus();
    }

  });


  // =====================================
  // EVENTOS DE LAS TARJETAS
  // =====================================

  tarjetas.forEach((tarjeta) => {

    tarjeta.addEventListener("click", () => {

      const clave = tarjeta.dataset.attraction;

      abrirAtractivo(clave, tarjeta);

    });

  });


  // =====================================
  // CAMBIO DE IDIOMA
  // =====================================

  document.addEventListener(
    "casablanca:languagechange",
    () => {
      if (dialogo.open && atractivoActual) {
        renderizarAtractivo(atractivoActual);
      }

    }
  );


  console.info(
    "Explorador de atractivos turísticos inicializado."
  );

})();