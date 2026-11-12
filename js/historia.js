// =====================================
// EXPLORADOR HISTÓRICO
// =====================================

// Comprobar que main.js haya cargado correctamente
const historiaAPI = window.CasablancaHistoria;

if (!historiaAPI) {
    console.error(
        "No se encontró CasablancaHistoria. Comprueba el orden de carga de los scripts."
    );
} else {

    // =====================================
    // DATOS DEL EXPLORADOR
    // =====================================

    const puntosHistoria = {
    fundacion: {
        tituloKey: "history.point.foundation.title",
        descripcionKey: "history.point.foundation.description",
        tema: "tema-1900",
        imagen: "../img/plaza1900.jpg",
        altKey: "history.point.foundation.imageAlt",
        kickerKey: "history.point.foundation.kicker"
    },

    plaza: {
        tituloKey: "history.point.square.title",
        descripcionKey: "history.point.square.description",
        tema: "tema-patrimonio",
        imagen: "../img/plaza.jpg",
        altKey: "history.point.square.imageAlt",
        kickerKey: "history.point.square.kicker"
    },

    museo: {
        tituloKey: "history.point.museum.title",
        descripcionKey: "history.point.museum.description",
        tema: "tema-antiguo",
        imagen: "../img/museo.jpg",
        altKey: "history.point.museum.imageAlt",
        kickerKey: "history.point.museum.kicker"
    }
};

    let puntoHistoriaActivo = null;
    const traducirHistoria = (key) =>
        window.CasablancaI18n?.t(key) || key;

    // =====================================
    // ELEMENTOS DEL EXPLORADOR
    // =====================================

    const imagenHistoria = document.getElementById("historia-imagen");

    // Inicializar el tema visual
    historiaAPI.cambiarTemaHistoria("tema-actual");


    // Inicializar los marcadores
    document.querySelectorAll(".punto-historico").forEach((boton) => {

        boton.setAttribute("aria-pressed", "false");

        boton.addEventListener("click", () => {

            const clave = boton.dataset.punto;
            const informacion = puntosHistoria[clave];

            if (!informacion) return;

            puntoHistoriaActivo = clave;
            historiaAPI.actualizarExplorador(informacion, clave);

        });

    });


    // =====================================
    // VISOR HISTÓRICO AMPLIADO
    // =====================================

    const visor = document.getElementById("visor-historico");
    const visorImagen = document.getElementById("visor-imagen");
    const visorTitulo = document.getElementById("visor-titulo");
    const visorDescripcion = document.getElementById("visor-descripcion");
    const visorEtiqueta = document.getElementById("visor-etiqueta");
    const visorContador = document.getElementById("visor-contador");

    const botonCerrarVisor = document.getElementById("visor-cerrar");
    const botonAnteriorVisor = document.getElementById("visor-anterior");
    const botonSiguienteVisor = document.getElementById("visor-siguiente");

    // Comprobar que el visor exista antes de inicializarlo
    if (
        visor &&
        visorImagen &&
        visorTitulo &&
        visorDescripcion &&
        visorEtiqueta &&
        visorContador &&
        botonCerrarVisor &&
        botonAnteriorVisor &&
        botonSiguienteVisor
    ) {

        let elementosVisor = [];
        let indiceVisor = 0;
        let tipoVisor = "puntos";
        let elementoEnfocadoAnterior = null;
        let overflowAnterior = "";


        // =====================================
        // FILTROS FOTOGRÁFICOS
        // =====================================

        function obtenerFiltroTema(tema) {

            const filtros = {
                "tema-actual": "none",
                "tema-antiguo": "sepia(45%) contrast(1.05)",
                "tema-1900": "grayscale(100%) contrast(1.1)",
                "tema-patrimonio": "sepia(20%)"
            };

            return filtros[tema] || "none";
        }


        // =====================================
        // MOSTRAR ELEMENTO ACTUAL
        // =====================================

        function mostrarElementoVisor() {

            const elemento = elementosVisor[indiceVisor];

            if (!elemento) return;

            visorImagen.src = elemento.image || elemento.imagen;
            visorImagen.alt = traducirHistoria(
                elemento.altKey || elemento.alt || ""
            );

            visorTitulo.textContent =
                traducirHistoria(
                    elemento.tituloKey || elemento.titleKey || ""
                );

            visorDescripcion.textContent =
                traducirHistoria(
                    elemento.descripcionKey || elemento.textKey || ""
                );

            visorEtiqueta.textContent =
                traducirHistoria(
                    elemento.kickerKey || "history.viewer.defaultEyebrow"
                );

            visorImagen.style.filter =
                obtenerFiltroTema(elemento.tema);

            visorContador.textContent =
                `${indiceVisor + 1} / ${elementosVisor.length}`;

            botonAnteriorVisor.disabled = indiceVisor === 0;

            botonSiguienteVisor.disabled =
                indiceVisor === elementosVisor.length - 1;

        }


        // =====================================
        // ABRIR VISOR
        // =====================================

        function abrirVisor(tipo, indice = 0) {

            tipoVisor = tipo;

            if (tipo === "puntos") {

                elementosVisor = Object.entries(puntosHistoria).map(
                    ([clave, informacion]) => ({
                        ...informacion,
                        clave
                    })
                );

            } else {

                elementosVisor = historiaAPI.timelineData.map(
                    (etapa, posicion) => ({
                        ...etapa,
                        posicion
                    })
                );

            }

            if (elementosVisor.length === 0) return;

            indiceVisor = Math.max(
                0,
                Math.min(indice, elementosVisor.length - 1)
            );

            elementoEnfocadoAnterior = document.activeElement;
            overflowAnterior = document.body.style.overflow;

            mostrarElementoVisor();

            visor.classList.add("activo");
            visor.setAttribute("aria-hidden", "false");

            document.body.style.overflow = "hidden";

            botonCerrarVisor.focus();

        }


        // =====================================
        // CERRAR VISOR
        // =====================================

        function cerrarVisor() {

            visor.classList.remove("activo");
            visor.setAttribute("aria-hidden", "true");

            document.body.style.overflow = overflowAnterior;

            if (
                elementoEnfocadoAnterior &&
                typeof elementoEnfocadoAnterior.focus === "function"
            ) {
                elementoEnfocadoAnterior.focus();
            }

        }


        // =====================================
        // SINCRONIZAR CON LA PÁGINA
        // =====================================

        function sincronizarElementoActual() {

            const elemento = elementosVisor[indiceVisor];

            if (!elemento) return;

            if (tipoVisor === "puntos") {

                historiaAPI.actualizarExplorador(
                    elemento,
                    elemento.clave
                );
                puntoHistoriaActivo = elemento.clave;

            } else {

                historiaAPI.actualizarTimeline(elemento.posicion);
                puntoHistoriaActivo = null;

                document.querySelectorAll(".punto-historico").forEach(
                    (punto) => {
                        punto.setAttribute("aria-pressed", "false");
                    }
                );

            }

        }


        // =====================================
        // NAVEGACIÓN DEL VISOR
        // =====================================

        function cambiarElementoVisor(direccion) {

            const nuevoIndice = indiceVisor + direccion;

            if (
                nuevoIndice < 0 ||
                nuevoIndice >= elementosVisor.length
            ) {
                return;
            }

            indiceVisor = nuevoIndice;

            mostrarElementoVisor();
            sincronizarElementoActual();

        }


        // =====================================
        // ABRIR DESDE EXPLORADOR
        // =====================================

        if (imagenHistoria) {

            imagenHistoria.addEventListener("click", () => {

                const marcadorActivo = document.querySelector(
                    '.punto-historico[aria-pressed="true"]'
                );

                const claves = Object.keys(puntosHistoria);

                const indice = marcadorActivo
                    ? claves.indexOf(marcadorActivo.dataset.punto)
                    : claves.indexOf("museo");

                abrirVisor("puntos", indice >= 0 ? indice : 0);
                

            });

        }


        // =====================================
        // ABRIR DESDE LÍNEA TEMPORAL
        // =====================================

        const timelineImage =
            document.getElementById("timeline-image");

        if (timelineImage) {

            timelineImage.addEventListener("click", () => {

                const pestañaActiva = document.querySelector(
                    ".timeline-tab.active"
                );

                const indice = pestañaActiva
                    ? Number(pestañaActiva.dataset.timeline)
                    : 0;

                abrirVisor("timeline", indice);
                imagenHistoria.addEventListener("keydown", (evento) => {
                 if (evento.key === "Enter" || evento.key === " ") {
                     evento.preventDefault();
                     imagenHistoria.click();
    }
});

            });

        }


        // =====================================
        // BOTONES DEL VISOR
        // =====================================

        botonCerrarVisor.addEventListener("click", cerrarVisor);

        botonAnteriorVisor.addEventListener("click", () => {
            cambiarElementoVisor(-1);
        });

        botonSiguienteVisor.addEventListener("click", () => {
            cambiarElementoVisor(1);
        });

        document.addEventListener("casablanca:languagechange", () => {
        if (puntoHistoriaActivo) {
            historiaAPI.actualizarExplorador(
                puntosHistoria[puntoHistoriaActivo],
                puntoHistoriaActivo
            );
        }

        if (visor.classList.contains("activo")) {
            mostrarElementoVisor();
        }
        });

        // Cerrar al pulsar fuera del contenido
        visor.addEventListener("click", (evento) => {

            if (evento.target === visor) {
                cerrarVisor();
            }

        });


        // =====================================
        // ACCESIBILIDAD Y TECLADO
        // =====================================

        document.addEventListener("keydown", (evento) => {

            if (!visor.classList.contains("activo")) return;

            if (evento.key === "Escape") {
                evento.preventDefault();
                cerrarVisor();
                return;
            }

            if (evento.key === "ArrowLeft") {
                evento.preventDefault();
                cambiarElementoVisor(-1);
                return;
            }

            if (evento.key === "ArrowRight") {
                evento.preventDefault();
                cambiarElementoVisor(1);
                return;
            }

            // Mantener el foco dentro del visor
            if (evento.key === "Tab") {

                const elementosEnfocables = visor.querySelectorAll(
                    'button:not(:disabled), [href], input:not(:disabled), [tabindex]:not([tabindex="-1"])'
                );

                const primero = elementosEnfocables[0];
                const ultimo =
                    elementosEnfocables[elementosEnfocables.length - 1];

                if (!primero || !ultimo) return;

                if (evento.shiftKey && document.activeElement === primero) {
                    evento.preventDefault();
                    ultimo.focus();
                } else if (
                    !evento.shiftKey &&
                    document.activeElement === ultimo
                ) {
                    evento.preventDefault();
                    primero.focus();
                }

            }

        });

    }

}
