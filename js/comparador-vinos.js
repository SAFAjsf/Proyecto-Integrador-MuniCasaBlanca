
/* =====================================
   COMPARADOR INTERACTIVO DE VINOS
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const selectOne = document.getElementById("wine-compare-one");
  const selectTwo = document.getElementById("wine-compare-two");

  const results = document.getElementById("comparison-results");
  const error = document.getElementById("comparison-error");
  const summary = document.getElementById("comparison-summary");

  if (!selectOne || !selectTwo || !results || !summary) {
    return;
  }

  const fallbackImage = "../img/valle.jpg";

  const wines = {

    sauvignon: {
      name: "Sauvignon Blanc",
      category: "wines.category.white",
      image: "../img/vinos/sauvignon-blanc.jpg",
      description: "wines.comparison.wines.sauvignon.description",
      acidity: "wines.comparison.wines.sauvignon.acidity",
      body: "wines.comparison.wines.sauvignon.body",
      aroma: "wines.comparison.wines.sauvignon.aroma",
      difference: "wines.comparison.wines.sauvignon.difference"
    },

    chardonnay: {
      name: "Chardonnay",
      category: "wines.category.white",
      image: "../img/vinos/chardonnay.jpg",
      description: "wines.comparison.wines.chardonnay.description",
      acidity: "wines.comparison.wines.chardonnay.acidity",
      body: "wines.comparison.wines.chardonnay.body",
      aroma: "wines.comparison.wines.chardonnay.aroma",
      difference: "wines.comparison.wines.chardonnay.difference"
    },

    pinot: {
      name: "Pinot Noir",
      category: "wines.category.red",
      image: "../img/vinos/pinot-noir.jpg",
      description: "wines.comparison.wines.pinot.description",
      acidity: "wines.comparison.wines.pinot.acidity",
      body: "wines.comparison.wines.pinot.body",
      aroma: "wines.comparison.wines.pinot.aroma",
      difference: "wines.comparison.wines.pinot.difference"
    },

    syrah: {
      name: "Syrah",
      category: "wines.category.red",
      image: "../img/vinos/syrah.jpg",
      description: "wines.comparison.wines.syrah.description",
      acidity: "wines.comparison.wines.syrah.acidity",
      body: "wines.comparison.wines.syrah.body",
      aroma: "wines.comparison.wines.syrah.aroma",
      difference: "wines.comparison.wines.syrah.difference"
    }

  };

  const translate = (key) => window.CasablancaI18n?.t(key) || key;
  let lastValidComparison = ["sauvignon", "chardonnay"];

  function format(key, values) {
    return Object.entries(values).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, value),
      translate(key)
    );
  }

  // Actualizar una ficha individual.
  function updateCard(id, wine) {

    const image = document.getElementById(`comparison-image-${id}`);

    const category = document.getElementById(`comparison-category-${id}`);
    const title = document.getElementById(`comparison-title-${id}`);
    const description = document.getElementById(`comparison-description-${id}`);

    const acidity = document.getElementById(`comparison-acidity-${id}`);
    const body = document.getElementById(`comparison-body-${id}`);
    const aroma = document.getElementById(`comparison-aroma-${id}`);

    category.textContent = translate(wine.category);
    title.textContent = wine.name;
    description.textContent = translate(wine.description);

    acidity.textContent = translate(wine.acidity);
    body.textContent = translate(wine.body);
    aroma.textContent = translate(wine.aroma);

    image.onerror = () => {
      image.onerror = null;
      image.src = fallbackImage;
      image.alt = format("wines.comparison.referenceImageAlt", { name: wine.name });
    };

    image.src = wine.image;
    image.alt = format("wines.comparison.wineImageAlt", { name: wine.name });
  }

  // Generar conclusión dinámica.
  function generateSummary(first, second) {

    const whiteWine = first.category === "wines.category.white"
      ? first
      : second.category === "wines.category.white"
        ? second
        : null;

    const redWine = first.category === "wines.category.red"
      ? first
      : second.category === "wines.category.red"
        ? second
        : null;

    if (whiteWine && redWine) {
      return format("wines.comparison.summary.mixed", {
        whiteName: whiteWine.name,
        whiteDifference: translate(whiteWine.difference),
        redName: redWine.name,
        redDifference: translate(redWine.difference)
      });
    }

    return format("wines.comparison.summary.sameCategory", {
      firstName: first.name,
      firstDifference: translate(first.difference),
      secondName: second.name,
      secondDifference: translate(second.difference)
    });
  }

  // Ejecutar comparación.
  function compareWines() {

    const firstId = selectOne.value;
    const secondId = selectTwo.value;

    if (firstId === secondId) {
      results.hidden = true;
      error.hidden = false;
      return;
    }

    const first = wines[firstId];
    const second = wines[secondId];

    if (!first || !second) return;

    renderComparison(first, second);
    lastValidComparison = [firstId, secondId];
    results.hidden = false;
    error.hidden = true;
  }

  function renderComparison(first, second) {
    updateCard("one", first);
    updateCard("two", second);

    summary.textContent = generateSummary(first, second);
  }

  // Escuchar cambios.
  selectOne.addEventListener("change", compareWines);
  selectTwo.addEventListener("change", compareWines);
  document.addEventListener("casablanca:languagechange", () => {
    const [firstId, secondId] = lastValidComparison;
    renderComparison(wines[firstId], wines[secondId]);
  });

  // Primera comparación.
  compareWines();

});
