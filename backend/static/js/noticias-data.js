
/* =========================================
   DATOS DE NOTICIAS
   Casablanca Chile
========================================= */

window.CasablancaNewsConfig = {
  // Cuando Django esté disponible, colocar aquí su endpoint.
  // Ejemplo: "/api/noticias/"
  apiUrl: null
};

window.CasablancaNewsDemo = [
  {
    id: "patrimonio-casablanca",
    categoria: "cultura",
    imagen: "/static/images/plaza.jpg",
    publicada: true,
    demostracion: true,

    titulo: {
      es: "Descubre el patrimonio de Casablanca",
      en: "Discover Casablanca's heritage",
      pt: "Descubra o patrimônio de Casablanca"
    },

    resumen: {
      es: "Un recorrido por los espacios, relatos y elementos que forman parte de la identidad local.",
      en: "Explore the places, stories and elements that shape the local identity.",
      pt: "Um percurso pelos lugares, histórias e elementos que fazem parte da identidade local."
    },

    contenido: {
      es: [
        "Casablanca conserva una identidad construida a través de su historia, sus habitantes y sus tradiciones.",
        "Su centro urbano y sus espacios patrimoniales permiten acercarse a distintas etapas de la vida comunal. Esta publicación es un ejemplo de cómo se podrán presentar futuras noticias y contenidos municipales."
      ],
      en: [
        "Casablanca preserves an identity shaped by its history, its residents and its traditions.",
        "Its urban centre and heritage sites offer a glimpse into different periods of local life. This publication is an example of how future municipal news and content could be presented."
      ],
      pt: [
        "Casablanca preserva uma identidade construída por sua história, seus habitantes e suas tradições.",
        "Seu centro urbano e seus espaços patrimoniais permitem conhecer diferentes períodos da vida local. Esta publicação é um exemplo de como futuras notícias e conteúdos municipais poderão ser apresentados."
      ]
    }
  },

  {
    id: "quintay-costa",
    categoria: "turismo",
    imagen: "/static/images/quintay.jpg",
    publicada: true,
    demostracion: true,

    titulo: {
      es: "Quintay: una experiencia entre paisaje y memoria",
      en: "Quintay: an experience of landscape and memory",
      pt: "Quintay: uma experiência entre paisagem e memória"
    },

    resumen: {
      es: "Conoce la costa de Casablanca y descubre sus paisajes, playas y patrimonio marítimo.",
      en: "Discover the coast of Casablanca, its landscapes, beaches and maritime heritage.",
      pt: "Conheça a costa de Casablanca e descubra suas paisagens, praias e patrimônio marítimo."
    },

    contenido: {
      es: [
        "Quintay representa una faceta costera de la comuna de Casablanca, con paisajes vinculados al océano y una memoria relacionada con las actividades marítimas.",
        "Sus playas y espacios patrimoniales invitan a conocer el territorio desde otra perspectiva. Esta ficha es contenido demostrativo y no corresponde a un anuncio de actividad o evento."
      ],
      en: [
        "Quintay represents the coastal side of the commune of Casablanca, with ocean landscapes and a history connected to maritime activities.",
        "Its beaches and heritage sites offer another way to discover the area. This is demonstration content, not an announcement of an activity or event."
      ],
      pt: [
        "Quintay representa a faceta costeira da comuna de Casablanca, com paisagens ligadas ao oceano e uma memória relacionada às atividades marítimas.",
        "Suas praias e espaços patrimoniais convidam a conhecer o território de outra perspectiva. Este conteúdo é demonstrativo e não corresponde a um anúncio de atividade ou evento."
      ]
    }
  },

  {
    id: "valle-casablanca",
    categoria: "enoturismo",
    imagen: "/static/images/valle.jpg",
    publicada: true,
    demostracion: true,

    titulo: {
      es: "Explora el valle y sus viñas",
      en: "Explore the valley and its wineries",
      pt: "Explore o vale e suas vinícolas"
    },

    resumen: {
      es: "El paisaje vitivinícola es parte de la identidad de Casablanca, pero el valle tiene mucho más por descubrir.",
      en: "The wine-growing landscape is part of Casablanca's identity, but there is much more to discover in the valley.",
      pt: "A paisagem vitivinícola faz parte da identidade de Casablanca, mas o vale tem muito mais a oferecer."
    },

    contenido: {
      es: [
        "El valle de Casablanca es reconocido por su tradición vitivinícola y por las condiciones naturales que favorecen el desarrollo de distintas variedades de uva.",
        "Además de sus viñas, el territorio ofrece paisajes rurales, gastronomía y experiencias vinculadas a la identidad local. Esta publicación es un ejemplo de contenido editorial que podrá reemplazarse por novedades oficiales."
      ],
      en: [
        "The Casablanca Valley is known for its winemaking tradition and the natural conditions that favour the growth of different grape varieties.",
        "Beyond its wineries, the area offers rural landscapes, gastronomy and experiences connected to local identity. This publication is an example of editorial content that can later be replaced with official updates."
      ],
      pt: [
        "O Vale de Casablanca é conhecido por sua tradição vitivinícola e pelas condições naturais que favorecem o cultivo de diferentes variedades de uva.",
        "Além das vinícolas, o território oferece paisagens rurais, gastronomia e experiências ligadas à identidade local. Esta publicação é um exemplo de conteúdo editorial que poderá ser substituído por novidades oficiais."
      ]
    }
  }
];
