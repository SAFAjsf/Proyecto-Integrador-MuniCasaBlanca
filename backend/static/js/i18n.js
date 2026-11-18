/* =====================================
   SISTEMA DE INTERNACIONALIZACIÓN
   Casablanca Chile
===================================== */

(() => {
  "use strict";

  const STORAGE_KEY = "casablanca_language";
  const DEFAULT_LANGUAGE = "es";

  const translations = window.CasablancaTranslations || {};

  const supportedLanguages = Object.keys(translations);

  function getSavedLanguage() {
    try {
      const savedLanguage = localStorage.getItem(STORAGE_KEY);

      if (supportedLanguages.includes(savedLanguage)) {
        return savedLanguage;
      }
    } catch (error) {
      console.warn("No fue posible recuperar el idioma guardado.", error);
    }

    return DEFAULT_LANGUAGE;
  }

  let currentLanguage = getSavedLanguage();

  /*
   * Obtener una traducción.
   * Si no existe en el idioma seleccionado,
   * utilizar el texto español como respaldo.
   */
  function translate(key, language = currentLanguage) {
    const selectedDictionary = translations[language] || {};
    const defaultDictionary = translations[DEFAULT_LANGUAGE] || {};

    return selectedDictionary[key] ??
      defaultDictionary[key] ??
      key;
  }

  /*
   * Traducir atributos HTML.
   *
   * Formato:
   * data-i18n-attr="aria-label:nav.open"
   */
  function translateAttributes(element, language) {
    const attributes = element.dataset.i18nAttr;

    if (!attributes) return;

    attributes.split(",").forEach((item) => {
      const separator = item.indexOf(":");

      if (separator === -1) return;

      const attribute = item.slice(0, separator).trim();
      const key = item.slice(separator + 1).trim();

      if (!attribute || !key) return;

      element.setAttribute(
        attribute,
        translate(key, language)
      );
    });
  }

  /*
   * Aplicar traducciones a toda la página.
   */
  function applyTranslations(language = currentLanguage) {
    if (!supportedLanguages.includes(language)) {
      language = DEFAULT_LANGUAGE;
    }

    currentLanguage = language;

    document.documentElement.lang = language;

    // Textos visibles.
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;

      element.textContent = translate(key, language);
    });

    // Atributos como aria-label, title y alt.
    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      translateAttributes(element, language);
    });

    // Placeholders de formularios.
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.setAttribute(
        "placeholder",
        translate(element.dataset.i18nPlaceholder, language)
      );
    });

    // Metadatos de la página.
    document.querySelectorAll("[data-i18n-content]").forEach((element) => {
      element.setAttribute(
        "content",
        translate(element.dataset.i18nContent, language)
      );
    });

    // Mantener sincronizados todos los selectores de idioma.
    document.querySelectorAll("[data-language-switcher]").forEach((select) => {
      select.value = language;
    });

    // Avisar a los módulos que generan contenido dinámico.
    document.dispatchEvent(
      new CustomEvent("casablanca:languagechange", {
        detail: { language }
      })
    );
  }

  /*
   * Cambiar idioma y guardar la preferencia.
   */
  function setLanguage(language) {
    if (!supportedLanguages.includes(language)) {
      return;
    }

    currentLanguage = language;

    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.warn("No fue posible guardar el idioma seleccionado.", error);
    }

    applyTranslations(language);
  }

  /*
   * Inicializar selectores.
   */
  function initializeLanguageSwitchers() {
    document.querySelectorAll("[data-language-switcher]").forEach((select) => {
      select.addEventListener("change", () => {
        setLanguage(select.value);
      });
    });
  }

  /*
   * API pública para los demás archivos JavaScript.
   */
  window.CasablancaI18n = {
    t: translate,
    setLanguage,
    getLanguage: () => currentLanguage,
    apply: applyTranslations
  };

  // Inicialización.
  initializeLanguageSwitchers();
  applyTranslations(currentLanguage);

})();