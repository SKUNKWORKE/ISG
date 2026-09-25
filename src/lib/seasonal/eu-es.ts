import { EN, ES } from "./labels";
import type { Occasion } from "./types";

/**
 * Spain, in Spanish and in English.
 *
 * Spain is the market where getting the gift moment wrong costs the most: the
 * principal exchange is 6 January, nearly a fortnight after the date most
 * overseas buyers assume.
 */

const es = {
  region: "eu-es",
  lang: "es",
  formatLocale: "es-ES",
  variant: "native",
  labels: ES,
} as const;

const en = {
  region: "eu-es",
  lang: "en",
  formatLocale: "en-GB",
  variant: "en",
  labels: EN,
} as const;

export const EU_ES_OCCASIONS: Occasion[] = [
  {
    ...es,
    slug: "san-valentin",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 de febrero, fecha fija" },
    title: "Diamantes para San Valentín: talla corazón y redonda, de D a F",
    description:
      "Diamantes sueltos en talla corazón y redonda, color de D a F, para San Valentín. Piedras naturales y de laboratorio, certificadas por laboratorio independiente y cotizadas una a una.",
    eyebrow: "España · San Valentín",
    heading: "Una piedra elegida para el catorce",
    standfirst:
      "San Valentín es en España una fecha de pareja y de medida: se regala una pieza bien elegida, no muchas. Dos tallas sostienen el día — el corazón, que lo dice sin rodeos, y la redonda, que lo dice más bajo.",
    sections: [
      {
        heading: "Por qué corazón y redonda",
        body: [
          "El corazón es la única talla del repertorio clásico que se lee antes como símbolo que como diamante, y eso es lo que la ata a esta fecha y casi a ninguna otra. Es también la talla donde el mal trabajo se nota más: los dos lóbulos tienen que coincidir, la hendidura estar limpia y el contorno ser simétrico respecto al eje. Un corazón mal tallado se ve a tres metros, sin lupa y sin formación alguna.",
          "La redonda dice lo mismo en voz más baja. Es la única talla con un estándar publicado para sus proporciones, así que es la más sencilla de juzgar sobre el certificado, y la más fácil de volver a montar si algún día se rehace la pieza.",
        ],
      },
      {
        heading: "Por qué el color de D a F",
        body: [
          "D, E y F forman el grupo de las piedras incoloras. Por separado, con la piedra ya montada, son prácticamente indistinguibles incluso para un profesional. Juntas, en cambio, se separan con claridad del grupo siguiente en cuanto se ponen dos piedras una al lado de la otra.",
          "El mercado español monta mucho en oro blanco y en platino, y ahí es donde lo incoloro se paga solo: un metal blanco no le deja a la piedra ningún sitio donde esconder un matiz cálido. Sobre una montura de oro amarillo o rosa el argumento se debilita bastante, y un color G pasa a ser una elección perfectamente defendible.",
        ],
      },
      {
        heading: "Pedir a tiempo",
        body: [
          "Las piedras se compran de una en una y no por lotes, así que cualquiera puede reservarse sobre una fecha mientras se decide la montura. Mándanos la referencia y te contestamos con el certificado, las imágenes y el precio.",
        ],
      },
    ],
    brief: { shapes: "Corazón y redonda", colour: "de D a F, incoloro" },
    primary: { shapes: ["heart", "round"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "san-valentin-en",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 February, fixed" },
    title: "San Valentín diamonds for the Spanish market: heart and round, D to F",
    description:
      "Heart and round loose diamonds in D-F for San Valentín in Spain, with local conventions explained in English. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "Spain · San Valentín, in English",
    heading: "A couples' date, and a smaller one than you expect",
    standfirst:
      "San Valentín is observed across Spain, but it sits lower in the Spanish gifting calendar than in most markets, because the heavyweight dates here are in January and May. It is a couples' occasion, narrowly defined, and a comparatively modest one.",
    sections: [
      {
        heading: "Where it sits in the Spanish year",
        body: [
          "The single largest gift moment in Spain is not in February or even in December: it is 6 January, the Día de Reyes. San Valentín follows a month later as a much smaller, purely romantic occasion, and it is not the peak the way it can be in the United States.",
          "The definition is also narrow. There is no Spanish convention of giving to friends or colleagues on the date, so it stays between couples. In Catalonia the romantic gifting occasion is Sant Jordi on 23 April, which is a genuinely separate date with its own conventions of a book and a rose.",
        ],
      },
      {
        heading: "Why heart and round",
        body: [
          "The heart states the occasion plainly and is the only cut that reads as a symbol before it reads as a stone. Judge it on symmetry above everything: matched lobes, a clean cleft, an outline even about its centre line. Poor cutting is visible at conversational distance.",
          "The round is the quieter and more adaptable answer. It is the only shape with a published cut standard, so it can be judged properly from figures alone, and it resets easily into something else later.",
        ],
      },
      {
        heading: "Why D to F",
        body: [
          "D, E and F are the colourless grades. Individually they are hard to separate once the stone is set; as a band they read clearly whiter than near-colourless when two stones are compared directly.",
          "Spanish setting runs heavily to white gold and platinum, which is where the colourless premium is genuinely earned, since white metal leaves a stone nowhere to conceal warmth. Where the piece is going into yellow gold, a G is often the better-judged buy and the difference goes into weight instead.",
        ],
      },
    ],
    brief: { shapes: "Heart and round", colour: "D-F, colourless" },
    primary: { shapes: ["heart", "round"], colors: ["D", "E", "F"] },
  },
  {
    ...es,
    slug: "dia-de-reyes",
    date: { kind: "fixed", month: 1, day: 6, rule: "6 de enero, fecha fija" },
    title: "Diamantes para el Día de Reyes: redonda y princesa, de D a G",
    description:
      "Diamantes sueltos en talla redonda y princesa, color de D a G, para el Día de Reyes, el 6 de enero. Piedras naturales y de laboratorio, certificadas y cotizadas una a una.",
    eyebrow: "España · Día de Reyes",
    heading: "El regalo llega el seis de enero",
    standfirst:
      "En España el gran día de regalos no es el 25 de diciembre sino el 6 de enero. Los Reyes Magos llegan la noche del cinco y los paquetes se abren la mañana siguiente. Para quien encarga desde fuera, esa diferencia son casi dos semanas.",
    sections: [
      {
        heading: "Una fecha que desplaza todo el calendario",
        body: [
          "La Navidad se celebra, y la Nochebuena reúne a la familia, pero el momento del regalo propiamente dicho pertenece a los Reyes. La cabalgata recorre las ciudades la tarde del cinco, los zapatos se dejan puestos esa noche y todo se abre el día seis por la mañana.",
          "Esto cambia por completo la logística de un encargo. Mientras media Europa cierra plazos el 24 de diciembre, en España queda casi otra semana y media de margen — y también significa que un paquete calculado para el 25 llega doce días antes de que haga falta.",
        ],
      },
      {
        heading: "Por qué redonda y princesa",
        body: [
          "La redonda es la talla más estudiada del oficio y la más previsible con luz de interior. Es además la única con un estándar publicado de proporciones, de modo que puede comprarse bien trabajando sobre los números del certificado.",
          "La princesa es el brillante cuadrado y está aquí por una razón de valor. Sigue la forma del bruto octaédrico mucho más de cerca que una redonda, la pérdida en el tallado es bastante menor y ese ahorro se ve directamente en el precio por quilate. A igual presupuesto, la princesa suele ser la piedra más grande.",
        ],
      },
      {
        heading: "Qué comprobar en una princesa",
        body: [
          "Las esquinas son el punto débil: son la parte más fina de la piedra y la más expuesta a los golpes, así que una montura de anillo debe cubrir cada uno de los cuatro vértices con una garra. El segundo dato que conviene leer es la profundidad: por encima del 75 por ciento aproximadamente el peso queda bajo el filetín, donde cuesta dinero sin añadir nada al tamaño visible.",
        ],
      },
    ],
    brief: { shapes: "Redonda y princesa", colour: "de D a G" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...en,
    slug: "dia-de-reyes-en",
    date: { kind: "fixed", month: 1, day: 6, rule: "6 January, fixed" },
    title: "Día de Reyes diamonds: round and princess, D to G",
    description:
      "Round and princess loose diamonds in D-G for Three Kings Day on 6 January, Spain's principal gift-giving occasion. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "Spain · Día de Reyes, in English",
    heading: "Spain's real Christmas is in January",
    standfirst:
      "If you take one thing from this page: the main gift exchange in Spain is not 25 December. It is 6 January, the Día de Reyes, and for most Spanish households it is a larger occasion than Christmas Day itself.",
    sections: [
      {
        heading: "The Three Kings, not Father Christmas",
        body: [
          "The tradition holds that the Reyes Magos, the three kings who brought gifts to Bethlehem, deliver presents on the eve of Epiphany. Children leave out shoes on the night of 5 January and everything is opened on the morning of the 6th. Most cities hold a cabalgata, a procession, on the afternoon of the 5th.",
          "Christmas is still kept, and Nochebuena on 24 December is a major family dinner, but the presents are not the point of it. Papá Noel has made inroads in recent decades, particularly with younger families, and some households now do both. The Reyes remain the main event.",
        ],
      },
      {
        heading: "What this means for an order",
        body: [
          "It works in your favour rather than against you. Where France and Germany close on the evening of 24 December and the English-speaking markets on the morning of the 25th, Spain gives you almost another twelve days.",
          "That is enough additional time to matter: a stone can be reserved over Christmas and a setting completed in the first days of January without compressing anything. The risk runs the other way instead, which is arriving too early and having the parcel sit for a fortnight.",
        ],
      },
      {
        heading: "Why round and princess",
        body: [
          "The round is the most predictable shape under ordinary indoor light and the only cut with a published proportion standard to buy from. The princess is the square brilliant and it is here on value, because it follows the octahedral rough far more closely than a round, losing much less weight in the cutting and passing the saving into the price per carat.",
          "On any princess, check the corners and the depth. The corners are the thinnest part of the stone and want a prong over each of the four in a ring. A depth past the mid-seventies in percent means weight below the girdle, adding cost but no visible size.",
        ],
      },
    ],
    brief: { shapes: "Round and princess", colour: "D-G" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...es,
    slug: "dia-de-la-madre",
    date: { kind: "computed", id: "es-dia-de-la-madre", rule: "Primer domingo de mayo" },
    title: "Diamantes para el Día de la Madre: redonda y ovalada, de D a G",
    description:
      "Diamantes sueltos en talla redonda y ovalada, color de D a G, para el Día de la Madre español, el primer domingo de mayo. Piedras naturales y de laboratorio.",
    eyebrow: "España · Día de la Madre",
    heading: "El primer domingo de mayo, no el segundo",
    standfirst:
      "España celebra el Día de la Madre el primer domingo de mayo, una semana antes que Alemania, Italia o Estados Unidos. Es una diferencia pequeña en el calendario y grande en la práctica: quien se guíe por la fecha internacional llega tarde.",
    sections: [
      {
        heading: "Una semana de diferencia",
        body: [
          "Buena parte de Europa celebra el segundo domingo de mayo. España se quedó con el primero, y Francia con el último del mes. Son tres reglas distintas en tres mercados vecinos, y es el error más fácil de cometer al encargar desde fuera.",
          "La fecha que aparece en esta página se calcula a partir de la regla española, no se copia de una lista, de modo que sigue siendo correcta año tras año sin que nadie tenga que actualizarla.",
        ],
      },
      {
        heading: "Por qué redonda y ovalada",
        body: [
          "La redonda es la elección lógica para pendientes de botón y colgantes solitario, por un motivo práctico: es la única talla cuyo certificado incluye una calificación global del tallado. Un par puede emparejarse sobre el papel antes que a ojo, y en unos pendientes eso pesa: dos piedras con tallado ligeramente distinto se notan mucho antes que dos pesos distintos.",
          "La ovalada resuelve otra cosa. A igual peso reparte la materia en un contorno más largo: cubre más dedo y parece mayor que una redonda del mismo quilate. Cuando el presupuesto está fijado y lo que importa es la presencia, es la talla que más rinde.",
        ],
      },
      {
        heading: "Qué mirar en una ovalada",
        body: [
          "Toda ovalada tiene su pajarita, esa banda oscura que cruza el centro y nace de cómo se encuentran las facetas. La pregunta nunca es si está, sino si apenas se intuye o salta a la vista — y ningún certificado lo recoge. Pide las imágenes de cualquier ovalada de la lista y se ve al momento.",
        ],
      },
    ],
    brief: { shapes: "Redonda y ovalada", colour: "de D a G" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...en,
    slug: "dia-de-la-madre-en",
    date: { kind: "computed", id: "es-dia-de-la-madre", rule: "First Sunday in May" },
    title: "Día de la Madre diamonds: round and oval, D to G",
    description:
      "Round and oval loose diamonds in D-G for the Spanish Día de la Madre, the first Sunday in May rather than the second. Filtered and ready to enquire on.",
    eyebrow: "Spain · Día de la Madre, in English",
    heading: "Spain is a week ahead of the rest",
    standfirst:
      "Spain marks Mother's Day on the first Sunday in May. Germany, Italy, Austria and the United States all use the second, and France uses the last. Working from the international date means arriving a week late in Spain.",
    sections: [
      {
        heading: "Three neighbours, three rules",
        body: [
          "Among the larger European markets, the Mother's Day rule is not shared. Spain takes the first Sunday in May, most of the continent takes the second, and France takes the last Sunday of the month, stepping into June in years when that would collide with Pentecost.",
          "For anyone shipping into more than one of these markets it is worth diarising each separately rather than assuming a single May date. The date on this page is derived from the Spanish rule itself, so it stays correct year after year.",
        ],
      },
      {
        heading: "How the occasion is kept",
        body: [
          "Día de la Madre is strongly observed in Spain and centred on the family gathering rather than on display. The gift that suits it is something worn every day, not something kept for occasions, which points at studs, a solitaire pendant or a ring for the right hand.",
        ],
      },
      {
        heading: "Why round and oval",
        body: [
          "The round is the practical choice wherever two stones must match, because it is the only shape with an overall cut grade on its report. A pair of studs can be matched on paper before being matched by eye, and a small difference in cut reads as a mismatch long before a difference in weight does.",
          "The oval spreads the same weight along a longer outline, so it covers more of the finger and reads larger than a round of equal carat. Every oval carries a bow-tie, the dark band across the centre where the facets meet, and no report records it, so ask for images before deciding.",
        ],
      },
    ],
    brief: { shapes: "Round and oval", colour: "D-G" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F", "G"] },
  },
];
