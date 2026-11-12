
/* =====================================
   RUTA DEL VINO - DATOS
===================================== */

const establecimientosRuta = [
  {
    id: 1,
    nombre: "Casas del Bosque",
    imagen: "../img/ruta-vino/casas-del-bosque.jpg",
    descripcionKey: "wineRoute.businesses.1.description",
    especialidadKey: "wineRoute.businesses.1.specialty",
    experienciasKey: "wineRoute.businesses.1.experience",
    visitasKey: "wineRoute.businesses.visit",
    url: "https://casasdelbosque.cl/es/content/86-enoturismo",
    x: 16.2,
    y: 22.3
  },
  {
    id: 2,
    nombre: "Kingston Family Vineyards",
    imagen: "../img/ruta-vino/kingston.jpg",
    descripcionKey: "wineRoute.businesses.2.description",
    especialidadKey: "wineRoute.businesses.2.specialty",
    experienciasKey: "wineRoute.businesses.2.experience",
    visitasKey: "wineRoute.businesses.visit",
    url: "https://www.kingstonvineyards.com/visit-us/",
    x: 16.1,
    y: 11.7
  },
  {
    id: 3,
    nombre: "La Recova",
    imagen: "../img/ruta-vino/la-recova.jpg",
    descripcionKey: "wineRoute.businesses.3.description",
    especialidadKey: "wineRoute.businesses.3.specialty",
    experienciasKey: "wineRoute.businesses.3.experience",
    visitasKey: "wineRoute.businesses.3.visits",
    urlLabelKey: "wineRoute.detail.officialSocial",
    url: "https://x.com/larecovawines",
    x: 21.0,
    y: 4.4
  },
  {
    id: 4,
    nombre: "Bodegas RE",
    imagen: "../img/ruta-vino/bodegas-re.jpg",
    descripcionKey: "wineRoute.businesses.4.description",
    especialidadKey: "wineRoute.businesses.4.specialty",
    experienciasKey: "wineRoute.businesses.4.experience",
    visitasKey: "wineRoute.businesses.visit",
    url: "https://bodegasre.cl/",
    x: 56.5,
    y: 18.5
  },
  {
    id: 5,
    nombre: "El Cuadro",
    imagen: "../img/ruta-vino/el-cuadro.jpg",
    descripcionKey: "wineRoute.businesses.5.description",
    especialidadKey: "wineRoute.businesses.5.specialty",
    experienciasKey: "wineRoute.businesses.5.experience",
    visitasKey: "wineRoute.businesses.visit",
    url: "https://www.elcuadro.cl/",
    x: 74.5,
    y: 19.7
  },
  {
    id: 6,
    nombre: "López Pangue",
    imagen: "../img/ruta-vino/lopez-pangue.jpg",
    descripcionKey: "wineRoute.businesses.6.description",
    especialidadKey: "wineRoute.businesses.6.specialty",
    experienciasKey: "wineRoute.businesses.6.experience",
    visitasKey: "wineRoute.businesses.6.visits",
    url: "https://lopezpangue.cl/",
    x: 97.5,
    y: 16.1
  },
  {
    id: 7,
    nombre: "Villard",
    imagen: "../img/ruta-vino/villard.jpg",
    descripcionKey: "wineRoute.businesses.7.description",
    especialidadKey: "wineRoute.businesses.7.specialty",
    experienciasKey: "wineRoute.businesses.7.experience",
    visitasKey: "wineRoute.businesses.visit",
    url: "https://villard.cl/en/villard-fine-wines-en/",
    x: 95.6,
    y: 35.9
  },
  {
    id: 8,
    nombre: "Tapihue Wines",
    imagen: "../img/ruta-vino/tapihue.jpg",
    descripcionKey: "wineRoute.businesses.8.description",
    especialidadKey: "wineRoute.businesses.8.specialty",
    experienciasKey: "wineRoute.businesses.8.experience",
    visitasKey: "wineRoute.businesses.visit",
    url: "https://tapihuewines.com/",
    x: 62.7,
    y: 43.8
  },
  {
    id: 9,
    nombre: "Viñamar",
    imagen: "../img/ruta-vino/vinamar.jpg",
    descripcionKey: "wineRoute.businesses.9.description",
    especialidadKey: "wineRoute.businesses.9.specialty",
    experienciasKey: "wineRoute.businesses.9.experience",
    visitasKey: "wineRoute.businesses.visit",
    url: "https://vinamar.cl/visita-casa-vinamar/",
    x: 35.9,
    y: 61.7
  },
  {
    id: 10,
    nombre: "Matetic",
    imagen: "../img/ruta-vino/matetic.jpg",
    descripcionKey: "wineRoute.businesses.10.description",
    especialidadKey: "wineRoute.businesses.10.specialty",
    experienciasKey: "wineRoute.businesses.10.experience",
    visitasKey: "wineRoute.businesses.visit",
    url: "https://turismo.matetic.com/",
    x: 25.6,
    y: 75.1
  },
  {
    id: 11,
    nombre: "Indómita",
    imagen: "../img/ruta-vino/indomita.jpg",
    descripcionKey: "wineRoute.businesses.11.description",
    especialidadKey: "wineRoute.businesses.11.specialty",
    experienciasKey: "wineRoute.businesses.11.experience",
    visitasKey: "wineRoute.businesses.visit",
    url: "https://indomita.cl/?lang=en&page_id=1179",
    x: 46.9,
    y: 70.1
  },
  {
    id: 12,
    nombre: "Emiliana",
    imagen: "../img/ruta-vino/emiliana.jpg",
    descripcionKey: "wineRoute.businesses.12.description",
    especialidadKey: "wineRoute.businesses.12.specialty",
    experienciasKey: "wineRoute.businesses.12.experience",
    visitasKey: "wineRoute.businesses.visit",
    url: "https://www.emiliana.cl/",
    x: 77.0,
    y: 71.5
  },
  {
    id: 13,
    nombre: "Veramonte",
    imagen: "../img/ruta-vino/veramonte.jpg",
    descripcionKey: "wineRoute.businesses.13.description",
    especialidadKey: "wineRoute.businesses.13.specialty",
    experienciasKey: "wineRoute.businesses.13.experience",
    visitasKey: "wineRoute.businesses.visit",
    url: "https://vinedosveramonte.cl/",
    x: 89.8,
    y: 68.1
  }
];




/* =====================================
   ELEMENTOS HTML
===================================== */

const contenedorMarcadores = document.getElementById(
  "mapa-marcadores"
);

const contenedorMarcadoresAmpliados = document.getElementById(
  "mapa-marcadores-ampliado"
);

const dialogoMapa = document.getElementById("mapa-dialog");

const botonAmpliarMapa = document.getElementById("ampliar-mapa");
const botonCerrarMapa = document.getElementById("cerrar-mapa");

const botonCerrarFichaAmpliada = document.getElementById(
  "cerrar-ficha-ampliada"
);

const panelAmpliado = document.getElementById(
  "mapa-dialog-panel"
);

const espacioFichaAmpliada = document.getElementById(
  "mapa-dialog-ficha-slot"
);

const rutaFicha = document.getElementById("ruta-ficha");

const fichaInicial = document.getElementById("ficha-inicial");
const fichaContenido = document.getElementById("ficha-contenido");

const fichaImagen = document.getElementById("ficha-imagen");
const fichaNumero = document.getElementById("ficha-numero");
const fichaNombre = document.getElementById("ficha-nombre");
const fichaDescripcion = document.getElementById("ficha-descripcion");

const fichaEspecialidad = document.getElementById(
  "ficha-especialidad"
);

const fichaExperiencias = document.getElementById(
  "ficha-experiencias"
);

const fichaVisitas = document.getElementById("ficha-visitas");
const fichaEnlace = document.getElementById("ficha-enlace");

const botonRestablecer = document.getElementById(
  "restablecer-mapa"
);

const translate = (key) => window.CasablancaI18n?.t(key) || key;

function format(key, values) {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    translate(key)
  );
}

let establecimientoSeleccionado = null;


/* =====================================
   UBICACIÓN ORIGINAL DE LA FICHA
===================================== */

const fichaPlaceholder = document.createComment(
  "Ubicación original de la ficha"
);

if (rutaFicha && rutaFicha.parentNode) {

  rutaFicha.parentNode.insertBefore(
    fichaPlaceholder,
    rutaFicha
  );

}


/* =====================================
   GENERAR MARCADORES
===================================== */

function generarMarcadores(contenedor) {

  if (!contenedor) return;

  establecimientosRuta.forEach((establecimiento) => {

    const marcador = document.createElement("button");

    marcador.type = "button";
    marcador.className = "mapa-marcador";

    marcador.textContent = establecimiento.id;

    marcador.style.left = `${establecimiento.x}%`;
    marcador.style.top = `${establecimiento.y}%`;

    marcador.setAttribute(
      "aria-label",
      format("wineRoute.map.markerLabel", { name: establecimiento.nombre })
    );

    marcador.setAttribute("aria-pressed", "false");

    marcador.dataset.id = establecimiento.id;

    marcador.addEventListener("click", () => {

      seleccionarEstablecimiento(establecimiento.id);

    });

    contenedor.appendChild(marcador);

  });

}


/* =====================================
   MOSTRAR INFORMACIÓN
===================================== */

function seleccionarEstablecimiento(id) {

  const establecimiento = establecimientosRuta.find(
    (item) => item.id === id
  );

  if (!establecimiento) return;

  establecimientoSeleccionado = id;

  // Mostrar contenido de la ficha.

  fichaInicial.hidden = true;
  fichaContenido.hidden = false;

  // Actualizar información.

  fichaNombre.textContent = establecimiento.nombre;

  fichaDescripcion.textContent =
    translate(establecimiento.descripcionKey);

  fichaNumero.textContent = establecimiento.id;

  fichaEspecialidad.textContent = translate(
    establecimiento.especialidadKey
  );
  fichaExperiencias.textContent = translate(
    establecimiento.experienciasKey
  );
  fichaVisitas.textContent = translate(
    establecimiento.visitasKey
  );


  // Actualizar fotografía.

  fichaImagen.onerror = () => {

    fichaImagen.onerror = null;

    fichaImagen.src = "../img/valle.jpg";

    fichaImagen.alt =
      translate("wineRoute.detail.fallbackImageAlt");

  };

  fichaImagen.src = establecimiento.imagen;

  fichaImagen.alt =
    format("wineRoute.detail.imageAlt", { name: establecimiento.nombre });


  // Mostrar enlace solo si existe una URL.

  if (establecimiento.url) {

    fichaEnlace.href = establecimiento.url;
    fichaEnlace.querySelector("[data-i18n]").textContent = translate(
      establecimiento.urlLabelKey || "wineRoute.detail.officialSite"
    );
    fichaEnlace.hidden = false;

  } else {

    fichaEnlace.hidden = true;
    fichaEnlace.removeAttribute("href");

  }


  // Sincronizar marcadores de ambos mapas.

  document.querySelectorAll(".mapa-marcador").forEach(
    (marcador) => {

      const seleccionado =
        Number(marcador.dataset.id) === id;

      marcador.classList.toggle("activo", seleccionado);

      marcador.setAttribute(
        "aria-pressed",
        seleccionado ? "true" : "false"
      );

    }
  );


  // Si el visitante está usando el mapa ampliado,
  // mostrar automáticamente el panel lateral.

  if (dialogoMapa && dialogoMapa.open) {

    panelAmpliado.hidden = false;

  }

}


/* =====================================
   MOVER FICHA AL PANEL AMPLIADO
===================================== */

function moverFichaAlPanel() {

  if (
    !rutaFicha ||
    !espacioFichaAmpliada ||
    rutaFicha.parentNode === espacioFichaAmpliada
  ) {
    return;
  }

  espacioFichaAmpliada.appendChild(rutaFicha);

}


/* =====================================
   DEVOLVER FICHA A SU LUGAR ORIGINAL
===================================== */

function devolverFichaOriginal() {

  if (
    !rutaFicha ||
    !fichaPlaceholder.parentNode
  ) {
    return;
  }

  fichaPlaceholder.parentNode.insertBefore(
    rutaFicha,
    fichaPlaceholder
  );

}


/* =====================================
   ABRIR MAPA AMPLIADO
===================================== */

function abrirDialogoMapa() {

  if (!dialogoMapa || dialogoMapa.open) return;

  // La ficha se prepara en el panel, pero este
  // permanece oculto hasta seleccionar un marcador.

  moverFichaAlPanel();

  panelAmpliado.hidden = true;

  dialogoMapa.showModal();

}


/* =====================================
   CERRAR SOLO LA FICHA LATERAL
===================================== */

function cerrarFichaAmpliada() {

  if (!panelAmpliado) return;

  panelAmpliado.hidden = true;

  // El mapa y la selección permanecen intactos.

}


/* =====================================
   CERRAR MAPA AMPLIADO
===================================== */

function cerrarDialogoMapa() {

  if (dialogoMapa && dialogoMapa.open) {

    dialogoMapa.close();

  }

}


/* =====================================
   AL CERRAR EL DIÁLOGO
===================================== */

if (dialogoMapa) {

  dialogoMapa.addEventListener("close", () => {

    panelAmpliado.hidden = true;

    devolverFichaOriginal();

  });

}


/* =====================================
   RESTABLECER SELECCIÓN
===================================== */

function restablecerMapa() {

  establecimientoSeleccionado = null;

  fichaContenido.hidden = true;
  fichaInicial.hidden = false;

  // Ocultar panel si está abierta la ampliación.

  if (panelAmpliado) {

    panelAmpliado.hidden = true;

  }

  // Quitar selección de todos los marcadores.

  document.querySelectorAll(".mapa-marcador").forEach(
    (marcador) => {

      marcador.classList.remove("activo");

      marcador.setAttribute(
        "aria-pressed",
        "false"
      );

    }
  );

}


/* =====================================
   INICIALIZAR
===================================== */

generarMarcadores(contenedorMarcadores);

generarMarcadores(contenedorMarcadoresAmpliados);

document.addEventListener("casablanca:languagechange", () => {
  document.querySelectorAll(".mapa-marcador").forEach((marker) => {
    const establecimiento = establecimientosRuta.find(
      (item) => item.id === Number(marker.dataset.id)
    );

    if (establecimiento) {
      marker.setAttribute(
        "aria-label",
        format("wineRoute.map.markerLabel", {
          name: establecimiento.nombre
        })
      );
    }
  });

  if (establecimientoSeleccionado !== null) {
    seleccionarEstablecimiento(establecimientoSeleccionado);
  }
});


if (botonRestablecer) {

  botonRestablecer.addEventListener(
    "click",
    restablecerMapa
  );

}

if (botonAmpliarMapa) {

  botonAmpliarMapa.addEventListener(
    "click",
    abrirDialogoMapa
  );

}

if (botonCerrarMapa) {

  botonCerrarMapa.addEventListener(
    "click",
    cerrarDialogoMapa
  );

}

if (botonCerrarFichaAmpliada) {

  botonCerrarFichaAmpliada.addEventListener(
    "click",
    cerrarFichaAmpliada
  );

}
