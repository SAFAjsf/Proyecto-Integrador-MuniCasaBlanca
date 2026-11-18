
/* =====================================
   EXPLORADOR INTERACTIVO DE QUINTAY
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const options = document.querySelectorAll(".coast-explorer-option");

  const image = document.getElementById("coast-explorer-img");
  const number = document.getElementById("coast-explorer-number");
  const category = document.getElementById("coast-explorer-category");
  const title = document.getElementById("coast-explorer-title");
  const description = document.getElementById("coast-explorer-description");
  const extra = document.getElementById("coast-explorer-extra");
  const tag = document.getElementById("coast-explorer-tag");

  // Comprobar que estamos en la página correcta.
  if (
    !options.length ||
    !image ||
    !number ||
    !category ||
    !title ||
    !description ||
    !extra ||
    !tag
  ) {
    return;
  }

  // Información disponible para cada lugar.
  // Se utilizan los contenidos que ya estaban en la página.

  const places = {

    playas: {
      number: "01",
      image: "/static/images/quintay.jpg",
      altKey: "quintay.explorer.imageAlt",
      categoryKey: "quintay.place.beaches.eyebrow",
      titleKey: "quintay.place.beaches.detailTitle",
      descriptionKey: "quintay.place.beaches.description",
      extraKey: "quintay.place.beaches.extra",
      tagKey: "quintay.place.beaches.tag"
    },

    museo: {
      number: "02",
      image: "/static/images/museoballenera.jpg",
      altKey: "quintay.place.museum.imageAlt",
      categoryKey: "quintay.place.museum.eyebrow",
      titleKey: "quintay.place.museum.detailTitle",
      descriptionKey: "quintay.place.museum.description",
      extraKey: "quintay.place.museum.extra",
      tagKey: "quintay.place.museum.tag"
    },

    comunidad: {
      number: "03",
      image: "/static/images/plaza.jpg",
      altKey: "quintay.place.community.imageAlt",
      categoryKey: "quintay.place.community.eyebrow",
      titleKey: "quintay.place.community.detailTitle",
      descriptionKey: "quintay.place.community.description",
      extraKey: "quintay.place.community.extra",
      tagKey: "quintay.place.community.tag"
    }

  };

  const translate = (key) => window.CasablancaI18n?.t(key) || key;
  let selectedPlace = "playas";

  function showPlace(placeId) {

    const place = places[placeId];

    if (!place) return;

    // Actualizar selección visual y accesibilidad.
    options.forEach((option) => {

      const isActive = option.dataset.place === placeId;

      option.classList.toggle("active", isActive);
      option.setAttribute("aria-pressed", String(isActive));

    });

    // Preparar transición de imagen.
    image.classList.add("changing");

    image.onload = () => {
      image.classList.remove("changing");
    };

    image.onerror = () => {
      image.classList.remove("changing");
      image.src = "/static/images/quintay.jpg";
      image.alt = translate("quintay.hero.imageAlt");
    };

    // Actualizar información.
    image.src = place.image;
    image.alt = translate(place.altKey);

    number.textContent = place.number;
    category.textContent = translate(place.categoryKey);
    title.textContent = translate(place.titleKey);
    description.textContent = translate(place.descriptionKey);
    extra.textContent = translate(place.extraKey);
    tag.textContent = translate(place.tagKey);
    selectedPlace = placeId;

  }

  // Eventos de selección.
  options.forEach((option) => {

    option.addEventListener("click", () => {
      showPlace(option.dataset.place);
    });

  });

  // Estado inicial.
  showPlace("playas");

  document.addEventListener("casablanca:languagechange", () => {
    showPlace(selectedPlace);
  });

});
