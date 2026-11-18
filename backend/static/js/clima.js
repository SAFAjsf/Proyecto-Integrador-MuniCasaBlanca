
/* =========================================
   CLIMA - CASABLANCA CHILE
   API: WeatherAPI.com mediante Django
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const locations = {
    casablanca: {
      name: "Casablanca",
    },

    quintay: {
      name: "Quintay",
    }
  };


  const isHomePage = Boolean(
    document.querySelector("#home-weather")
  );

  const isWeatherPage = Boolean(
    document.querySelector(".weather-page")
  );

  if (!isHomePage && !isWeatherPage) {
    return;
  }

  let selectedLocation = "casablanca";

  const weatherContent = document.querySelector("#weather-content");
  const weatherStatus = document.querySelector("#weather-status");
  const weatherError = document.querySelector("#weather-error");

  const translations = {

    es: {
      loading: "Consultando información meteorológica...",
      error: "No fue posible obtener el pronóstico. Intenta nuevamente más tarde.",
      retry: "Intentar nuevamente",
      today: "Hoy",
      minimum: "Mínima",
      maximum: "Máxima",
      feelsLike: "Sensación térmica",
      rainChance: "Probabilidad de lluvia",
      uvIndex: "Índice UV máximo",
      wind: "Viento actual",
      humidity: "Humedad",
      nextDays: "Pronóstico de los próximos días",
      tips: "Recomendaciones para tu visita",
      noTips: "Las condiciones previstas no presentan recomendaciones especiales. Recuerda revisar el pronóstico antes de salir.",
      updated: "Última actualización",
      sunny: "Despejado",
      mainlySunny: "Principalmente despejado",
      partlyCloudy: "Parcialmente nublado",
      cloudy: "Nublado",
      fog: "Niebla",
      drizzle: "Llovizna",
      rain: "Lluvia",
      snow: "Nieve",
      showers: "Chubascos",
      storm: "Tormenta",
      unknown: "Condiciones variables",
      uvTitle: "Protege tu piel del sol",
      uvText: "Se espera radiación ultravioleta elevada. Utiliza protector solar, sombrero y gafas de sol.",
      hotTitle: "Mantente hidratado",
      hotText: "Se esperan temperaturas elevadas. Prefiere ropa ligera, bebe agua y busca lugares con sombra.",
      warmTitle: "Prepárate para el calor",
      warmText: "Utiliza ropa cómoda y mantente hidratado durante tus recorridos.",
      coldTitle: "Lleva ropa de abrigo",
      coldText: "Las temperaturas serán bajas. Considera llevar una chaqueta, especialmente durante la mañana y la noche.",
      rainTitle: "Prepárate para las precipitaciones",
      rainText: "Existe posibilidad de lluvia. Lleva paraguas o ropa impermeable y considera alternativas bajo techo.",
      windTitle: "Considera el viento",
      windText: "Se esperan vientos intensos. Utiliza ropa cortaviento y toma precauciones en sectores expuestos.",
      goodTitle: "Aprovecha las condiciones",
      goodText: "El pronóstico presenta condiciones favorables para disfrutar de los atractivos y paisajes de la zona.",
      day: "Día",
      uvLow: "Bajo",
      uvModerate: "Moderado",
      uvHigh: "Alto",
      uvVeryHigh: "Muy alto",
      uvExtreme: "Extremo",
      rain: "Lluvia",
      todayDate: "Hoy"
    },

    en: {
      loading: "Checking weather information...",
      error: "Weather information could not be retrieved. Please try again later.",
      retry: "Try again",
      today: "Today",
      minimum: "Minimum",
      maximum: "Maximum",
      feelsLike: "Feels like",
      rainChance: "Chance of rain",
      uvIndex: "Maximum UV index",
      wind: "Current wind",
      humidity: "Humidity",
      nextDays: "Weather forecast",
      tips: "Recommendations for your visit",
      noTips: "No special recommendations at the moment. Remember to check the forecast before heading out.",
      updated: "Last updated",
      sunny: "Clear sky",
      mainlySunny: "Mainly clear",
      partlyCloudy: "Partly cloudy",
      cloudy: "Cloudy",
      fog: "Fog",
      drizzle: "Drizzle",
      rain: "Rain",
      snow: "Snow",
      showers: "Showers",
      storm: "Thunderstorm",
      unknown: "Variable conditions",
      uvTitle: "Protect your skin",
      uvText: "High ultraviolet radiation is expected. Use sunscreen, a hat and sunglasses.",
      hotTitle: "Stay hydrated",
      hotText: "High temperatures are expected. Wear light clothing, drink water and seek shade.",
      warmTitle: "Prepare for warm weather",
      warmText: "Wear comfortable clothing and stay hydrated during your activities.",
      coldTitle: "Bring warm clothing",
      coldText: "Temperatures will be low. Consider bringing a jacket, especially in the morning and evening.",
      rainTitle: "Prepare for rainfall",
      rainText: "Rain is possible. Bring an umbrella or waterproof clothing and consider indoor alternatives.",
      windTitle: "Be prepared for wind",
      windText: "Strong winds are expected. Wear windproof clothing and take care in exposed areas.",
      goodTitle: "Enjoy the conditions",
      goodText: "The forecast looks favorable for exploring local attractions and landscapes.",
      day: "Day",
      uvLow: "Low",
      uvModerate: "Moderate",
      uvHigh: "High",
      uvVeryHigh: "Very high",
      uvExtreme: "Extreme",
      rain: "Rain",
      todayDate: "Today"
    },

    pt: {
      loading: "Consultando informações meteorológicas...",
      error: "Não foi possível obter a previsão. Tente novamente mais tarde.",
      retry: "Tentar novamente",
      today: "Hoje",
      minimum: "Mínima",
      maximum: "Máxima",
      feelsLike: "Sensação térmica",
      rainChance: "Probabilidade de chuva",
      uvIndex: "Índice UV máximo",
      wind: "Vento atual",
      humidity: "Umidade",
      nextDays: "Previsão dos próximos dias",
      tips: "Recomendações para sua visita",
      noTips: "Não há recomendações especiais no momento. Consulte a previsão antes de sair.",
      updated: "Última atualização",
      sunny: "Céu limpo",
      mainlySunny: "Predominantemente limpo",
      partlyCloudy: "Parcialmente nublado",
      cloudy: "Nublado",
      fog: "Neblina",
      drizzle: "Garoa",
      rain: "Chuva",
      snow: "Neve",
      showers: "Pancadas de chuva",
      storm: "Tempestade",
      unknown: "Condições variáveis",
      uvTitle: "Proteja sua pele",
      uvText: "Espera-se alta radiação ultravioleta. Use protetor solar, chapéu e óculos de sol.",
      hotTitle: "Mantenha-se hidratado",
      hotText: "São esperadas temperaturas elevadas. Use roupas leves, beba água e procure sombra.",
      warmTitle: "Prepare-se para o calor",
      warmText: "Use roupas confortáveis e mantenha-se hidratado durante seus passeios.",
      coldTitle: "Leve roupas quentes",
      coldText: "As temperaturas serão baixas. Considere levar um casaco.",
      rainTitle: "Prepare-se para a chuva",
      rainText: "Há possibilidade de chuva. Leve guarda-chuva ou roupa impermeável.",
      windTitle: "Considere o vento",
      windText: "São esperados ventos fortes. Use roupas corta-vento e tenha cuidado em áreas expostas.",
      goodTitle: "Aproveite as condições",
      goodText: "A previsão apresenta condições favoráveis para conhecer os atrativos da região.",
      day: "Dia",
      uvLow: "Baixo",
      uvModerate: "Moderado",
      uvHigh: "Alto",
      uvVeryHigh: "Muito alto",
      uvExtreme: "Extremo",
      rain: "Chuva",
      todayDate: "Hoje"
    },

    fr: {
      loading: "Consultation des informations météorologiques...",
      error: "Impossible de récupérer les prévisions. Réessayez plus tard.",
      retry: "Réessayer",
      today: "Aujourd'hui",
      minimum: "Minimum",
      maximum: "Maximum",
      feelsLike: "Ressenti",
      rainChance: "Risque de pluie",
      uvIndex: "Indice UV maximal",
      wind: "Vent actuel",
      humidity: "Humidité",
      nextDays: "Prévisions des prochains jours",
      tips: "Conseils pour votre visite",
      noTips: "Aucun conseil particulier pour le moment. Consultez les prévisions avant de partir.",
      updated: "Dernière mise à jour",
      sunny: "Ciel dégagé",
      mainlySunny: "Principalement dégagé",
      partlyCloudy: "Partiellement nuageux",
      cloudy: "Nuageux",
      fog: "Brouillard",
      drizzle: "Bruine",
      rain: "Pluie",
      snow: "Neige",
      showers: "Averses",
      storm: "Orage",
      unknown: "Conditions variables",
      uvTitle: "Protégez votre peau",
      uvText: "Un rayonnement ultraviolet élevé est prévu. Utilisez de la crème solaire, un chapeau et des lunettes.",
      hotTitle: "Restez hydraté",
      hotText: "Des températures élevées sont prévues. Portez des vêtements légers et cherchez l'ombre.",
      warmTitle: "Préparez-vous à la chaleur",
      warmText: "Portez des vêtements confortables et hydratez-vous.",
      coldTitle: "Prévoyez des vêtements chauds",
      coldText: "Les températures seront basses. Pensez à prendre une veste.",
      rainTitle: "Préparez-vous à la pluie",
      rainText: "De la pluie est possible. Prenez un parapluie ou des vêtements imperméables.",
      windTitle: "Tenez compte du vent",
      windText: "Des vents forts sont prévus. Portez des vêtements coupe-vent.",
      goodTitle: "Profitez des conditions",
      goodText: "Les conditions semblent favorables pour découvrir les sites touristiques.",
      day: "Jour",
      uvLow: "Faible",
      uvModerate: "Modéré",
      uvHigh: "Élevé",
      uvVeryHigh: "Très élevé",
      uvExtreme: "Extrême",
      rain: "Pluie",
      todayDate: "Aujourd'hui"
    }

  };
  Object.assign(translations.es, {
  heroEyebrow: "PREPARA TU VISITA",
  heroTitle: "El tiempo también",
  heroTitleEmphasis: "forma parte del viaje.",
  heroDescription: "Consulta las condiciones meteorológicas de Casablanca y Quintay y descubre cómo prepararte para recorrer el territorio.",
  forecastEyebrow: "INFORMACIÓN METEOROLÓGICA",
  forecastTitle: "¿Cómo estará el tiempo?",
  forecastDescription: "Selecciona una localidad para consultar su pronóstico.",
  nextDaysEyebrow: "PRÓXIMOS DÍAS",
  nextDaysTitle: "Pronóstico de tres días",
  tipsEyebrow: "CONSEJOS PARA VIAJAR",
  tipsTitle: "Recomendaciones para tu visita",
  tipsDescription: "Consejos basados en las condiciones meteorológicas previstas.",
  closingEyebrow: "CASABLANCA · VALLE Y MAR",
  closingTitle: "Cada estación tiene",
  closingTitleEmphasis: "algo que descubrir.",
  closingDescription: "Planifica tu visita y conoce los paisajes, la historia y las experiencias que ofrece Casablanca.",
  backHome: "Volver al inicio",
  attribution: "Datos meteorológicos:",
  navigationClimate: "Clima"
});

Object.assign(translations.en, {
  heroEyebrow: "PREPARE YOUR VISIT",
  heroTitle: "Weather is also",
  heroTitleEmphasis: "part of the journey.",
  heroDescription: "Check the weather conditions in Casablanca and Quintay and prepare for your visit.",
  forecastEyebrow: "WEATHER INFORMATION",
  forecastTitle: "What will the weather be like?",
  forecastDescription: "Select a location to view its weather forecast.",
  nextDaysEyebrow: "COMING DAYS",
  nextDaysTitle: "Three-day forecast",
  tipsEyebrow: "TRAVEL TIPS",
  tipsTitle: "Recommendations for your visit",
  tipsDescription: "Advice based on the expected weather conditions.",
  closingEyebrow: "CASABLANCA · VALLEY AND SEA",
  closingTitle: "Every season has",
  closingTitleEmphasis: "something to discover.",
  closingDescription: "Plan your visit and discover Casablanca's landscapes, history and experiences.",
  backHome: "Back to home",
  attribution: "Weather data:",
  navigationClimate: "Weather"
});

Object.assign(translations.pt, {
  heroEyebrow: "PREPARE SUA VISITA",
  heroTitle: "O clima também",
  heroTitleEmphasis: "faz parte da viagem.",
  heroDescription: "Consulte as condições meteorológicas de Casablanca e Quintay e prepare-se para sua visita.",
  forecastEyebrow: "INFORMAÇÕES METEOROLÓGICAS",
  forecastTitle: "Como estará o tempo?",
  forecastDescription: "Selecione uma localidade para consultar a previsão.",
  nextDaysEyebrow: "PRÓXIMOS DIAS",
  nextDaysTitle: "Previsão de três dias",
  tipsEyebrow: "DICAS DE VIAGEM",
  tipsTitle: "Recomendações para sua visita",
  tipsDescription: "Conselhos baseados nas condições meteorológicas previstas.",
  closingEyebrow: "CASABLANCA · VALE E MAR",
  closingTitle: "Cada estação tem",
  closingTitleEmphasis: "algo para descobrir.",
  closingDescription: "Planeje sua visita e descubra as paisagens, a história e as experiências de Casablanca.",
  backHome: "Voltar ao início",
  attribution: "Dados meteorológicos:",
  navigationClimate: "Clima"
});

Object.assign(translations.fr, {
  heroEyebrow: "PRÉPAREZ VOTRE VISITE",
  heroTitle: "La météo fait aussi",
  heroTitleEmphasis: "partie du voyage.",
  heroDescription: "Consultez les conditions météorologiques de Casablanca et Quintay et préparez votre visite.",
  forecastEyebrow: "INFORMATIONS MÉTÉOROLOGIQUES",
  forecastTitle: "Quel temps fera-t-il ?",
  forecastDescription: "Sélectionnez une localité pour consulter les prévisions.",
  nextDaysEyebrow: "PROCHAINS JOURS",
  nextDaysTitle: "Prévisions sur trois jours",
  tipsEyebrow: "CONSEILS DE VOYAGE",
  tipsTitle: "Recommandations pour votre visite",
  tipsDescription: "Conseils basés sur les conditions météorologiques prévues.",
  closingEyebrow: "CASABLANCA · VALLÉE ET MER",
  closingTitle: "Chaque saison offre",
  closingTitleEmphasis: "quelque chose à découvrir.",
  closingDescription: "Planifiez votre visite et découvrez les paysages, l’histoire et les expériences de Casablanca.",
  backHome: "Retour à l’accueil",
  attribution: "Données météorologiques :",
  navigationClimate: "Météo"
});
  function getLanguage() {
    return window.CasablancaI18n?.getLanguage?.() || "es";
  }

  function t(key) {
    const language = getLanguage();

    return translations[language]?.[key] ??
      translations.es[key] ??
      key;
  }

  /* -------------------------------------
     DESCRIPCIÓN DEL TIEMPO
  ------------------------------------- */

  function getWeatherDescription(code) {
  if (code === 1000) return t("sunny");
  if (code === 1003) return t("partlyCloudy");

  if ([1006, 1009].includes(code)) {
    return t("cloudy");
  }

  if ([1030, 1135, 1147].includes(code)) {
    return t("fog");
  }

  if ([1072, 1150, 1153, 1168, 1171].includes(code)) {
    return t("drizzle");
  }

  if (
    [1087, 1273, 1276, 1279, 1282].includes(code)
  ) {
    return t("storm");
  }

  if (
    code === 1063 ||
    (code >= 1180 && code <= 1201)
  ) {
    return t("rain");
  }

  if ([1240, 1243, 1246].includes(code)) {
    return t("showers");
  }

  if (
    [1066, 1069, 1114, 1117, 1204, 1207, 1237].includes(code) ||
    (code >= 1210 && code <= 1225) ||
    (code >= 1249 && code <= 1264)
  ) {
    return t("snow");
  }

  return t("unknown");
}


function renderWeatherIcon(element, url) {
  if (!element) return;

  const image = document.createElement("img");

  image.src = url;
  image.alt = "";
  image.width = 64;
  image.height = 64;
  image.decoding = "async";

  element.replaceChildren(image);
}

  /* -------------------------------------
     FORMATO DE FECHAS
  ------------------------------------- */

  function formatDate(dateString, options = {}) {
    const date = new Date(`${dateString}T12:00:00`);

    return new Intl.DateTimeFormat(getLanguage(), {
      weekday: options.short ? "short" : "long",
      day: "numeric",
      month: "short"
    }).format(date);
  }

  function formatTemperature(value) {
    return `${Math.round(value)}°`;
  }

  /* -------------------------------------
     CONSULTA API
  ------------------------------------- */

async function fetchWeather(locationId) {
  const parameters = new URLSearchParams({
    ubicacion: locationId
  });

  const response = await fetch(
    `/api/clima/?${parameters}`,
    {
      headers: {
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error meteorológico: ${response.status}`
    );
  }

  const data = await response.json();

  if (
    !data.actual ||
    !Array.isArray(data.pronostico) ||
    data.pronostico.length !== 3
  ) {
    throw new Error(
      "El servicio devolvió información incompleta."
    );
  }

  const actual = data.actual;
  const pronostico = data.pronostico;

  // Adaptador para mantener compatible
  // la interfaz meteorológica existente.

  return {
    current: {
      temperature_2m: actual.temperatura_c,
      relative_humidity_2m: actual.humedad_pct,
      apparent_temperature: actual.sensacion_termica_c,
      is_day: actual.es_dia ? 1 : 0,
      precipitation: actual.precipitacion_mm,
      weather_code: actual.condicion.codigo,
      weather_icon: actual.condicion.icono,
      wind_speed_10m: actual.viento_kmh,
      time: data.actualizado
    },

    daily: {
      time: pronostico.map(
        dia => dia.fecha
      ),

      weather_code: pronostico.map(
        dia => dia.condicion.codigo
      ),

      weather_icon: pronostico.map(
        dia => dia.condicion.icono
      ),

      temperature_2m_max: pronostico.map(
        dia => dia.maxima_c
      ),

      temperature_2m_min: pronostico.map(
        dia => dia.minima_c
      ),

      precipitation_probability_max: pronostico.map(
        dia => dia.probabilidad_lluvia_pct
      ),

      uv_index_max: pronostico.map(
        dia => dia.uv
      ),

      wind_speed_10m_max: pronostico.map(
        dia => dia.viento_maximo_kmh
      )
    }
  };
}

  /* -------------------------------------
     RECOMENDACIONES AUTOMÁTICAS
  ------------------------------------- */

  function generateRecommendations(data) {
    const current = data.current;
    const daily = data.daily;

    const temperature = current.temperature_2m;
    const uv = daily.uv_index_max[0];
    const rain = daily.precipitation_probability_max[0];
    const wind = daily.wind_speed_10m_max[0];

    const recommendations = [];

    if (uv >= 6) {
      recommendations.push({
        icon: "☀️",
        title: t("uvTitle"),
        description: t("uvText")
      });
    }

    if (temperature >= 30) {
      recommendations.push({
        icon: "💧",
        title: t("hotTitle"),
        description: t("hotText")
      });
    } else if (temperature >= 25) {
      recommendations.push({
        icon: "🌡️",
        title: t("warmTitle"),
        description: t("warmText")
      });
    }

    if (temperature <= 10) {
      recommendations.push({
        icon: "🧥",
        title: t("coldTitle"),
        description: t("coldText")
      });
    }

    if (rain >= 50) {
      recommendations.push({
        icon: "🌧️",
        title: t("rainTitle"),
        description: t("rainText")
      });
    }

    if (wind >= 35) {
      recommendations.push({
        icon: "🌬️",
        title: t("windTitle"),
        description: t("windText")
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        icon: "🌿",
        title: t("goodTitle"),
        description: t("goodText")
      });
    }

    return recommendations.slice(0, 4);
  }

  /* -------------------------------------
     MOSTRAR RECOMENDACIONES
  ------------------------------------- */

  function renderRecommendations(data, container) {
    if (!container) return;

    container.replaceChildren();

    const recommendations = generateRecommendations(data);

    recommendations.forEach((recommendation) => {
      const card = document.createElement("article");
      card.className = "weather-tip";

      const icon = document.createElement("span");
      icon.className = "weather-tip-icon";
      icon.textContent = recommendation.icon;
      icon.setAttribute("aria-hidden", "true");

      const content = document.createElement("div");

      const title = document.createElement("h4");
      title.textContent = recommendation.title;

      const description = document.createElement("p");
      description.textContent = recommendation.description;

      content.append(title, description);
      card.append(icon, content);

      container.appendChild(card);
    });
  }

  /* -------------------------------------
     PRONÓSTICO EXTENDIDO
  ------------------------------------- */

  function renderForecast(data) {
    const container = document.querySelector("#weather-forecast");

    if (!container) return;

    container.replaceChildren();

    const daily = data.daily;

    daily.time.forEach((date, index) => {
      const card = document.createElement("article");
      card.className = "weather-day-card";

      const name = document.createElement("span");
      name.className = "weather-day-name";

      name.textContent = index === 0
        ? t("today")
        : formatDate(date, { short: true });

      const icon = document.createElement("span");
      icon.className = "weather-day-icon";
      renderWeatherIcon(icon,daily.weather_icon[index]);

      icon.setAttribute("aria-hidden", "true");

      const description = document.createElement("span");
      description.className = "weather-day-description";
      description.textContent = getWeatherDescription(
        daily.weather_code[index]
      );

      const temperatures = document.createElement("div");
      temperatures.className = "weather-day-temperatures";

      const maximum = document.createElement("strong");
      maximum.textContent = formatTemperature(
        daily.temperature_2m_max[index]
      );

      const minimum = document.createElement("span");
      minimum.textContent = formatTemperature(
        daily.temperature_2m_min[index]
      );

      temperatures.append(maximum, minimum);

      const rain = document.createElement("span");
      rain.className = "weather-day-rain";

      const rainValue = daily.precipitation_probability_max[index];

      rain.textContent = rainValue !== null
        ? `💧 ${Math.round(rainValue)}%`
        : "💧 --";

      card.append(
        name,
        icon,
        description,
        temperatures,
        rain
      );

      container.appendChild(card);
    });
  }

  /* -------------------------------------
     MOSTRAR CONDICIONES ACTUALES
  ------------------------------------- */

  function renderCurrentWeather(data, locationId) {
    const current = data.current;
    const daily = data.daily;
    const location = locations[locationId];

    const locationName = document.querySelector(
      "#weather-location-name"
    );

    const currentDate = document.querySelector(
      "#weather-current-date"
    );

    const temperature = document.querySelector(
      "#weather-current-temperature"
    );

    const description = document.querySelector(
      "#weather-current-description"
    );

    const icon = document.querySelector(
      "#weather-current-icon"
    );

    const minimum = document.querySelector("#weather-current-min");
    const maximum = document.querySelector("#weather-current-max");

    const feelsLike = document.querySelector("#weather-feels-like");

    if (locationName) locationName.textContent = location.name;

    if (currentDate) {
      currentDate.textContent = formatDate(
        daily.time[0]
      );
    }

    if (temperature) {
      temperature.textContent = formatTemperature(
        current.temperature_2m
      );
    }

    if (description) {
      description.textContent = getWeatherDescription(
        current.weather_code
      );
    }

    if (icon) {
      renderWeatherIcon(icon,current.weather_icon);
    }

    if (minimum) {
      minimum.textContent = formatTemperature(
        daily.temperature_2m_min[0]
      );
    }

    if (maximum) {
      maximum.textContent = formatTemperature(
        daily.temperature_2m_max[0]
      );
    }

    if (feelsLike) {
      feelsLike.textContent = formatTemperature(
        current.apparent_temperature
      );
    }

    setText("#weather-rain", `${Math.round(
      daily.precipitation_probability_max[0] ?? 0
    )}%`);

    setText("#weather-uv", formatUV(
      daily.uv_index_max[0]
    ));

    setText("#weather-wind", `${Math.round(
      current.wind_speed_10m
    )} km/h`);

    setText("#weather-humidity", `${Math.round(
      current.relative_humidity_2m
    )}%`);

    setText(
      "#weather-updated",
      `${t("updated")}: ${new Intl.DateTimeFormat(
        getLanguage(),
        {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Santiago"
        }
      ).format(new Date(current.time))}`
    );
  }

  function formatUV(value) {
    if (value === null || value === undefined) {
      return "--";
    }

    const rounded = Math.round(value);

    let level = t("uvLow");

    if (value >= 3 && value < 6) {
      level = t("uvModerate");
    } else if (value >= 6 && value < 8) {
      level = t("uvHigh");
    } else if (value >= 8 && value < 11) {
      level = t("uvVeryHigh");
    } else if (value >= 11) {
      level = t("uvExtreme");
    }

    return `${rounded} · ${level}`;
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);

    if (element) {
      element.textContent = value;
    }
  }

  /* -------------------------------------
     RESUMEN EN PÁGINA PRINCIPAL
  ------------------------------------- */

  function renderHomeWeather(data) {
    const current = data.current;
    const daily = data.daily;

    setText(
      "#home-weather-temperature",
      formatTemperature(current.temperature_2m)
    );

    setText(
      "#home-weather-description",
      getWeatherDescription(current.weather_code)
    );

    setText(
      "#home-weather-min",
      formatTemperature(daily.temperature_2m_min[0])
    );

    setText(
      "#home-weather-max",
      formatTemperature(daily.temperature_2m_max[0])
    );

    renderWeatherIcon(
      document.querySelector("#home-weather-icon"),
      current.weather_icon);

    const recommendations = generateRecommendations(data);

    setText(
      "#home-weather-tip-title",
      recommendations[0].title
    );

    setText(
      "#home-weather-tip-description",
      recommendations[0].description
    );

    setText(
      "#home-weather-updated",
      `${t("updated")}: ${new Intl.DateTimeFormat(
        getLanguage(),
        {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Santiago"
        }
      ).format(new Date(current.time))}`
    );
  }

  /* -------------------------------------
     ESTADOS DE INTERFAZ
  ------------------------------------- */

  function showLoading() {
    if (weatherStatus) {
      weatherStatus.hidden = false;
      weatherStatus.textContent = t("loading");
    }

    if (weatherContent) {
      weatherContent.hidden = true;
    }

    if (weatherError) {
      weatherError.hidden = true;
    }
  }

  function showError() {
    if (weatherStatus) {
      weatherStatus.hidden = true;
    }

    if (weatherContent) {
      weatherContent.hidden = true;
    }

    if (weatherError) {
      weatherError.hidden = false;
    }
  }

  function showWeather() {
    if (weatherStatus) {
      weatherStatus.hidden = true;
    }

    if (weatherError) {
      weatherError.hidden = true;
    }

    if (weatherContent) {
      weatherContent.hidden = false;
    }
  }

  /* -------------------------------------
     CARGAR LOCALIDAD
  ------------------------------------- */

  async function loadLocation(locationId) {
    selectedLocation = locationId;

    if (isWeatherPage) {
      showLoading();
    }

    try {
      const data = await fetchWeather(locationId);

      if (isHomePage) {
        renderHomeWeather(data);
      }

      if (isWeatherPage) {
        renderCurrentWeather(data, locationId);
        renderForecast(data);

        renderRecommendations(
          data,
          document.querySelector("#weather-tips")
        );

        showWeather();
      }

    } catch (error) {
      console.error("No fue posible cargar el clima:", error);

      if (isWeatherPage) {
        showError();
      }

      if (isHomePage) {
        const description = document.querySelector(
          "#home-weather-description"
        );

        if (description) {
          description.textContent = t("error");
        }
      }
    }
  }

  /* -------------------------------------
     SELECTOR DE LOCALIDAD
  ------------------------------------- */

  function initializeLocationSelector() {
    document.querySelectorAll("[data-weather-location]").forEach((button) => {

      button.addEventListener("click", () => {
        const locationId = button.dataset.weatherLocation;

        if (!locations[locationId]) return;

        document.querySelectorAll("[data-weather-location]").forEach((item) => {
          const isActive = item === button;

          item.classList.toggle("is-active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });

        loadLocation(locationId);
      });

    });
  }

  /* -------------------------------------
     TRADUCCIÓN DE TEXTOS
  ------------------------------------- */

  function updateStaticTranslations() {
    document.querySelectorAll("[data-clima]").forEach((element) => {
      const key = element.dataset.clima;

      if (translations[getLanguage()]?.[key]) {
        element.textContent = t(key);
      }
    });

    if (isWeatherPage) {
      const selectedButton = document.querySelector(
        `[data-weather-location="${selectedLocation}"]`
      );

      if (selectedButton) {
        loadLocation(selectedLocation);
      }
    } else {
      loadLocation("casablanca");
    }
  }

  /* -------------------------------------
     INICIALIZACIÓN
  ------------------------------------- */

  initializeLocationSelector();

  const retryButton = document.querySelector("#weather-retry");

  if (retryButton) {
    retryButton.addEventListener("click", () => {
      loadLocation(selectedLocation);
    });
  }

  document.addEventListener(
    "casablanca:languagechange",
    updateStaticTranslations
  );

  updateStaticTranslations();

});
