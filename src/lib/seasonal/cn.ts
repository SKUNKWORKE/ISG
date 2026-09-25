import { EN, ZH } from "./labels";
import type { Occasion } from "./types";

/**
 * China, in Simplified Chinese and in English.
 *
 * Chinese New Year takes the same two-link treatment as Korean White Day:
 * fancy yellow and colourless D-F cannot be expressed as one catalogue filter,
 * because a white stone carries no hue to match against.
 */

const zh = {
  region: "cn",
  lang: "zh-Hans",
  formatLocale: "zh-CN",
  variant: "native",
  labels: ZH,
} as const;

const en = {
  region: "cn",
  lang: "en",
  formatLocale: "en-GB",
  variant: "en",
  labels: EN,
} as const;

export const CN_OCCASIONS: Occasion[] = [
  {
    ...zh,
    slug: "chinese-new-year",
    date: { kind: "lunar", rule: "农历正月初一，公历一月下旬至二月中旬之间" },
    title: "春节钻石臻选 | 圆形与公主方，浓彩黄与无色",
    description:
      "春节送礼的圆形与公主方裸钻。可选浓彩黄钻，或无色 D–F 级白钻。天然钻与培育钻均附独立鉴定证书，逐颗报价。",
    eyebrow: "中国 · 春节",
    heading: "一年里最重的那份礼",
    standfirst:
      "春节是中国一年中分量最重的送礼时节。长辈、晚辈、亲戚之间的往来集中在这几天，而黄色在这个场合里有着别的颜色替代不了的位置。",
    sections: [
      {
        heading: "黄钻，或是白钻",
        body: [
          "这个节令有两种走法。一种是浓彩黄钻。黄色与金相近，在春节的语境里几乎不需要解释，而彩钻本身的稀有程度又让这份礼的分量不必再多说什么。",
          "另一种是无色 D–F 级。它不靠颜色说话，靠品质说话，配任何款式都不会出错，放上十年二十年也不会过时。下方按钮对应的是浓彩黄，正文下面的链接则单独列出无色区间。",
        ],
      },
      {
        heading: "为什么是圆形和公主方",
        body: [
          "圆形明亮式是唯一一种证书上带有切工总评的形状。也就是说，在见到实物之前，仅凭纸面就能把两颗石头放在一起比较。送礼要讲清楚一件东西好在哪里时，这一点很实在。",
          "公主方是方形的明亮式切工。它比圆形更贴近原石的八面体形状，切磨时损耗小得多，这部分节省会直接体现在每克拉的价格上。同样的预算，公主方通常能买到更大的一颗。",
        ],
      },
      {
        heading: "关于彩钻的一点说明",
        body: [
          "彩色钻石与无色钻石用的是两套完全不同的分级标准。彩钻按色调、明度和饱和度来分，而不是 D 到 Z 的字母等级，同样叫黄钻，等级不同价格可以相差很远。库存和行情变动都比较快，看中哪一颗，把编号发给我们即可。",
        ],
      },
    ],
    brief: { shapes: "圆形、公主方", colour: "浓彩黄 / D–F" },
    primary: { shapes: ["round", "princess"], fancyHue: "Yellow" },
    secondary: {
      filter: { shapes: ["round", "princess"], colors: ["D", "E", "F"] },
      label: "改看无色 D–F",
      note: "若想以品质而非颜色来表达心意，同样这两种形状也有无色 D–F 级可选。彩钻与白钻分属两套分级体系，因此清单也是分开的。",
    },
  },
  {
    ...en,
    slug: "chinese-new-year-en",
    date: {
      kind: "lunar",
      rule: "The first day of the first lunar month, falling between late January and mid-February",
    },
    title: "Chinese New Year diamonds: round and princess, fancy yellow or D to F",
    description:
      "Round and princess loose diamonds for Chinese New Year, offered as fancy yellow or as colourless D-F. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "China · Chinese New Year, in English",
    heading: "The heaviest gifting season of the Chinese year",
    standfirst:
      "Chinese New Year is the largest gift-giving occasion in China by a wide margin, and yellow occupies a place in it that no other colour does. It is also a moving target: the date is lunar, falling anywhere between late January and the middle of February.",
    sections: [
      {
        heading: "Why yellow reads differently here",
        body: [
          "Gold is the material of Chinese New Year gifting, and it carries associations of prosperity and good fortune that are specific rather than decorative. Gold jewellery moves in very large volumes around the festival, and gold-coloured everything else moves with it.",
          "A fancy yellow diamond sits close enough to that to make sense immediately, without needing to be explained. It reads as gold-adjacent while being considerably rarer than the metal, which is the reason it appears on this page rather than a white stone alone.",
        ],
      },
      {
        heading: "Two separate lists, and why",
        body: [
          "Fancy colour and white diamonds are graded on entirely different systems. White stones run D to Z on a scale measuring the absence of colour; fancy stones are described by hue, tone and saturation, and are valued for the presence of it. A stone is assessed on one scale or the other, never both.",
          "That is why this page offers two links rather than one filter. A single filter combining fancy yellow with colourless D-F would quietly return only the yellows, because a white stone has no hue to match against. Keeping them separate is the honest way to show both.",
        ],
      },
      {
        heading: "Why round and princess, and one practical note",
        body: [
          "The round is the only cut with an overall cut grade on its report, which makes quality demonstrable on paper — useful for a gift whose merits may need explaining. The princess is the square brilliant, following the octahedral rough far more closely than a round does, so much less weight is lost in cutting and the same budget generally reaches a larger stone.",
          "On the logistics: the lunar date moves, and the fortnight around it is the largest annual movement of people on earth. Freight and customs both slow considerably. Whatever lead time seems sufficient, add to it.",
        ],
      },
    ],
    brief: { shapes: "Round and princess", colour: "Fancy yellow, or D-F" },
    primary: { shapes: ["round", "princess"], fancyHue: "Yellow" },
    secondary: {
      filter: { shapes: ["round", "princess"], colors: ["D", "E", "F"] },
      label: "See colourless D-F instead",
      note: "Where quality rather than colour is the message, the same two shapes are available in colourless D-F. Fancy and white stones are graded on separate systems, so the two lists are necessarily separate.",
    },
  },
  {
    ...zh,
    slug: "520-day",
    date: { kind: "fixed", month: 5, day: 20, rule: "5月20日" },
    title: "520 表白日钻石 | 圆形与椭圆形，D–F 无色",
    description:
      "为 5 月 20 日表白日挑选的圆形与椭圆形裸钻，颜色为无色 D–F 级。天然钻与培育钻均附独立鉴定证书，逐颗报价。",
    eyebrow: "中国 · 520",
    heading: "五月二十日，因为读音",
    standfirst:
      "520 谐音「我爱你」，就凭这三个数字，5 月 20 日成了国内最大的求婚与表白日之一，热度已经超过 2 月 14 日。这是一个完全由网络生长出来的节日，也正因如此，它的节奏比传统节日更快。",
    sections: [
      {
        heading: "一个从读音里长出来的日子",
        body: [
          "「五二零」念快了就是「我爱你」，「五二一」也一样，所以 20 日和 21 日常常连着过。这个日子没有任何传统渊源，完全是从互联网上生长出来的，却在十几年里长成了实打实的消费节点。",
          "它的特点是快。求婚集中在这一天，而决定往往在临近时才做出。留给挑石头和镶嵌的时间通常不宽裕，所以更值得先把石头定下来，款式后议。",
        ],
      },
      {
        heading: "为什么是圆形和椭圆形",
        body: [
          "圆形是求婚钻戒的基准。它是唯一一种有国际切工标准的形状，证书上的切工评级可以直接当作品质依据，日后改镶也没有任何限制。",
          "椭圆形在同样克拉重量下看起来更大。重量沿长轴分布，正面面积更宽，还能把手指衬得修长。在一克拉上下的区间里，这个差别相当明显，也是它近年来在国内增长很快的原因。",
        ],
      },
      {
        heading: "椭圆形要看的一点",
        body: [
          "所有椭圆形都会有领结效应，也就是横贯中央的那道暗影，这是刻面排列造成的。问题从来不是有没有，而是明显还是不明显——而证书上并不会写。看中哪一颗，问我们要实拍图，一眼就能看出来。",
        ],
      },
    ],
    brief: { shapes: "圆形、椭圆形", colour: "D–F（无色）" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "520-day-en",
    date: { kind: "fixed", month: 5, day: 20, rule: "20 May, fixed" },
    title: "520 Day diamonds: round and oval, D to F",
    description:
      "Round and oval loose diamonds in D-F for 520 Day on 20 May, one of China's largest proposal dates. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "China · 520 Day, in English",
    heading: "A date built entirely on a pun",
    standfirst:
      "In Mandarin, the digits five-two-zero sound close to wo ai ni, I love you. On that basis 20 May has become one of the largest proposal and romantic gifting days in China — domestically bigger, by most measures, than 14 February.",
    sections: [
      {
        heading: "How a number became an occasion",
        body: [
          "The pun originated online, where numeric shorthand is common, and 520 spread from messaging into gifting and then into weddings. 521 works the same way and the two days are often treated as one window. Registry offices in some cities report their heaviest days of the year on these dates.",
          "It has no traditional or religious basis at all, which is precisely what makes it interesting as a market: it was created entirely by users rather than by retailers, and it grew from nothing to a major commercial date within about fifteen years.",
        ],
      },
      {
        heading: "What that means for how it is bought",
        body: [
          "Because the occasion is young and digital, the buying behaviour around it is fast. Decisions are made closer to the date than they are for Chinese New Year, discovery happens largely on social platforms, and the compression falls on the setting rather than on the stone.",
          "The practical answer is the same as for any concentrated date: reserve the loose stone first and let the setting follow. The stone can be confirmed quickly; the mounting cannot.",
        ],
      },
      {
        heading: "Why round and oval",
        body: [
          "The round is the benchmark for a proposal stone, the only shape with a published proportion standard, and the easiest to reset later without complication.",
          "The oval reads larger than a round of the same weight, because that weight is spread along a longer outline, and it elongates the finger — which matters in a market where stones around one carat are the centre of gravity. Every oval carries a bow-tie across its centre, no report records it, and images show it immediately.",
        ],
      },
    ],
    brief: { shapes: "Round and oval", colour: "D-F, colourless" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F"] },
  },
  {
    ...zh,
    slug: "qixi",
    date: { kind: "lunar", rule: "农历七月初七，公历八月前后" },
    title: "七夕钻石臻选 | 圆形与心形，D–F 无色",
    description:
      "为七夕挑选的圆形与心形裸钻，颜色为无色 D–F 级。天然钻与培育钻均附独立鉴定证书，逐颗报价。",
    eyebrow: "中国 · 七夕",
    heading: "一年一度的那次相会",
    standfirst:
      "七夕在农历七月初七，公历日期每年不同，通常落在八月前后。牛郎织女一年只见一面的故事传了两千年，而近二十年里，它也成了国内最主要的浪漫消费节点之一。",
    sections: [
      {
        heading: "一个真正有来历的日子",
        body: [
          "与 520 不同，七夕有实打实的出处。故事里两人被银河分开，每年只有这一夜能借鹊桥相会。这个「一年只此一次」的意味，落在送礼上就成了更看重分量而非频次的倾向。",
          "因为按农历计算，公历日期每年都不一样，所以本页没有写出具体日期。站内并没有农历换算，与其写一个可能不准的日子，不如把规则讲清楚。",
        ],
      },
      {
        heading: "为什么是圆形和心形",
        body: [
          "圆形稳妥，也最容易讲清楚好在哪里——它是唯一一种证书上带切工总评的形状，品质可以在纸面上核对，日后改镶也没有限制。",
          "心形则把话说得更直白，适合这个日子。但它也是最考验切工的形状：左右两瓣要对称，中间的凹口要利落，整体轮廓要以中线为轴对称。切得不好，隔着两三米就看得出来。证书上的对称性评级和实拍图请一并核对。",
        ],
      },
      {
        heading: "为什么是 D–F",
        body: [
          "D、E、F 属于无色级别。单看一颗、镶好之后，能把这三级分辨出来的人很少；但把这一档和下面一档摆在一起，差别谁都看得见。国内镶嵌以铂金和白金为主，白色金属不会替石头掩饰任何色调，所以选无色区间的意义在这里体现得最明显。",
        ],
      },
    ],
    brief: { shapes: "圆形、心形", colour: "D–F（无色）" },
    primary: { shapes: ["round", "heart"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "qixi-en",
    date: {
      kind: "lunar",
      rule: "The 7th day of the 7th lunar month, usually falling in August",
    },
    title: "Qixi Festival diamonds: round and heart, D to F",
    description:
      "Round and heart loose diamonds in D-F for the Qixi Festival, the traditional Chinese romantic occasion. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "China · Qixi Festival, in English",
    heading: "Two thousand years older than the other one",
    standfirst:
      "Qixi is often introduced to outsiders as Chinese Valentine's Day, which undersells it. It falls on the seventh day of the seventh lunar month, usually in August, and the story behind it has been told for something close to two millennia.",
    sections: [
      {
        heading: "The story, and why it shapes the gifting",
        body: [
          "The tale is of the weaver girl and the cowherd, separated across the Milky Way and permitted to meet just once a year, when magpies form a bridge between them. The festival marks that single night.",
          "The once-a-year framing matters commercially, because it pushes the occasion towards significance rather than frequency. A gift for Qixi is expected to carry some weight, in a way that a gift for a monthly couples' date is not.",
        ],
      },
      {
        heading: "Qixi against 520",
        body: [
          "China now has two major romantic dates and they behave quite differently. 520, on 20 May, is young, built on a pun, digitally native and fast-moving. Qixi is ancient, lunar and considerably more traditional in tone, and it skews towards heritage and craft in the way it is marketed.",
          "Because Qixi is lunar, its Gregorian date shifts each year, and no date is printed here. This site carries no lunisolar calendar, and stating the rule is better than printing a date that might be wrong.",
        ],
      },
      {
        heading: "Why round and heart",
        body: [
          "The round is the safe answer and the easiest to justify, being the only cut with an overall cut grade on its report and the simplest to reset later.",
          "The heart suits the occasion's directness, but it is the least forgiving cut to buy. The lobes must match, the cleft must be clean, and the outline must be symmetrical about its centre line. Poor work on a heart is visible at several metres — check the symmetry grade on the report and ask for images.",
        ],
      },
    ],
    brief: { shapes: "Round and heart", colour: "D-F, colourless" },
    primary: { shapes: ["round", "heart"], colors: ["D", "E", "F"] },
  },
  {
    ...zh,
    slug: "singles-day",
    date: { kind: "fixed", month: 11, day: 11, rule: "11月11日" },
    title: "双十一钻石 | 圆形，D–G",
    description:
      "双十一期间的圆形裸钻，颜色 D 至 G 级。每颗均附独立鉴定证书并单独报价——没有标价，也就无所谓折扣。",
    eyebrow: "中国 · 双十一",
    heading: "买给自己的那一天",
    standfirst:
      "双十一是全球规模最大的购物日，而其中很大一部分是买给自己的。这一天的买家通常功课做得很足，问的是比例和证书，不是包装。",
    sections: [
      {
        heading: "为什么只有圆形",
        body: [
          "这个页面的筛选特意只留了一种形状。圆形明亮式是唯一一种由 GIA 和 IGI 出具切工总评的切工，也就是说，它是唯一一种两家卖家的石头可以在都看不到实物的情况下做对等比较的形状。",
          "在一个整天都在做比较的日子里，这一点比选择面广更重要。其他所有形状都要靠抛光、对称和各项比例逐条判断，这当然做得到，但那不是对等比较，而对等比较正是这一天的全部意义所在。",
        ],
      },
      {
        heading: "为什么是 D–G",
        body: [
          "D 到 G 这一档里，颜色已经不再是决定性的问题，切工才是。在这个区间内，一颗切工评级为 Excellent 或 Ideal 的 G 色，通常比一颗比例平平的 D 色更值得买——因为决定一颗钻石在光下表现如何的，是切工。",
        ],
      },
      {
        heading: "这里没有折扣价",
        body: [
          "因为这里本来就没有标价可打折。我们的钻石是一颗一颗挑选入库的，而非成包采购，每一颗都按其本身的重量、等级、修饰度和证书单独报价。11 月 11 日如此，6 月里的任何一天也是如此。",
        ],
      },
    ],
    brief: { shapes: "圆形", colour: "D–G" },
    primary: { shapes: ["round"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...en,
    slug: "singles-day-en",
    date: { kind: "fixed", month: 11, day: 11, rule: "11 November, fixed" },
    title: "Singles' Day diamonds: round, D to G",
    description:
      "Round loose diamonds in D-G for Singles' Day on 11 November, the largest e-commerce event in the world. Each stone graded independently and quoted on its own.",
    eyebrow: "China · Singles' Day, in English",
    heading: "The largest shopping day in the world",
    standfirst:
      "Double 11, on 11 November, is the biggest single retail event anywhere, comfortably exceeding Black Friday and Cyber Monday combined. A large share of it is self-purchase, and the buyers who arrive on it have generally done the reading.",
    sections: [
      {
        heading: "Where the date came from",
        body: [
          "The four ones in 11/11 were read by university students in the 1990s as a symbol of being single, and the date became an anti-Valentine's occasion. It stayed a student joke until it was adopted as a shopping event in 2009, after which it grew into something without precedent.",
          "The character of it has shifted as it has grown. It began as a day for buying yourself something because nobody else would, and much of that self-purchase framing survives — which is why the buyer profile on this date differs so sharply from Chinese New Year or Qixi.",
        ],
      },
      {
        heading: "Why round only",
        body: [
          "This filter is narrowed to a single shape on purpose. The round brilliant is the only cut for which GIA and IGI issue an overall cut grade, making it the only shape where two stones from two sellers can be compared properly without either being in front of you.",
          "On a day whose entire logic is comparison, that is worth more than breadth. Every other shape has to be judged from polish, symmetry and proportions read individually, which is possible but is not like-for-like — and like-for-like is the whole exercise on the eleventh.",
        ],
      },
      {
        heading: "Why D to G, and a note on discounting",
        body: [
          "D to G is the band where colour stops being the deciding question and cut takes over. Within it, a buyer working from specifications is usually better served by an Excellent or Ideal cut grade at G than by a D with unremarkable proportions.",
          "There is no sale price here, because there is no list price to discount from. Stones are bought one at a time rather than as parcels and quoted individually against what they are. That holds on 11 November exactly as it does in June.",
        ],
      },
    ],
    brief: { shapes: "Round", colour: "D-G" },
    primary: { shapes: ["round"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...zh,
    slug: "mid-autumn",
    date: { kind: "lunar", rule: "农历八月十五，公历九月至十月之间" },
    title: "中秋钻石臻选 | 圆形，D–G",
    description:
      "中秋送礼的圆形裸钻，颜色 D 至 G 级。天然钻与培育钻均附独立鉴定证书，逐颗报价。",
    eyebrow: "中国 · 中秋",
    heading: "月圆，人也圆",
    standfirst:
      "中秋在农历八月十五，公历日期每年在九月到十月之间浮动。这是一年里仅次于春节的团圆节令，往来的礼数虽不及春节重，但见面的人一样多。",
    sections: [
      {
        heading: "圆的意思",
        body: [
          "中秋的核心意象是圆——月亮是圆的，月饼是圆的，「团圆」两个字里也有圆。这不是附会，而是这个节日一直以来的说法。在这个语境下选圆形钻石，理由几乎是现成的。",
          "这一天的礼以食物和家用为主，珠宝并不是常规选项，更多出现在同一周里正好还有别的由头的时候——一个整寿、一次退休，或者别的家里的大事。这一点不妨说清楚：中秋是次一级的珠宝节令，不像 520 或七夕那样是主场。",
        ],
      },
      {
        heading: "为什么只有圆形",
        body: [
          "除了寓意之外，还有实在的理由。圆形明亮式是唯一一种证书上带切工总评的形状，品质可以在纸面上核对，而不是只能靠说。在一份要拿给一大家子人看的礼物上，这一点有用。",
          "如果是做成一对耳钉，圆形也最容易配对——可以先按数值配好，再用眼睛确认。",
        ],
      },
      {
        heading: "为什么是 D–G",
        body: [
          "D 到 G 是肉眼看上去足够白的区间。不在 F 打住而是放宽到 G，可选的范围会大很多，省下的预算可以放到克拉重量或切工等级上，那才是真正看得见的地方。镶好之后，不把 F 和 G 并排放在一起，是分不出来的。",
        ],
      },
    ],
    brief: { shapes: "圆形", colour: "D–G" },
    primary: { shapes: ["round"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...en,
    slug: "mid-autumn-en",
    date: {
      kind: "lunar",
      rule: "The 15th day of the 8th lunar month, falling in September or October",
    },
    title: "Mid-Autumn Festival diamonds: round, D to G",
    description:
      "Round loose diamonds in D-G for the Mid-Autumn Festival, China's second largest family gathering. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "China · Mid-Autumn Festival, in English",
    heading: "The festival of the round moon",
    standfirst:
      "Mid-Autumn falls on the fifteenth day of the eighth lunar month, somewhere in September or October. After Chinese New Year it is the largest family gathering in the Chinese calendar, and its governing image is roundness.",
    sections: [
      {
        heading: "Roundness as the organising idea",
        body: [
          "The full moon is the point of the festival, mooncakes are round, and the word for family reunion, tuanyuan, contains the character for round. The association is explicit rather than incidental, and it runs through how the occasion is spoken about and marketed.",
          "That gives the round brilliant an unusually direct claim on this date, which is the main reason the filter here is narrowed to one shape.",
        ],
      },
      {
        heading: "Being straightforward about its scale",
        body: [
          "Mid-Autumn gifting is dominated by mooncakes, food hampers and corporate gift sets. Jewellery is not the standard gift, and it tends to appear where the week happens to coincide with something else: a significant birthday, a retirement, or another family milestone.",
          "It is on this list because the gathering and the gifting are both real, not because Mid-Autumn is a diamond occasion in the way that Qixi or 520 is. Treating it as a secondary occasion is the accurate reading.",
        ],
      },
      {
        heading: "Why round, and why D to G",
        body: [
          "Beyond the symbolism, there is a practical case. The round is the only cut carrying an overall cut grade on its report, so its quality can be shown on paper rather than asserted — useful for a gift that will be examined by an extended family. It is also the easiest shape to match into a pair.",
          "D to G keeps the stone visibly white while leaving budget for carat and cut, which are the things that actually register in wear. Once mounted, F and G cannot be told apart without being placed side by side.",
        ],
      },
    ],
    brief: { shapes: "Round", colour: "D-G" },
    primary: { shapes: ["round"], colors: ["D", "E", "F", "G"] },
  },
];
