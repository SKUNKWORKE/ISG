import { EN, FR } from "./labels";
import type { Occasion } from "./types";

/**
 * France, in French and in English.
 *
 * The English pages are not translations. They are written for a reader who
 * does not already know why the 24th matters more than the 25th in France, or
 * why the Fête des Mères sometimes jumps into June — which is precisely the
 * context a French reader never needs spelled out.
 */

const fr = {
  region: "eu-fr",
  lang: "fr",
  formatLocale: "fr-FR",
  variant: "native",
  labels: FR,
} as const;

const en = {
  region: "eu-fr",
  lang: "en",
  formatLocale: "en-GB",
  variant: "en",
  labels: EN,
} as const;

export const EU_FR_OCCASIONS: Occasion[] = [
  {
    ...fr,
    slug: "saint-valentin",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 février, date fixe" },
    title: "Diamants pour la Saint-Valentin : taille cœur et rond, D à F",
    description:
      "Diamants nus taille cœur et ronds, couleur D à F, sélectionnés pour la Saint-Valentin. Pierres naturelles et de laboratoire, certifiées par un laboratoire indépendant, cotées à l'unité.",
    eyebrow: "France · Saint-Valentin",
    heading: "Une pierre choisie pour le 14 février",
    standfirst:
      "La Saint-Valentin reste, en France, une fête discrète : on offre une pièce, bien choisie, plutôt que plusieurs. Deux tailles conviennent à cette date. Le cœur, qui dit les choses sans détour, et le rond, qui les dit plus bas.",
    sections: [
      {
        heading: "Pourquoi le cœur et le rond",
        body: [
          "Le cœur est la seule taille du répertoire classique qui se lit d'abord comme un symbole et ensuite comme un diamant. C'est ce qui l'attache à cette date, et à presque aucune autre. C'est aussi la taille la plus impitoyable : les deux lobes doivent être identiques, l'échancrure nette, la silhouette parfaitement symétrique de part et d'autre de l'axe. Un cœur mal taillé se voit à trois mètres, sans loupe et sans aucune formation.",
          "Le rond répond à la même intention sur un autre ton. C'est la seule taille dotée d'une norme publiée pour ses proportions, donc la plus simple à juger sur un certificat, et la plus facile à remonter si la pièce est un jour transformée.",
        ],
      },
      {
        heading: "Pourquoi la couleur D à F",
        body: [
          "D, E et F forment le groupe des pierres dites incolores. Prises séparément, une fois la pierre montée, elles sont pratiquement impossibles à distinguer, y compris pour un professionnel. Mais réunies, elles se détachent nettement du groupe « blanc extra » dès que deux pierres sont posées côte à côte.",
          "Le marché français monte massivement en or gris et en platine, et c'est précisément là que l'incolore se justifie : un métal blanc ne laisse à la pierre aucun endroit où dissimuler une nuance chaude. Sur une monture en or jaune ou rose, l'argument s'affaiblit considérablement, et une couleur G devient un choix parfaitement défendable.",
        ],
      },
      {
        heading: "Commander à temps",
        body: [
          "Les pierres sont achetées à l'unité et non par lots : chacune peut donc être réservée sur une date pendant que la monture se décide. Indiquez-nous la référence et nous revenons vers vous avec le certificat, les images et le prix.",
        ],
      },
    ],
    brief: { shapes: "Cœur et rond", colour: "D à F, incolore" },
    primary: { shapes: ["heart", "round"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "saint-valentin-en",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 February, fixed" },
    title: "Saint-Valentin diamonds for the French market: heart and round, D to F",
    description:
      "Heart and round loose diamonds in D-F for Saint-Valentin in France, with the local buying conventions explained in English. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "France · Saint-Valentin, in English",
    heading: "Buying for the French fourteenth",
    standfirst:
      "Saint-Valentin is observed in France on the same date as everywhere else, but not in the same spirit. It is markedly more restrained than its American counterpart, and the expectation runs towards one well-judged piece rather than a volume of gifts.",
    sections: [
      {
        heading: "What is different about the French occasion",
        body: [
          "The most useful thing to understand about Saint-Valentin in France is how narrow it is. It is understood as a couples' occasion and very little else: there is no established convention of giving to friends, classmates or colleagues, and doing so reads as a misunderstanding rather than as generosity. Compared with the United States, where the date spreads across family and school, the French version stays firmly between two people.",
          "It is also, by international standards, a restrained occasion. The convention favours one considered object over a quantity of them, which pushes buyers towards a smaller, better stone rather than a larger, more ordinary one. That instinct matters more than the date when you are choosing what to send.",
        ],
      },
      {
        heading: "Why heart and round for this market",
        body: [
          "The heart carries the occasion openly, and it is the only cut that reads as a symbol before it reads as a stone. It repays close attention to symmetry: matched lobes, a clean cleft and a silhouette that is even about its axis. A poorly cut heart is obvious from across a room.",
          "The round is the more common French answer, and it fits the restraint described above. It is the only shape with a published cut standard, which makes it the easiest to judge from a report, and the simplest to reset later if the piece is remade.",
        ],
      },
      {
        heading: "Why D to F, and the metal it goes into",
        body: [
          "France buys white metal at a much higher rate than warm metal, particularly in or gris, or white gold. That is the setting in which a stone has nowhere to conceal any warmth in its body colour, and it is the setting that makes the colourless D-F band worth paying for.",
          "If the piece is destined for yellow or rose gold instead, the case genuinely weakens, and a G or H stone in a warm mount is often the better-judged purchase. The filter here assumes white metal, because that is what this market overwhelmingly buys.",
        ],
      },
    ],
    brief: { shapes: "Heart and round", colour: "D-F, colourless" },
    primary: { shapes: ["heart", "round"], colors: ["D", "E", "F"] },
  },
  {
    ...fr,
    slug: "reveillon-noel",
    date: { kind: "fixed", month: 12, day: 24, rule: "24 décembre au soir" },
    title: "Diamants pour le réveillon de Noël : rond et princesse, D à G",
    description:
      "Diamants nus ronds et taille princesse, couleur D à G, pour le réveillon du 24 décembre. Pierres naturelles et de laboratoire, certifiées, cotées à l'unité.",
    eyebrow: "France · Réveillon de Noël",
    heading: "Le cadeau s'ouvre le 24 au soir",
    standfirst:
      "En France, le moment du cadeau n'est pas le matin du 25 mais la soirée du 24. C'est une différence d'une journée, et elle déplace toute la logistique : la date limite réelle d'une commande tombe la veille de celle que l'on suppose souvent.",
    sections: [
      {
        heading: "Une soirée, pas une matinée",
        body: [
          "Le réveillon est le moment central des fêtes françaises. On dîne tard, on ouvre les cadeaux dans la soirée ou au retour de la messe de minuit, et le 25 sert surtout de prolongement. Pour qui commande depuis l'étranger, c'est le détail à retenir : la pierre doit être arrivée et montée pour le 24, pas pour le 25.",
          "La lumière de cette soirée compte également. On ouvre les cadeaux en intérieur, sous une lumière chaude et basse — celle d'un salon en décembre, pas celle d'une vitrine. C'est un éclairage indulgent, qui masque volontiers une nuance chaude, mais qui ne pardonne rien à une pierre mal proportionnée : ce qui se voit alors, c'est la taille, pas la couleur.",
        ],
      },
      {
        heading: "Pourquoi le rond et la princesse",
        body: [
          "Le rond est la taille la plus étudiée du métier et la plus prévisible sous cette lumière-là. C'est aussi la seule à disposer d'une norme publiée pour ses proportions, ce qui permet de l'acheter correctement sur certificat.",
          "La princesse est le brillant carré, et elle figure ici pour une raison de valeur. Elle suit de beaucoup plus près la forme du brut octaédrique que le rond : la perte au taillage est bien moindre, et cette économie se retrouve directement dans le prix au carat. À budget égal, la princesse est en général la pierre la plus grande.",
        ],
      },
      {
        heading: "Ce qu'il faut vérifier sur une princesse",
        body: [
          "Les angles sont le point faible de la princesse : ce sont les zones les plus minces de la pierre et les plus exposées aux chocs. Une monture de bague doit donc couvrir chacun des quatre coins par une griffe. Le second chiffre à lire est la profondeur : au-delà d'environ 75 %, le poids est porté sous le rondiste, là où il coûte sans rien ajouter à la taille apparente.",
        ],
      },
    ],
    brief: { shapes: "Rond et princesse", colour: "D à G" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...en,
    slug: "reveillon-noel-en",
    date: { kind: "fixed", month: 12, day: 24, rule: "The evening of 24 December" },
    title: "Réveillon de Noël diamonds: round and princess, D to G",
    description:
      "Round and princess loose diamonds in D-G for the French Réveillon on 24 December, when gifts are actually opened. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "France · Réveillon de Noël, in English",
    heading: "The French deadline is the twenty-fourth",
    standfirst:
      "If you are buying into France for Christmas, the single most useful fact is that the gift moment is the evening of 24 December, not the morning of the 25th. The real deadline sits a full day earlier than most people ordering from outside France assume.",
    sections: [
      {
        heading: "What Réveillon actually is",
        body: [
          "Réveillon is the late dinner on Christmas Eve, and it is the centre of the French Christmas rather than a prelude to it. The meal runs long, presents are opened during the evening or after midnight mass, and 25 December functions as an extension of the night before rather than as the main event.",
          "The word itself comes from réveil, waking, for the obvious reason that the occasion involves staying up through it. France is not unusual in Europe in this: Germany, Austria, Poland, the Czech Republic and much of Scandinavia work the same way. It is the English-speaking convention of opening presents on Christmas morning that is the outlier here, not the French one.",
        ],
      },
      {
        heading: "Why this changes an order",
        body: [
          "A day sounds trivial, and for a stone it is. For a finished ring it is not: the setting is the slow part of any order, and losing a day at the end of December means losing it at the busiest possible point in a workshop's year.",
          "The practical approach is the same as anywhere, applied one day earlier. Reserve the loose stone first, let the setting follow, and work backwards from the evening of the 24th rather than from the morning of the 25th.",
        ],
      },
      {
        heading: "Why round and princess, and what to check",
        body: [
          "The round is the most predictable shape in the warm, low indoor light a Réveillon evening actually provides, and the only cut with a published proportion standard to buy on. The princess is the square brilliant, and it is here on value: it follows the octahedral rough much more closely than a round, so far less weight is lost in cutting and the saving appears in the price per carat.",
          "On any princess, check two things. The corners are the thinnest and most chip-prone part of the stone, so a ring setting needs a prong over each of the four. And read the depth percentage: beyond the mid-seventies, weight is being carried below the girdle where it costs money without adding visible size.",
        ],
      },
    ],
    brief: { shapes: "Round and princess", colour: "D-G" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...fr,
    slug: "fete-des-meres",
    date: {
      kind: "computed",
      id: "fr-fete-des-meres",
      rule: "Dernier dimanche de mai, reporté au premier dimanche de juin s'il coïncide avec la Pentecôte",
    },
    title: "Diamants pour la Fête des Mères : rond et ovale, D à G",
    description:
      "Diamants nus ronds et ovales, couleur D à G, pour la Fête des Mères française — dernier dimanche de mai, ou premier dimanche de juin les années de Pentecôte.",
    eyebrow: "France · Fête des Mères",
    heading: "Une date française, et qui se déplace",
    standfirst:
      "La Fête des Mères française tombe le dernier dimanche de mai — sauf lorsque ce dimanche est celui de la Pentecôte, auquel cas elle est reportée au premier dimanche de juin. C'est une règle propre à la France, et elle décale la date d'une semaine certaines années.",
    sections: [
      {
        heading: "Une règle, pas une date",
        body: [
          "La plupart des pays européens célèbrent les mères le deuxième dimanche de mai. La France a retenu le dernier dimanche du mois, avec ce report en juin quand la Pentecôte occupe déjà la place. La date affichée ici est calculée à partir de cette règle, et non recopiée d'un tableau : elle reste donc juste sans que personne ait à la mettre à jour.",
          "Pour qui commande depuis l'étranger, c'est l'écart à connaître. Se fier au deuxième dimanche de mai, comme aux États-Unis ou en Allemagne, revient à viser deux à trois semaines trop tôt.",
        ],
      },
      {
        heading: "Pourquoi le rond et l'ovale",
        body: [
          "Le rond s'impose pour les puces d'oreilles et les pendentifs solitaires, pour une raison pratique : c'est la seule taille dont le certificat porte une note globale de taille. Une paire peut donc être appariée sur le papier avant de l'être à l'œil, ce qui compte pour des boucles : deux pierres légèrement différentes de taille se remarquent bien avant que leur écart de poids ne se voie.",
          "L'ovale répond à un autre besoin. À poids égal, il répartit la matière sur une silhouette plus longue : il couvre davantage le doigt et paraît plus grand qu'un rond du même carat. Lorsque le budget est fixé et que la présence compte, c'est la taille qui en tire le meilleur parti.",
        ],
      },
      {
        heading: "Ce qu'il faut regarder sur un ovale",
        body: [
          "Tout ovale présente un nœud papillon, cette bande sombre en travers du centre née de la rencontre des facettes. La question n'est jamais de savoir s'il existe, mais s'il est discret ou marqué — et aucun certificat ne le mentionne. Demandez les images d'un ovale de la liste : il apparaît immédiatement.",
        ],
      },
    ],
    brief: { shapes: "Rond et ovale", colour: "D à G" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...en,
    slug: "fete-des-meres-en",
    date: {
      kind: "computed",
      id: "fr-fete-des-meres",
      rule: "Last Sunday in May, moving to the first Sunday in June when it would fall on Pentecost",
    },
    title: "Fête des Mères diamonds: round and oval, D to G",
    description:
      "Round and oval loose diamonds in D-G for the French Fête des Mères, which falls on the last Sunday in May and moves into June in Pentecost years. Filtered and ready to enquire on.",
    eyebrow: "France · Fête des Mères, in English",
    heading: "France does not use the May date everyone else uses",
    standfirst:
      "Most of Europe marks Mother's Day on the second Sunday in May. France does not. It uses the last Sunday in May, and in years when that Sunday is Pentecost it moves again, to the first Sunday in June. Ordering to the wrong rule misses by two to three weeks.",
    sections: [
      {
        heading: "The rule, and why it moves",
        body: [
          "The French date is the last Sunday of May by default. The exception exists because Pentecost is a movable feast tied to Easter, falling forty-nine days after it, and in some years it lands on that same last Sunday. When it does, Fête des Mères steps aside to the first Sunday in June.",
          "That happens often enough to matter rather than as a curiosity. Over a twenty-year span it recurs several times, and it is the one detail an overseas buyer is most likely to get wrong. The date shown on this page is derived from the rule itself, including the Pentecost test, rather than read from a fixed list.",
        ],
      },
      {
        heading: "How the occasion is treated in France",
        body: [
          "Fête des Mères is a firmly established family occasion in France with an official standing that most countries' equivalents lack, and the gifting convention around it is warm but unostentatious. It favours something that will be worn daily over something kept for best.",
          "That points at a piece for ordinary wear: studs, a solitaire pendant, or a ring for the right hand rather than an engagement setting. The shapes below follow from that brief rather than from the date.",
        ],
      },
      {
        heading: "Why round and oval",
        body: [
          "The round is the practical answer for anything that has to match, because it is the only shape with an overall cut grade on the report. A pair of earrings can be matched on paper before being matched by eye, and two stones differing slightly in cut read as mismatched long before they read as different weights.",
          "The oval distributes the same weight along a longer outline, so it covers more of the finger and reads larger than a round of equal carat. One caveat worth knowing: every oval has a bow-tie, a dark band across the centre where the facets meet, and no certificate records it. Ask for images and it is visible at once.",
        ],
      },
    ],
    brief: { shapes: "Round and oval", colour: "D-G" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F", "G"] },
  },
];
