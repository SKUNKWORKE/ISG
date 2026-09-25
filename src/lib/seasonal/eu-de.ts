import { DE, EN } from "./labels";
import type { Occasion } from "./types";

/**
 * Germany, in German and in English.
 *
 * The German pages assume the reader knows that Bescherung happens on the
 * evening of the 24th; the English ones exist largely to tell a reader who
 * does not.
 */

const de = {
  region: "eu-de",
  lang: "de",
  formatLocale: "de-DE",
  variant: "native",
  labels: DE,
} as const;

const en = {
  region: "eu-de",
  lang: "en",
  formatLocale: "en-GB",
  variant: "en",
  labels: EN,
} as const;

export const EU_DE_OCCASIONS: Occasion[] = [
  {
    ...de,
    slug: "valentinstag",
    date: { kind: "fixed", month: 2, day: 14, rule: "14. Februar, fester Termin" },
    title: "Diamanten zum Valentinstag: Herz und Rund, D bis F",
    description:
      "Lose Diamanten im Herz- und Rundschliff, Farbe D bis F, für den Valentinstag. Natürliche und laborgezüchtete Steine, unabhängig zertifiziert und einzeln kalkuliert.",
    eyebrow: "Deutschland · Valentinstag",
    heading: "Ein Stein für den vierzehnten Februar",
    standfirst:
      "Der Valentinstag ist in Deutschland eine vergleichsweise zurückhaltende Angelegenheit. Gekauft wird eher ein gut gewähltes Stück als vieles auf einmal, und zwei Schliffformen tragen den Anlass: das Herz, das den Anlass ausspricht, und der Brillant, der ihn andeutet.",
    sections: [
      {
        heading: "Warum Herz und Rund",
        body: [
          "Das Herz ist die einzige Form im klassischen Repertoire, die zuerst als Zeichen und erst danach als Diamant gelesen wird. Genau das bindet sie an dieses Datum und an kaum ein anderes. Sie ist zugleich die Form, bei der schlechte Arbeit am deutlichsten zu sehen ist: Die beiden Bögen müssen übereinstimmen, die Einkerbung sauber gearbeitet sein, die Kontur symmetrisch zur Mittelachse. Ein schlecht geschliffenes Herz erkennt man aus drei Metern Entfernung, ohne Lupe und ohne jede Ausbildung.",
          "Der Rundschliff sagt dasselbe leiser. Er ist die einzige Form mit einem veröffentlichten Standard für ihre Proportionen, also am einfachsten anhand des Zertifikats zu beurteilen, und am unkompliziertesten neu zu fassen, falls das Stück später einmal umgearbeitet wird.",
        ],
      },
      {
        heading: "Warum Farbe D bis F",
        body: [
          "D, E und F bilden die Gruppe der farblosen Steine, im deutschen Handel als hochfeines Weiß und feines Weiß geführt. Einzeln sind sie im gefassten Zustand praktisch nicht auseinanderzuhalten, auch von Fachleuten nicht. Als Gruppe setzen sie sich jedoch deutlich vom Bereich Weiß ab, sobald zwei Steine nebeneinander liegen.",
          "Im deutschsprachigen Raum wird überwiegend in Weißgold und Platin gefasst, und dort lohnt sich Farblosigkeit am ehesten: Ein weißes Metall lässt dem Stein keinen Ort, an dem er einen warmen Stich verbergen könnte. Geht das Stück dagegen in Gelb- oder Roségold, wird das Argument spürbar schwächer, und ein G ist eine gut begründbare Wahl.",
        ],
      },
      {
        heading: "Rechtzeitig bestellen",
        body: [
          "Jeder Stein wird einzeln eingekauft, nicht als Partie, und lässt sich deshalb auf einen Termin reservieren, während die Fassung noch entschieden wird. Nennen Sie uns die Referenz, und Sie erhalten Zertifikat, Aufnahmen und Preis in einer Antwort.",
        ],
      },
    ],
    brief: { shapes: "Herz und Rund", colour: "D bis F, farblos" },
    primary: { shapes: ["heart", "round"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "valentinstag-en",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 February, fixed" },
    title: "Valentinstag diamonds for the German market: heart and round, D to F",
    description:
      "Heart and round loose diamonds in D-F for Valentinstag in Germany, with local grading language and buying habits explained in English.",
    eyebrow: "Germany · Valentinstag, in English",
    heading: "Buying into a market that reads grades in German",
    standfirst:
      "Valentinstag is observed in Germany on the usual date and in an unusually restrained way. It is a younger tradition there than in the English-speaking world, and it carries none of the obligation that attaches to Christmas, which shapes both what is bought and how much of it.",
    sections: [
      {
        heading: "German grading vocabulary",
        body: [
          "The most practical thing to know when buying into this market is that German jewellers often quote colour in German terms rather than in letters. Hochfeines Weiß plus corresponds to D, hochfeines Weiß to E, feines Weiß to F, and plain Weiß to G. Clarity works the same way: lupenrein is FL or IF.",
          "It is worth being fluent in both sets, because a German recipient or a German jeweller asked to set the stone may well describe it in those words. The reports themselves are issued in the international letter grades, so nothing is lost in translation, but the conversation around them may not be.",
        ],
      },
      {
        heading: "How the occasion is treated",
        body: [
          "Valentinstag in Germany is squarely a couples' occasion, and a relatively modest one. There is no convention of giving to friends or colleagues, and the scale of gifting is considerably smaller than in the United States. Flowers dominate; jewellery is the considered step above them rather than the default.",
          "That argues for one well-chosen stone rather than size for its own sake, and it tends to reward spending on cut and colour over carat weight.",
        ],
      },
      {
        heading: "Why heart and round, and why D to F",
        body: [
          "The heart states the occasion outright and is the only cut that reads as a symbol first. Check its symmetry closely: matched lobes, a clean cleft, an outline even about its centre line. The round is the quieter and more flexible answer, with a published cut standard that makes it straightforward to judge from a report.",
          "D to F is the colourless band, and it earns its premium in the white metal this market overwhelmingly buys. German setting runs heavily to Weißgold and platinum, neither of which gives a stone anywhere to hide warmth. In yellow or rose gold the same money is usually better spent elsewhere.",
        ],
      },
    ],
    brief: { shapes: "Heart and round", colour: "D-F, colourless" },
    primary: { shapes: ["heart", "round"], colors: ["D", "E", "F"] },
  },
  {
    ...de,
    slug: "heiligabend",
    date: { kind: "fixed", month: 12, day: 24, rule: "24. Dezember, abends" },
    title: "Diamanten für Heiligabend: Rund und Prinzess, D bis G",
    description:
      "Lose Diamanten im Rund- und Prinzessschliff, Farbe D bis G, für die Bescherung am 24. Dezember. Natürliche und laborgezüchtete Steine, unabhängig zertifiziert.",
    eyebrow: "Deutschland · Heiligabend",
    heading: "Die Bescherung ist am Abend des 24.",
    standfirst:
      "In Deutschland wird am Abend des 24. Dezember beschert, nicht am Morgen des 25. Das ist ein Tag Unterschied, und er verschiebt die tatsächliche Frist einer Bestellung um genau diesen Tag nach vorn.",
    sections: [
      {
        heading: "Ein Abend, kein Morgen",
        body: [
          "Heiligabend ist der Kern des deutschen Weihnachtsfests. Beschert wird am Abend, häufig vor oder nach dem Gottesdienst, und die beiden Feiertage danach tragen das Fest weiter, ohne den Moment selbst noch einmal zu wiederholen. Wer aus dem Ausland bestellt, sollte genau das einplanen: Der Stein muss zum 24. da und gefasst sein.",
          "Auch das Licht dieses Abends ist eine Größe für sich. Beschert wird drinnen, bei warmem, niedrigem Licht — Wohnzimmerlicht im Dezember, nicht Vitrinenlicht. Solches Licht ist nachsichtig gegenüber einem warmen Farbstich und gnadenlos gegenüber schlechten Proportionen. Was an diesem Abend auffällt, ist der Schliff, nicht die Farbe.",
        ],
      },
      {
        heading: "Warum Rund und Prinzess",
        body: [
          "Der Brillantschliff ist die am gründlichsten untersuchte Form im Handel und diejenige, die sich unter diesem Licht am berechenbarsten verhält. Er ist zudem die einzige Form mit einem veröffentlichten Proportionsstandard, lässt sich also anhand von Zahlen zuverlässig kaufen.",
          "Der Prinzessschliff ist der quadratische Brillant und steht hier aus einem Preisgrund. Er folgt dem oktaedrischen Rohstein weit enger als ein Brillant, der Schleifverlust fällt deutlich geringer aus, und diese Ersparnis schlägt unmittelbar auf den Karatpreis durch. Bei gleichem Budget ist der Prinzess in der Regel der größere Stein.",
        ],
      },
      {
        heading: "Was man beim Prinzessschliff prüfen sollte",
        body: [
          "Die Ecken sind die Schwachstelle: Sie sind die dünnsten Stellen des Steins und am ehesten schlagempfindlich. Eine Ringfassung sollte deshalb jede der vier Ecken mit einer Krappe überdecken. Die zweite Zahl, die sich zu lesen lohnt, ist die Tiefe: Jenseits von etwa 75 Prozent liegt Gewicht unterhalb der Rundiste, wo es Geld kostet und nichts zur sichtbaren Größe beiträgt.",
        ],
      },
    ],
    brief: { shapes: "Rund und Prinzess", colour: "D bis G" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...en,
    slug: "heiligabend-en",
    date: { kind: "fixed", month: 12, day: 24, rule: "The evening of 24 December" },
    title: "Heiligabend diamonds: round and princess, D to G",
    description:
      "Round and princess loose diamonds in D-G for Heiligabend, 24 December, when German gifts are actually exchanged. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "Germany · Heiligabend, in English",
    heading: "German Christmas happens a day before you think",
    standfirst:
      "For anyone buying into Germany at Christmas, one fact outranks the rest: the gifts are exchanged on the evening of 24 December, not on the morning of the 25th. The real deadline is a full day earlier than an English-speaking buyer will instinctively assume.",
    sections: [
      {
        heading: "Bescherung, and what it displaces",
        body: [
          "The exchange itself has its own name, Bescherung, and it takes place on the evening of the 24th, often around a church service. The 25th and 26th are both public holidays in Germany and both are properly part of the festival, but neither is the moment the presents are opened. That has already happened.",
          "Germany is not alone in this. Austria, Switzerland, Poland, the Czech Republic and most of Scandinavia work the same way, and so does France. Within Europe it is the English-speaking convention of Christmas morning that is the exception rather than the rule.",
        ],
      },
      {
        heading: "Why the day matters for an order",
        body: [
          "For a loose stone a day is nothing. For a finished piece it is the difference between arriving and not, because setting is the slow step in any order and late December is the worst possible moment to lose time in a workshop.",
          "Handle it the way you would anywhere else, one day earlier: reserve the stone first, let the setting follow, and count backwards from the evening of the 24th.",
        ],
      },
      {
        heading: "Why round and princess",
        body: [
          "The round is the most predictable shape in the warm, low indoor light of a German living room in December, and the only cut with a published proportion standard to buy from. The princess is the square brilliant and it is here on value: much less weight is lost cutting it from octahedral rough than is lost cutting a round, and that saving lands in the price per carat.",
          "If you choose a princess, check the corners and the depth. The corners are the thinnest part of the stone and need a prong over each of the four in a ring setting. A depth much past the mid-seventies in percent means weight sitting below the girdle, adding cost but no visible size.",
        ],
      },
    ],
    brief: { shapes: "Round and princess", colour: "D-G" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...de,
    slug: "muttertag",
    date: { kind: "computed", id: "de-muttertag", rule: "Zweiter Sonntag im Mai" },
    title: "Diamanten zum Muttertag: Rund und Oval, D bis G",
    description:
      "Lose Diamanten im Rund- und Ovalschliff, Farbe D bis G, zum Muttertag am zweiten Maisonntag. Natürliche und laborgezüchtete Steine, einzeln kalkuliert.",
    eyebrow: "Deutschland · Muttertag",
    heading: "Ein Stück, das getragen wird",
    standfirst:
      "Der Muttertag fällt in Deutschland auf den zweiten Sonntag im Mai — dasselbe Datum wie in den Vereinigten Staaten und im größten Teil Europas, anders als in Frankreich oder Spanien. Der Anlass verlangt etwas, das täglich getragen wird, nicht etwas für den Schrank.",
    sections: [
      {
        heading: "Warum Rund und Oval",
        body: [
          "Der Rundschliff ist die naheliegende Wahl für Ohrstecker und Solitär-Anhänger, und zwar aus einem praktischen Grund: Er ist die einzige Form, deren Zertifikat eine Gesamtnote für den Schliff ausweist. Ein Paar lässt sich damit auf dem Papier abstimmen, bevor es das Auge tut — bei Ohrsteckern entscheidend, denn zwei leicht unterschiedlich geschliffene Steine fallen lange vor einem Gewichtsunterschied auf.",
          "Der Ovalschliff löst eine andere Aufgabe. Bei gleichem Gewicht verteilt er die Masse auf eine längere Kontur: Er bedeckt mehr Finger und wirkt größer als ein Brillant desselben Karatgewichts. Wo das Budget feststeht und Präsenz zählt, holt diese Form am meisten heraus.",
        ],
      },
      {
        heading: "Warum D bis G",
        body: [
          "Die Spanne bis G statt bis F zu ziehen, erweitert die Auswahl erheblich, ohne eine Färbung zuzulassen, die im Tragen auffiele. G steht am oberen Rand des Bereichs Weiß und ist am gefassten Stein ohne Vergleichssatz nicht von F zu unterscheiden. Was dabei frei wird, fließt in Gewicht oder Schliff — beides sichtbar.",
        ],
      },
      {
        heading: "Worauf man beim Oval achtet",
        body: [
          "Jedes Oval trägt eine Fliege, jenes dunkle Band quer durch die Mitte, das dort entsteht, wo die Facetten zusammentreffen. Die Frage ist nie, ob es vorhanden ist, sondern ob es schwach oder deutlich ausfällt — und kein Zertifikat hält das fest. Fordern Sie Aufnahmen zu einem Oval aus der Liste an, dann zeigt es sich sofort.",
        ],
      },
    ],
    brief: { shapes: "Rund und Oval", colour: "D bis G" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...en,
    slug: "muttertag-en",
    date: { kind: "computed", id: "de-muttertag", rule: "Second Sunday in May" },
    title: "Muttertag diamonds: round and oval, D to G",
    description:
      "Round and oval loose diamonds in D-G for the German Muttertag, the second Sunday in May. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "Germany · Muttertag, in English",
    heading: "The standard May date, unlike its neighbours",
    standfirst:
      "Germany marks Muttertag on the second Sunday in May, the same date as the United States and most of Europe. That is worth stating plainly only because two of its larger neighbours do not: France uses the last Sunday in May, and Spain the first.",
    sections: [
      {
        heading: "One date across most of the market",
        body: [
          "If you are buying across several European markets at once, Germany, Italy, Austria and Switzerland all share the second Sunday in May, which makes them straightforward to handle together. France and Spain are the two that need separate handling, and both sit on their own rules.",
          "The German occasion itself is well established and unshowy. It favours something worn every day over something reserved for occasions, which points at studs, a solitaire pendant or a right-hand ring rather than anything resembling an engagement setting.",
        ],
      },
      {
        heading: "Why round and oval",
        body: [
          "The round is the practical choice wherever two stones have to match, because it is the only shape with an overall cut grade on its report. A pair of studs can be matched on paper first, and two stones differing slightly in cut will read as mismatched long before any difference in weight does.",
          "The oval spreads the same weight along a longer outline, covering more of the finger and reading larger than a round of equal carat. Every oval carries a bow-tie, though, the dark band across the centre where the facets meet, and no report records it. Ask for images before deciding.",
        ],
      },
      {
        heading: "Why D to G",
        body: [
          "Running the band to G rather than stopping at F widens the field substantially without admitting colour that shows in wear. G is the top of near-colourless, and in a mounted stone it is not separable from F without a comparison set. The money saved goes into carat or cut, which are both visible daily.",
        ],
      },
    ],
    brief: { shapes: "Round and oval", colour: "D-G" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F", "G"] },
  },
];
