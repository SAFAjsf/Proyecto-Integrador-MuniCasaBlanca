
/* =====================================
   EXPLORADOR INTERACTIVO DE VARIEDADES
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const options = document.querySelectorAll(".wine-explorer-option");

  const image = document.getElementById("wine-explorer-img");
  const category = document.getElementById("wine-explorer-category");
  const title = document.getElementById("wine-explorer-title");
  const description = document.getElementById("wine-explorer-description");
  const profile = document.getElementById("wine-explorer-profile");

  // Evitar ejecutar el explorador en otras páginas.
  if (
    !options.length ||
    !image ||
    !category ||
    !title ||
    !description ||
    !profile
  ) {
    return;
  }

  // Información basada en los textos actuales de la página.
  const varieties = {

    sauvignon: {
      image: "/static/images/valle.jpg",
      category: "wines.category.white",
      title: "Sauvignon Blanc",
      description: "wines.variety.sauvignon.description",
      profile: "wines.variety.sauvignon.profile"
    },

    chardonnay: {
      image: "/static/images/valle.jpg",
      category: "wines.category.white",
      title: "Chardonnay",
      description: "wines.variety.chardonnay.description",
      profile: "wines.variety.chardonnay.profile"
    },

    pinot: {
      image: "/static/images/valle.jpg",
      category: "wines.category.red",
      title: "Pinot Noir",
      description: "wines.variety.pinot.description",
      profile: "wines.variety.pinot.profile"
    },

    syrah: {
      image: "/static/images/valle.jpg",
      category: "wines.category.red",
      title: "Syrah",
      description: "wines.variety.syrah.description",
      profile: "wines.variety.syrah.profile"
    }

  };

  const translate = (key) => window.CasablancaI18n?.t(key) || key;
  let selectedVariety = "sauvignon";

  function showVariety(varietyId) {

    const variety = varieties[varietyId];

    if (!variety) return;

    // Actualizar el estado de los botones.
    options.forEach((option) => {

      const isActive = option.dataset.variety === varietyId;

      option.classList.toggle("active", isActive);
      option.setAttribute("aria-pressed", String(isActive));

    });

    // Aplicar transición de imagen.
    image.classList.add("changing");

    image.onload = () => {
      image.classList.remove("changing");
    };

    image.onerror = () => {
      image.classList.remove("changing");
      image.src = "/static/images/valle.jpg";
      image.alt = translate("wines.explorer.imageAlt");
    };

    image.src = variety.image;
    image.alt = translate("wines.explorer.imageAlt");

    // Actualizar contenido.
    category.textContent = translate(variety.category);
    title.textContent = variety.title;
    description.textContent = translate(variety.description);
    profile.textContent = translate(variety.profile);
    selectedVariety = varietyId;

  }

  // Escuchar las selecciones.
  options.forEach((option) => {

    option.addEventListener("click", () => {
      showVariety(option.dataset.variety);
    });

  });

  // Estado inicial.
  showVariety("sauvignon");

  document.addEventListener("casablanca:languagechange", () => {
    showVariety(selectedVariety);
  });

});
