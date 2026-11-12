// =====================================
// FUNCIONALIDADES COMPARTIDAS
// =====================================

// Menú de navegación
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
    function updateMenuLabel(isOpen) {
        const key = isOpen ? "nav.close" : "nav.open";
        const fallback = isOpen ? "Cerrar menú" : "Abrir menú";
        const label = window.CasablancaI18n
            ? window.CasablancaI18n.t(key)
            : fallback;

        menuToggle.setAttribute("aria-label", label);
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("is-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        updateMenuLabel(isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            updateMenuLabel(false);
        });
    });

    document.addEventListener("casablanca:languagechange", () => {
        updateMenuLabel(menuToggle.getAttribute("aria-expanded") === "true");
    });
}

// Accesos directos a las secciones de la página
const pageSections = Array.from(document.querySelectorAll("main section"))
    .map((section, index) => {
        const heading = section.querySelector("h1, h2");

        if (!heading) return null;

        const label = getSectionLabel(section);
        const baseId = section.id || label
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || `seccion-${index + 1}`;

        let targetId = baseId;
        let suffix = 2;

        while (
            document.getElementById(targetId) &&
            document.getElementById(targetId) !== section
        ) {
            targetId = `${baseId}-${suffix}`;
            suffix += 1;
        }

        section.id = targetId;
        return { id: targetId, section };
    })
    .filter(Boolean);

function getSectionLabel(section) {
    const heading = section.querySelector("h1, h2");

    if (!heading) return "";

    const headingText = heading.cloneNode(true);
    headingText.querySelectorAll("br").forEach((lineBreak) => {
        lineBreak.replaceWith(" ");
    });

    return headingText.textContent.replace(/\s+/g, " ").trim();
}

if (pageSections.length > 1) {
    const sectionJump = document.createElement("details");
    sectionJump.className = "section-jump";

    const summary = document.createElement("summary");
    const summaryText = document.createTextNode("");
    summary.append(summaryText);

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "⌃";
    summary.append(arrow);

    const links = document.createElement("nav");
    links.className = "section-jump-links";
    links.setAttribute("aria-label", "Secciones de esta página");

    pageSections.forEach(({ id }) => {
        const link = document.createElement("a");
        link.href = `#${id}`;
        link.addEventListener("click", () => {
            sectionJump.open = false;
        });
        links.append(link);
    });

    function updateSectionJumpLabels() {
        const translate = (key, fallback) => {
            return window.CasablancaI18n
                ? window.CasablancaI18n.t(key)
                : fallback;
        };

        summaryText.nodeValue = translate("page.sections", "En esta página");
        links.setAttribute(
            "aria-label",
            translate("page.sectionNavigation", "Secciones de esta página")
        );

        pageSections.forEach(({ section }, index) => {
            links.children[index].textContent = getSectionLabel(section);
        });
    }

    sectionJump.append(summary, links);
    document.body.append(sectionJump);

    updateSectionJumpLabels();
    document.addEventListener(
        "casablanca:languagechange",
        updateSectionJumpLabels
    );
}

// =====================================
// LÍNEA TEMPORAL DE HISTORIA
// =====================================

const timelineData = [
    {
        kickerKey: "history.timeline.item0.kicker",
        titleKey: "history.timeline.item0.title",
        textKey: "history.timeline.item0.description",
        image: "../img/historia-arqueologia.jpg",
        altKey: "history.timeline.item0.imageAlt",
        tema: "tema-antiguo"
    },
    {
        kickerKey: "history.timeline.item1.kicker",
        titleKey: "history.timeline.item1.title",
        textKey: "history.timeline.item1.description",
        image: "../img/plaza1900.jpg",
        altKey: "history.timeline.item1.imageAlt",
        tema: "tema-1900"
    },
    {
        kickerKey: "history.timeline.item2.kicker",
        titleKey: "history.timeline.item2.title",
        textKey: "history.timeline.item2.description",
        image: "../img/plaza.jpg",
        altKey: "history.timeline.item2.imageAlt",
        tema: "tema-actual"
    }
];

const translateHistory = (key) =>
    window.CasablancaI18n?.t(key) || key;

// Elementos de la línea temporal
const tabs = document.querySelectorAll("[data-timeline]");
const timelineKicker = document.getElementById("timeline-kicker");
const timelineTitle = document.getElementById("timeline-title");
const timelineDescription = document.getElementById("timeline-description");
const timelineImage = document.getElementById("timeline-image");
let timelineIndex = 0;


// Cambiar la etapa seleccionada
function actualizarTimeline(indice) {
    const item = timelineData[indice];

    if (!item) return;
    timelineIndex = indice;

    tabs.forEach((tab) => {
        const activo = Number(tab.dataset.timeline) === indice;

        tab.classList.toggle("active", activo);
        tab.setAttribute("aria-selected", String(activo));
        tab.setAttribute("tabindex", activo ? "0" : "-1");
    });

    if (timelineKicker) {
        timelineKicker.textContent = translateHistory(item.kickerKey);
    }

    if (timelineTitle) {
        timelineTitle.textContent = translateHistory(item.titleKey);
    }

    if (timelineDescription) {
        timelineDescription.textContent = translateHistory(item.textKey);
    }

    if (timelineImage) {
        timelineImage.src = item.image;
        timelineImage.alt = translateHistory(item.altKey);
    }

    cambiarTemaHistoria(item.tema);
}

// Eventos de las pestañas
if (tabs.length) {
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const indice = Number(tab.dataset.timeline);
            actualizarTimeline(indice);
        });

        tab.addEventListener("keydown", (evento) => {
            const indiceActual = Number(tab.dataset.timeline);
            let nuevoIndice = null;

            if (evento.key === "ArrowRight") {
                nuevoIndice = (indiceActual + 1) % timelineData.length;
            }

            if (evento.key === "ArrowLeft") {
                nuevoIndice =
                    (indiceActual - 1 + timelineData.length) %
                    timelineData.length;
            }

            if (nuevoIndice !== null) {
                evento.preventDefault();
                actualizarTimeline(nuevoIndice);

                tabs[nuevoIndice]?.focus();
            }
        });
    });
}


// =====================================
// FUNCIONES COMPARTIDAS CON HISTORIA.JS
// =====================================

const temasHistoria = [
    "tema-actual",
    "tema-antiguo",
    "tema-1900",
    "tema-patrimonio"
];

function cambiarTemaHistoria(tema) {
    if (!tema || !temasHistoria.includes(tema)) return;

    document.body.classList.remove(...temasHistoria);
    document.body.classList.add(tema);
}

if (tabs.length) {
    actualizarTimeline(timelineIndex);
    document.addEventListener("casablanca:languagechange", () => {
        actualizarTimeline(timelineIndex);
    });
}

function actualizarExplorador(informacion, clave) {
    if (!informacion) return;

    const imagen = document.getElementById("historia-imagen");
    const titulo = document.getElementById("historia-titulo");
    const descripcion = document.getElementById("historia-descripcion");

    if (titulo) {
        titulo.textContent = translateHistory(informacion.tituloKey);
    }

    if (descripcion) {
        descripcion.textContent = translateHistory(informacion.descripcionKey);
    }

    if (imagen && informacion.imagen) {
        imagen.classList.remove("cambiar-imagen");

        imagen.src = informacion.imagen;
        imagen.alt = translateHistory(informacion.altKey);

        void imagen.offsetWidth;
        imagen.classList.add("cambiar-imagen");
    }

    document.querySelectorAll(".punto-historico").forEach((punto) => {
        const seleccionado = punto.dataset.punto === clave;

        punto.setAttribute("aria-pressed", String(seleccionado));
    });

    cambiarTemaHistoria(informacion.tema);
}


// Exponer las funciones y datos para historia.js
window.CasablancaHistoria = {
    timelineData,
    actualizarTimeline,
    actualizarExplorador,
    cambiarTemaHistoria
};