
/* =========================================
   NOTICIAS Y NOVEDADES
   Casablanca Chile
========================================= */

(() => {
  "use strict";

  const demoNews = window.CasablancaNewsDemo || [];
  const config = window.CasablancaNewsConfig || {};

  const currentLanguage = () => {
    return window.CasablancaI18n
      ? window.CasablancaI18n.getLanguage()
      : "es";
  };

  const t = (key) => {
    return window.CasablancaI18n
      ? window.CasablancaI18n.t(key)
      : key;
  };

  const localized = (value, language) => {
    if (typeof value === "string") return value;
    if (!value) return "";

    return value[language] || value.es || "";
  };

  const assetPath = (path) => {
    if (!path) return "";

    if (/^(https?:|data:)/i.test(path)) {
      return path;
    }

    const prefix = window.location.pathname.includes("/pages/")
      ? "../"
      : "";

    return prefix + path.replace(/^\.?\//, "");
  };

  const escapeHTML = (value) => {
    return String(value ?? "").replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];
    });
  };

  const categoryLabels = {
    turismo: "news.filterTourism",
    cultura: "news.filterCulture",
    enoturismo: "news.filterWine",
    eventos: "news.filterEvents"
  };

  let newsItems = [];
  let activeCategory = "all";
  let activeNews = null;

  const categoryName = (category) => {
    const key = categoryLabels[category];

    return key ? t(key) : category;
  };

  const newsText = (item, field, language) => {
    return localized(item[field], language);
  };

  const formatDate = (date, language) => {
    if (!date) return "";

    const parsedDate = new Date(`${date}T12:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const locale = {
      es: "es-CL",
      en: "en-GB",
      pt: "pt-BR",
      fr: "fr-FR"
    }[language] || "es-CL";

    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(parsedDate);
  };

  /*
   * Fuente de datos.
   * Si existe una API configurada, se consulta.
   * Mientras tanto, se utilizan los datos de demostración.
   */
  async function loadNews() {
    if (!config.apiUrl) {
      return demoNews.filter((item) => item.publicada !== false);
    }

    const response = await fetch(config.apiUrl, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Error al consultar noticias: ${response.status}`);
    }

    const data = await response.json();

    // Permite recibir un arreglo directo o una respuesta paginada de Django REST Framework.
    const results = Array.isArray(data) ? data : data.results;

    if (!Array.isArray(results)) {
      throw new Error("El formato recibido desde la API no es válido.");
    }

    return results.filter((item) => item.publicada !== false);
  }

  /*
   * Construir una tarjeta.
   */
  function createNewsCard(item, language) {
    const title = newsText(item, "titulo", language) ||
      newsText(item, "title", language);

    const summary = newsText(item, "resumen", language) ||
      newsText(item, "summary", language);

    const image = assetPath(item.imagen || item.image);
    const category = item.categoria || item.category || "turismo";
    const date = formatDate(item.fecha || item.date, language);

    const demoLabel = item.demostracion
      ? `<span class="news-demo-label">${escapeHTML(t("news.demo"))}</span>`
      : "";

    const dateLabel = date
      ? `<span class="news-date">${escapeHTML(date)}</span>`
      : "";

    return `
      <article class="news-card">
        <div class="news-card-image">
          <img
            src="${escapeHTML(image)}"
            alt="${escapeHTML(title)}"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div class="news-card-body">
          <div class="news-card-meta">
            <span class="news-category">
              ${escapeHTML(categoryName(category))}
            </span>
            ${dateLabel}
            ${demoLabel}
          </div>

          <h3>${escapeHTML(title)}</h3>

          <p>${escapeHTML(summary)}</p>

          <button
            class="news-read-button"
            type="button"
            data-news-id="${escapeHTML(item.id)}"
          >
            ${escapeHTML(t("news.readMore"))}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>
    `;
  }

  /*
   * Renderizar tarjetas en cualquier contenedor.
   */
  function renderNews(container, items) {
    if (!container) return;

    const language = currentLanguage();

    container.innerHTML = items
      .map((item) => createNewsCard(item, language))
      .join("");

    container.querySelectorAll("[data-news-id]").forEach((button) => {
      button.addEventListener("click", () => {
        openNews(button.dataset.newsId);
      });
    });
  }

  /*
   * Mostrar las tres publicaciones más recientes en Inicio.
   */
  function renderHomeNews() {
    const container = document.getElementById("home-news-grid");

    if (!container) return;

    const latest = [...newsItems]
      .sort((a, b) => {
        const dateA = new Date(a.fecha || a.date || 0).getTime();
        const dateB = new Date(b.fecha || b.date || 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 3);

    renderNews(container, latest);
  }

  /*
   * Renderizar el listado completo y aplicar filtros.
   */
  function renderNewsPage() {
    const container = document.getElementById("news-grid");
    const emptyMessage = document.getElementById("news-empty");

    if (!container) return;

    const filteredNews = activeCategory === "all"
      ? newsItems
      : newsItems.filter((item) => {
          return (item.categoria || item.category) === activeCategory;
        });

    renderNews(container, filteredNews);

    if (emptyMessage) {
      emptyMessage.hidden = filteredNews.length > 0;
    }

    document.querySelectorAll(".news-filter").forEach((button) => {
      const active = button.dataset.category === activeCategory;

      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  /*
   * Abrir la ventana de lectura.
   */
  function openNews(id) {
    const item = newsItems.find((news) => String(news.id) === String(id));

    if (!item) return;

    activeNews = item;

    const language = currentLanguage();
    const dialog = document.getElementById("news-dialog");

    if (!dialog) return;

    const title = newsText(item, "titulo", language) ||
      newsText(item, "title", language);

    const content = newsText(item, "contenido", language) ||
      newsText(item, "content", language);

    const image = assetPath(item.imagen || item.image);
    const category = item.categoria || item.category || "turismo";

    document.getElementById("news-dialog-image").src = image;
    document.getElementById("news-dialog-image").alt = title;
    document.getElementById("news-dialog-title").textContent = title;
    document.getElementById("news-dialog-category").textContent =
      categoryName(category);

    const demoLabel = document.getElementById("news-dialog-demo");
    demoLabel.textContent = t("news.demo");
    demoLabel.hidden = !item.demostracion;

    const contentContainer = document.getElementById("news-dialog-text");
    contentContainer.innerHTML = "";

    const paragraphs = Array.isArray(content)
      ? content
      : [content];

    paragraphs.forEach((paragraph) => {
      const element = document.createElement("p");
      element.textContent = paragraph;
      contentContainer.append(element);
    });

    if (!dialog.open) {
      dialog.showModal();
    }
  }

  /*
   * Actualizar la lectura si cambia el idioma.
   */
  function refreshDialog() {
    if (activeNews) {
      openNews(activeNews.id);
    }
  }

  /*
   * Inicializar filtros y cierre del diálogo.
   */
  function initializeNewsControls() {
    document.querySelectorAll(".news-filter").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        renderNewsPage();
      });
    });

    const dialog = document.getElementById("news-dialog");
    const closeButton = document.querySelector(".news-dialog-close");

    if (dialog && closeButton) {
      closeButton.addEventListener("click", () => {
        dialog.close();
      });

      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
          dialog.close();
        }
      });

      dialog.addEventListener("close", () => {
        activeNews = null;
      });
    }
  }

  /*
   * Inicio.
   */
  async function initialize() {
    const errorMessage = document.getElementById("news-error");

    initializeNewsControls();

    try {
      newsItems = await loadNews();

      renderHomeNews();
      renderNewsPage();
    } catch (error) {
      console.error(error);

      if (errorMessage) {
        errorMessage.hidden = false;
      }
    }
  }

  document.addEventListener("casablanca:languagechange", () => {
    renderHomeNews();
    renderNewsPage();
    refreshDialog();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();
