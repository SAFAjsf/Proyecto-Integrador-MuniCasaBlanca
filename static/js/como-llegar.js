// Explorador interactivo de recorridos de Casablanca y Quintay.

(() => {
  const originSelect = document.getElementById("route-origin");
  const destinationSelect = document.getElementById("route-destination");
  const transportOptions = document.querySelectorAll(".transport-option");

  const resultTitle = document.getElementById("route-result-title");
  const resultIntro = document.getElementById("route-result-intro");
  const resultMode = document.getElementById("route-result-mode");
  const resultSteps = document.getElementById("route-result-steps");
  const resultNote = document.getElementById("route-result-note");
  const resultLinks = document.getElementById("route-result-links");

  if (
    !originSelect ||
    !destinationSelect ||
    !resultTitle ||
    !resultIntro ||
    !resultSteps ||
    !resultNote ||
    !resultLinks
  ) {
    return;
  }

  let selectedTransport = "car";
  const translate = (key) => window.CasablancaI18n?.t(key) || key;

  const locations = {
    santiago: "directions.location.santiago",
    valparaiso: "directions.location.valparaiso",
    casablanca: "directions.location.casablanca",
    quintay: "directions.location.quintay"
  };

  const transportNames = {
    car: "🚗 directions.transport.car",
    bus: "🚌 directions.transport.bus"
  };

  const operatorLinks = {
    pullman: {
      name: "directions.links.pullman",
      url: "https://pullmanlagopenuelas.cl/rutas"
    },
    pullmanContact: {
      name: "directions.links.pullmanContact",
      url: "https://pullmanlagopenuelas.cl/contacto"
    },
    gr: {
      name: "directions.links.gr",
      url: "https://busesgrquintay.es.tl/Oficina.htm"
    },
    turbus: {
      name: "directions.links.turbus",
      url: "https://www.turbus.cl/"
    }
  };

  // Información basada en las orientaciones existentes de la página.
  const routes = {
    "valparaiso-casablanca-car": {
      intro:
        "Desde Valparaíso puedes dirigirte hacia Casablanca utilizando la Ruta 68.",

      steps: [
        {
          title: "1. Salida desde Valparaíso",
          description:
            "Toma la Ruta 68 en dirección a Santiago."
        },
        {
          title: "2. Acceso a Casablanca",
          description:
            "Continúa hasta el acceso a Casablanca y sigue la señalización hacia el centro de la comuna."
        },
        {
          title: "3. Llegada",
          description:
            "Una vez en Casablanca, podrás continuar organizando tus visitas dentro de la comuna."
        }
      ],

      note:
        "Revisa las condiciones del tránsito y la señalización vial antes de iniciar el viaje."
    },

    "santiago-casablanca-car": {
      intro:
        "Desde Santiago puedes llegar a Casablanca recorriendo la Ruta 68 en dirección a Valparaíso.",

      steps: [
        {
          title: "1. Salida desde Santiago",
          description:
            "Toma la Ruta 68 en dirección a Valparaíso."
        },
        {
          title: "2. Acceso a Casablanca",
          description:
            "Continúa por la autopista y utiliza el acceso señalizado hacia Casablanca."
        },
        {
          title: "3. Llegada",
          description:
            "Sigue la señalización local para dirigirte al centro de la comuna o al sector que quieras visitar."
        }
      ],

      note:
        "Considera las condiciones del tránsito y los posibles tiempos adicionales de desplazamiento."
    },

    "valparaiso-quintay-car": {
      intro:
        "Desde Valparaíso puedes continuar hacia Quintay por la conexión vial hacia el sector costero.",

      steps: [
        {
          title: "1. Salida desde Valparaíso",
          description:
            "Toma la Ruta 68 en dirección a Santiago."
        },
        {
          title: "2. Desvío hacia Quintay",
          description:
            "Utiliza el desvío señalizado hacia Quintay."
        },
        {
          title: "3. Camino F-800",
          description:
            "Continúa por el camino F-800 hasta llegar a la localidad."
        }
      ],

      note:
        "Revisa las condiciones del camino y considera organizar previamente tu regreso."
    },

    "santiago-quintay-car": {
      intro:
        "Desde Santiago puedes dirigirte hacia Quintay por la Ruta 68 y continuar hacia el sector costero.",

      steps: [
        {
          title: "1. Salida desde Santiago",
          description:
            "Toma la Ruta 68 en dirección a Valparaíso."
        },
        {
          title: "2. Desvío hacia Quintay",
          description:
            "Sigue las indicaciones hacia el desvío de Quintay."
        },
        {
          title: "3. Camino F-800",
          description:
            "Desde el desvío, continúa por el camino F-800 hasta el sector costero."
        }
      ],

      note:
        "Considera el tiempo de desplazamiento y revisa las condiciones del camino antes de salir."
    },

    "casablanca-quintay-car": {
      intro:
        "Si ya te encuentras en Casablanca y quieres visitar Quintay, debes organizar el traslado hacia el sector costero.",

      steps: [
        {
          title: "1. Salida desde Casablanca",
          description:
            "Planifica tu salida desde el centro de Casablanca hacia la conexión vial con dirección a Quintay."
        },
        {
          title: "2. Continuación hacia la costa",
          description:
            "Utiliza la conexión hacia el camino F-800 y continúa hasta Quintay."
        }
      ],

      note:
        "Esta es una orientación general. Revisa el trazado exacto con un servicio de navegación actualizado antes de iniciar el recorrido."
    },

    "valparaiso-casablanca-bus": {
      intro:
        "Existen recorridos interurbanos que pueden conectar Valparaíso con Casablanca.",

      steps: [
        {
          title: "1. Consulta los recorridos",
          description:
            "Revisa los servicios publicados por Pullman Lago Peñuelas entre Valparaíso y San Antonio."
        },
        {
          title: "2. Confirma la parada",
          description:
            "Antes de comprar tu pasaje, confirma que el servicio seleccionado pase por Casablanca y permita descender allí."
        },
        {
          title: "3. Organiza tu llegada",
          description:
            "Verifica dónde se realiza el descenso y cómo continuarás hacia tu destino dentro de la comuna."
        }
      ],

      note:
        "No todos los servicios realizan necesariamente la misma parada. Confirma el recorrido específico con el operador.",

      links: ["pullman", "pullmanContact"]
    },

    "santiago-casablanca-bus": {
      intro:
        "Desde Santiago puedes consultar servicios interurbanos hacia la Región de Valparaíso y verificar cuáles permiten llegar a Casablanca.",

      steps: [
        {
          title: "1. Consulta servicios interurbanos",
          description:
            "Revisa las alternativas de viaje desde Santiago hacia Valparaíso o Viña del Mar."
        },
        {
          title: "2. Confirma la parada en Casablanca",
          description:
            "Consulta expresamente si el servicio seleccionado realiza una parada habilitada en Casablanca y permite descender allí."
        },
        {
          title: "3. Organiza el resto del trayecto",
          description:
            "Confirma el punto de llegada y las alternativas para continuar hacia tu destino."
        }
      ],

      note:
        "No todos los buses que viajan hacia la costa se detienen en Casablanca. La parada debe confirmarse antes de comprar el pasaje.",

      links: ["turbus"]
    },

    "valparaiso-quintay-bus": {
      intro:
        "Para llegar a Quintay desde Valparaíso puedes consultar los servicios de Buses GR Quintay y otras alternativas de transporte compartido.",

      steps: [
        {
          title: "1. Consulta los servicios disponibles",
          description:
            "Revisa directamente con Buses GR Quintay las alternativas de transporte hacia la localidad."
        },
        {
          title: "2. Confirma los detalles",
          description:
            "Consulta el lugar de salida, los horarios y el punto de llegada."
        },
        {
          title: "3. Organiza el regreso",
          description:
            "Antes de viajar, confirma también las alternativas para regresar a Valparaíso."
        }
      ],

      note:
        "La disponibilidad de servicios y sus horarios deben confirmarse directamente con el operador.",

      links: ["gr"]
    },

    "santiago-quintay-bus": {
      intro:
        "Una alternativa es viajar primero desde Santiago a Valparaíso y, desde allí, buscar un servicio hacia Quintay.",

      steps: [
        {
          title: "1. Viaja desde Santiago",
          description:
            "Consulta servicios interurbanos hacia Valparaíso y confirma los horarios y puntos de llegada."
        },
        {
          title: "2. Conecta con Quintay",
          description:
            "Desde Valparaíso, consulta la disponibilidad de Buses GR Quintay o alternativas de transporte compartido."
        },
        {
          title: "3. Confirma el regreso",
          description:
            "Coordina los horarios de ambos trayectos y considera el tiempo necesario para realizar la conexión."
        }
      ],

      note:
        "La conexión entre servicios no está garantizada. Confirma los horarios y la disponibilidad de cada tramo antes de viajar.",

      links: ["turbus", "gr"]
    },

    "casablanca-quintay-bus": {
      intro:
        "Si te encuentras en Casablanca y quieres llegar a Quintay en transporte público, debes consultar las alternativas de traslado disponibles.",

      steps: [
        {
          title: "1. Consulta alternativas locales",
          description:
            "Pregunta por servicios de taxi, transporte compartido o traslados privados disponibles hacia Quintay."
        },
        {
          title: "2. Confirma las condiciones",
          description:
            "Consulta el lugar de salida, el costo, la disponibilidad y el horario del traslado."
        },
        {
          title: "3. Organiza el regreso",
          description:
            "Coordina previamente cómo regresarás a Casablanca o continuarás tu viaje."
        }
      ],

      note:
        "No contamos con un recorrido público directo confirmado entre Casablanca y Quintay. No des por garantizada su disponibilidad."
    }
  };

  function localizeText(text) {
    const language = window.CasablancaI18n?.getLanguage();

    return window.CasablancaDirectionsTranslations?.[language]?.[text] ?? text;
  }

  function createStep(step) {
    const article = document.createElement("article");
    article.className = "route-result-step";

    const title = document.createElement("h4");
    title.textContent = localizeText(step.title);

    const description = document.createElement("p");
    description.textContent = localizeText(step.description);

    article.append(title, description);

    return article;
  }

  function createLink(operatorKey) {
    const operator = operatorLinks[operatorKey];

    if (!operator) return null;

    const link = document.createElement("a");
    link.className = "text-link";
    link.href = operator.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = translate(operator.name) + " ↗";

    return link;
  }

  function updateTransportButtons() {
    transportOptions.forEach((button) => {
      const isActive = button.dataset.transport === selectedTransport;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function updateRoute() {
    const origin = originSelect.value;
    const destination = destinationSelect.value;

    const originName = locations[origin];
    const destinationName = locations[destination];

    const routeKey = `${origin}-${destination}-${selectedTransport}`;
    const route = routes[routeKey];

    resultTitle.textContent = `${translate(originName)} → ${translate(destinationName)}`;
    const [modeIcon, modeKey] = transportNames[selectedTransport].split(" ");
    resultMode.textContent = `${modeIcon} ${translate(modeKey)}`;

    resultSteps.replaceChildren();
    resultLinks.replaceChildren();

    if (!route) {
      resultIntro.textContent = translate("directions.result.noRoute");

      resultNote.textContent = translate("directions.result.noRouteNote");

      return;
    }

    resultIntro.textContent = localizeText(route.intro);

    route.steps.forEach((step) => {
      resultSteps.appendChild(createStep(step));
    });

    resultNote.textContent = localizeText(route.note);

    if (route.links) {
      route.links.forEach((operatorKey) => {
        const link = createLink(operatorKey);

        if (link) {
          resultLinks.appendChild(link);
        }
      });
    }
  }

  transportOptions.forEach((button) => {
    button.addEventListener("click", () => {
      selectedTransport = button.dataset.transport;
      updateTransportButtons();
      updateRoute();
    });
  });

  
  // Evita seleccionar el mismo lugar como origen y destino.
  function validateLocations() {
    if (originSelect.value === destinationSelect.value) {
      destinationSelect.value =
        originSelect.value === "casablanca" ? "quintay" : "casablanca";
    }

    updateRoute();
  }

  originSelect.addEventListener("change", validateLocations);
  destinationSelect.addEventListener("change", validateLocations);

  document.addEventListener("casablanca:languagechange", updateRoute);

  updateTransportButtons();
  updateRoute();
})();