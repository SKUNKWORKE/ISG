import { EN, IT } from "./labels";
import type { Occasion } from "./types";

/** Italy, in Italian and in English. */

const it = {
  region: "eu-it",
  lang: "it",
  formatLocale: "it-IT",
  variant: "native",
  labels: IT,
} as const;

const en = {
  region: "eu-it",
  lang: "en",
  formatLocale: "en-GB",
  variant: "en",
  labels: EN,
} as const;

export const EU_IT_OCCASIONS: Occasion[] = [
  {
    ...it,
    slug: "san-valentino",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 febbraio, data fissa" },
    title: "Diamanti per San Valentino: taglio cuore e rotondo, da D a F",
    description:
      "Diamanti sciolti a taglio cuore e rotondo, colore da D a F, per San Valentino. Pietre naturali e da laboratorio, certificate da laboratorio indipendente e quotate singolarmente.",
    eyebrow: "Italia · San Valentino",
    heading: "Una pietra scelta per il quattordici",
    standfirst:
      "San Valentino nasce in Italia, a Terni, dove il santo è patrono della città. È una festa di coppia e di misura: si regala un pezzo scelto bene, non molti pezzi. Due tagli reggono questa data — il cuore, che dice le cose apertamente, e il rotondo, che le dice più piano.",
    sections: [
      {
        heading: "Perché cuore e rotondo",
        body: [
          "Il cuore è l'unico taglio del repertorio classico che si legge prima come simbolo e solo dopo come diamante. È questo a legarlo a questa data e quasi a nessun'altra. È anche il taglio in cui il lavoro fatto male si vede di più: i due lobi devono corrispondere, l'incavo essere netto, il profilo simmetrico rispetto all'asse centrale. Un cuore tagliato male si riconosce da tre metri, senza lente e senza alcuna preparazione.",
          "Il rotondo dice la stessa cosa a voce più bassa. È l'unico taglio con uno standard pubblicato per le proporzioni, quindi il più semplice da valutare sul certificato, e il più facile da rimontare se un giorno il pezzo verrà rifatto.",
        ],
      },
      {
        heading: "Perché il colore da D a F",
        body: [
          "D, E ed F formano il gruppo delle pietre incolori. Prese una per una, a pietra montata, sono praticamente indistinguibili anche per un professionista. Insieme però si staccano nettamente dal gruppo successivo appena due pietre vengono messe una accanto all'altra.",
          "Il mercato italiano monta molto in oro bianco e in platino, ed è lì che l'incolore si ripaga: un metallo bianco non lascia alla pietra alcun posto dove nascondere una sfumatura calda. Su una montatura in oro giallo o rosa l'argomento si indebolisce parecchio, e un colore G diventa una scelta del tutto difendibile.",
        ],
      },
      {
        heading: "Ordinare per tempo",
        body: [
          "Le pietre vengono acquistate una alla volta e non a lotti: ognuna può quindi essere riservata su una data mentre si decide la montatura. Mandaci il riferimento e ti rispondiamo con certificato, immagini e prezzo.",
        ],
      },
    ],
    brief: { shapes: "Cuore e rotondo", colour: "da D a F, incolore" },
    primary: { shapes: ["heart", "round"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "san-valentino-en",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 February, fixed" },
    title: "San Valentino diamonds for the Italian market: heart and round, D to F",
    description:
      "Heart and round loose diamonds in D-F for San Valentino in Italy, with the local conventions explained in English. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "Italy · San Valentino, in English",
    heading: "The occasion started here",
    standfirst:
      "San Valentino has a stronger claim on Italy than on most markets: Valentine himself is venerated at Terni, where he is the city's patron, and the association between the date and betrothal is older there than the commercial occasion built on it anywhere else.",
    sections: [
      {
        heading: "How the Italian occasion behaves",
        body: [
          "San Valentino in Italy is strictly a couples' occasion. There is no convention of giving to friends, colleagues or classmates, and the American habit of spreading the date across a whole social circle reads as a different holiday entirely.",
          "It is also a market with unusually high jewellery literacy. Italy is one of the largest goldsmithing economies in Europe, with Vicenza, Arezzo and Valenza all substantial manufacturing centres, and a recipient is more likely than average to look at how a piece is made rather than only at what is in it. That rewards buying on workmanship.",
        ],
      },
      {
        heading: "Why heart and round",
        body: [
          "The heart names the occasion outright, and it is the only cut that reads as a symbol before it reads as a stone. It is worth judging on symmetry above all: matched lobes, a clean cleft, an outline even about its centre line. Poor work on a heart is visible at conversational distance.",
          "The round is the more restrained answer and the more adaptable one. It is the only shape with a published cut standard, so it can be assessed properly from a report alone, and it carries over into any later remake without complication.",
        ],
      },
      {
        heading: "Why D to F",
        body: [
          "D, E and F are the colourless grades. Individually they are hard to separate once mounted; as a band they read clearly whiter than near-colourless when two stones are seen together.",
          "Italian setting runs strongly to white gold and platinum, and that is where the colourless premium is actually earned, because white metal gives a stone nowhere to conceal warmth. Against yellow gold, which Italy also buys heavily, the same argument weakens and a G is often the better-judged purchase.",
        ],
      },
    ],
    brief: { shapes: "Heart and round", colour: "D-F, colourless" },
    primary: { shapes: ["heart", "round"], colors: ["D", "E", "F"] },
  },
  {
    ...it,
    slug: "natale",
    date: {
      kind: "window",
      from: [12, 24],
      to: [12, 25],
      rule: "24 e 25 dicembre, dalla Vigilia al pranzo di Natale",
    },
    title: "Diamanti per Natale e la Vigilia: rotondo e princess, da D a G",
    description:
      "Diamanti sciolti a taglio rotondo e princess, colore da D a G, per la Vigilia e il giorno di Natale. Pietre naturali e da laboratorio, certificate e quotate singolarmente.",
    eyebrow: "Italia · Natale e la Vigilia",
    heading: "Tra la sera del ventiquattro e il pranzo del venticinque",
    standfirst:
      "In Italia il momento del regalo non è uno solo. Molte famiglie aprono i pacchi la sera della Vigilia, dopo il cenone; altre aspettano la mattina o il pranzo del venticinque. Chi ordina farebbe bene a puntare comunque al ventiquattro.",
    sections: [
      {
        heading: "Due momenti, una scadenza",
        body: [
          "La Vigilia e il giorno di Natale convivono come occasioni del regalo, e la divisione è spesso familiare più che regionale. In pratica questo significa una cosa sola per chi deve spedire: la data da rispettare è la prima delle due, non la seconda.",
          "Conta anche la luce. I pacchi si aprono in casa, con luce calda e bassa — quella di un salotto di dicembre, non quella di una vetrina. È una luce indulgente con una sfumatura calda nel colore e spietata con le proporzioni sbagliate: quello che si nota in quel momento è il taglio, non il colore.",
        ],
      },
      {
        heading: "Perché rotondo e princess",
        body: [
          "Il rotondo è il taglio più studiato del settore e il più prevedibile sotto quel tipo di luce. È anche l'unico con uno standard pubblicato per le proporzioni, quindi l'unico che si possa comprare bene lavorando sui numeri.",
          "Il princess è il brillante quadrato ed è qui per una ragione di valore. Segue la forma del grezzo ottaedrico molto più da vicino di un rotondo: la perdita in taglio è assai minore e il risparmio si vede direttamente nel prezzo al carato. A parità di budget, il princess è di norma la pietra più grande.",
        ],
      },
      {
        heading: "Cosa controllare su un princess",
        body: [
          "Gli angoli sono il punto debole: sono la parte più sottile della pietra e la più esposta agli urti, quindi una montatura ad anello deve coprire ciascuno dei quattro spigoli con un griffe. Il secondo dato da leggere è la profondità: oltre il 75 per cento circa il peso sta sotto la cintura, dove costa senza aggiungere nulla alla dimensione visibile.",
        ],
      },
    ],
    brief: { shapes: "Rotondo e princess", colour: "da D a G" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...en,
    slug: "natale-en",
    date: {
      kind: "window",
      from: [12, 24],
      to: [12, 25],
      rule: "24 to 25 December, from the Vigilia to Christmas lunch",
    },
    title: "Natale and La Vigilia diamonds: round and princess, D to G",
    description:
      "Round and princess loose diamonds in D-G for the Italian Christmas, which spans the Vigilia on the 24th and Christmas Day itself. Filtered and ready to enquire on.",
    eyebrow: "Italy · Natale, in English",
    heading: "Italy splits the difference on the gift moment",
    standfirst:
      "France and Germany open presents on the evening of the 24th; the English-speaking world waits for the morning of the 25th. Italy does both, and which one applies is usually a matter of family rather than of region.",
    sections: [
      {
        heading: "La Vigilia, and the day after",
        body: [
          "The Vigilia is the Christmas Eve dinner, traditionally lean and often built around fish, and in many households the presents are opened once it is over or after midnight mass. In others they wait until Christmas morning or the long lunch on the 25th.",
          "For a buyer outside Italy this ambiguity resolves simply: aim for the 24th. If the family in question opens on the 25th, nothing is lost. If they open on the Vigilia and the parcel is timed for Christmas morning, it misses the moment entirely.",
        ],
      },
      {
        heading: "Why round and princess",
        body: [
          "The round is the most predictable shape in the warm, low indoor light either of those moments actually happens in, and the only cut with a published proportion standard to buy from.",
          "The princess is the square brilliant and it is here on value. It follows the octahedral rough much more closely than a round does, so far less weight is lost in cutting, and that saving shows up directly in the price per carat. At a fixed budget it will generally be the larger stone.",
        ],
      },
      {
        heading: "Why D to G, and what to check",
        body: [
          "D through G keeps a stone convincingly white while leaving room to spend on what is actually noticed in wear, which is size and behaviour in light.",
          "On a princess, check two figures. The corners are the thinnest and most vulnerable part of the stone, so a ring setting needs a prong over each of the four. And read the depth: much past the mid-seventies in percent means weight carried below the girdle, where it costs money without adding any visible size.",
        ],
      },
    ],
    brief: { shapes: "Round and princess", colour: "D-G" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...it,
    slug: "festa-della-mamma",
    date: { kind: "computed", id: "it-festa-della-mamma", rule: "Seconda domenica di maggio" },
    title: "Diamanti per la Festa della Mamma: rotondo e ovale, da D a G",
    description:
      "Diamanti sciolti a taglio rotondo e ovale, colore da D a G, per la Festa della Mamma, la seconda domenica di maggio. Pietre naturali e da laboratorio, quotate singolarmente.",
    eyebrow: "Italia · Festa della Mamma",
    heading: "Un pezzo da portare tutti i giorni",
    standfirst:
      "In Italia la Festa della Mamma cade la seconda domenica di maggio, la stessa data di gran parte d'Europa — non quella francese né quella spagnola. Quello che serve è un pezzo da mettere ogni giorno, non da tenere nel cassetto.",
    sections: [
      {
        heading: "Perché rotondo e ovale",
        body: [
          "Il rotondo è la scelta naturale per gli orecchini a lobo e per i pendenti solitario, e per un motivo pratico: è l'unico taglio il cui certificato riporta un giudizio complessivo sul taglio. Un paio si può quindi abbinare sulla carta prima ancora che a occhio, il che per gli orecchini conta molto: due pietre tagliate in modo leggermente diverso si notano ben prima di due pesi diversi.",
          "L'ovale risolve un problema diverso. A parità di peso distribuisce la materia su un profilo più lungo: copre più dito e sembra più grande di un rotondo dello stesso carato. Quando il budget è fissato e quello che conta è la presenza, è il taglio che ne ricava di più.",
        ],
      },
      {
        heading: "Perché da D a G",
        body: [
          "Portare la fascia fino a G invece di fermarsi a F allarga molto la scelta senza far entrare un colore che si noti indossato. G sta in cima al gruppo successivo e, su pietra montata, non si distingue da F senza una serie di confronto. Quello che si risparmia va in peso o in taglio, e quelli si vedono.",
        ],
      },
      {
        heading: "Cosa guardare in un ovale",
        body: [
          "Ogni ovale ha il suo bow-tie, quella banda scura di traverso al centro che nasce da come si incontrano le faccette. La domanda non è mai se ci sia, ma se sia appena accennato o evidente — e nessun certificato lo riporta. Chiedi le immagini di un ovale dell'elenco e si vede subito.",
        ],
      },
    ],
    brief: { shapes: "Rotondo e ovale", colour: "da D a G" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...en,
    slug: "festa-della-mamma-en",
    date: { kind: "computed", id: "it-festa-della-mamma", rule: "Second Sunday in May" },
    title: "Festa della Mamma diamonds: round and oval, D to G",
    description:
      "Round and oval loose diamonds in D-G for the Italian Festa della Mamma, the second Sunday in May. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "Italy · Festa della Mamma, in English",
    heading: "Italy keeps the common May date",
    standfirst:
      "Italy marks the Festa della Mamma on the second Sunday in May, in step with Germany, Austria, Switzerland and the United States. It is worth saying only because France and Spain, its nearest large neighbours in this market, both sit on different rules.",
    sections: [
      {
        heading: "A date you can group with others",
        body: [
          "If you are buying across several European markets, Italy can be handled together with Germany and most of the rest of the continent on the second Sunday in May. France uses the last Sunday in May, stepping into June in Pentecost years, and Spain uses the first Sunday. Those two need to be diarised separately.",
          "The Italian occasion is strongly observed and centred on the family rather than on display. The brief that follows from that is a piece for daily wear: studs, a solitaire pendant, or a ring for the right hand.",
        ],
      },
      {
        heading: "Why round and oval",
        body: [
          "The round is the practical choice anywhere two stones must match, because it is the only shape carrying an overall cut grade on its report. A pair can be matched on paper before being matched by eye, and a slight difference in cut between two studs shows long before a difference in weight does.",
          "The oval spreads the same weight along a longer outline, so it covers more of the finger and reads larger than a round of the same carat. Be aware that every oval carries a bow-tie, the dark band across the centre where the facets meet; no certificate records it, so ask for images.",
        ],
      },
      {
        heading: "Why D to G",
        body: [
          "Running to G rather than stopping at F opens up the field considerably without letting in colour that shows in wear. G is the top of the near-colourless range and is not separable from F in a mounted stone without a comparison set. The saving goes into carat or cut, both of which are visible every day.",
        ],
      },
    ],
    brief: { shapes: "Round and oval", colour: "D-G" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F", "G"] },
  },
];
