import { EN, JA } from "./labels";
import type { Occasion } from "./types";

/**
 * Japan, in Japanese and in English.
 *
 * Two of these occasions invert what an English-speaking reader expects.
 * On 14 February women give to men, and 24 December is a romantic evening
 * rather than a family one — the English variants lead with that, the Japanese
 * ones take it as read.
 */

const ja = {
  region: "jp",
  lang: "ja",
  formatLocale: "ja-JP",
  variant: "native",
  labels: JA,
} as const;

const en = {
  region: "jp",
  lang: "en",
  formatLocale: "en-GB",
  variant: "en",
  labels: EN,
} as const;

export const JP_OCCASIONS: Occasion[] = [
  {
    ...ja,
    slug: "valentines-day",
    date: { kind: "fixed", month: 2, day: 14, rule: "2月14日" },
    title: "バレンタインに選ぶダイヤモンド｜ラウンド・クッション、Dカラーから",
    description:
      "バレンタインのご褒美ジュエリーに向けた、ラウンドとクッションのルースダイヤモンド。カラーはDからFの無色域。天然・ラボグロウンとも鑑定書付きで、一石ずつお見積りいたします。",
    eyebrow: "日本 · バレンタインデー",
    heading: "自分のために選ぶ、二月の一石",
    standfirst:
      "日本のバレンタインは、贈る日であると同時に、自分のために選ぶ日にもなりました。チョコレートの売り場の隣で、ご褒美としてジュエリーを求める方が年々増えています。仕事の区切りに、あるいは何の理由もなく。",
    sections: [
      {
        heading: "なぜラウンドとクッションなのか",
        body: [
          "ラウンドブリリアントは、研磨の善し悪しが数値で示される唯一のシェイプです。鑑定書にカット総合評価が記載されるため、実物を見る前に紙の上で比較できます。ご自身で選ばれる方にとって、これは何より扱いやすい条件です。",
          "クッションは、四隅の丸みと大きめのファセットが生む、やわらかな輝き方が持ち味です。ラウンドのような鋭い煌めきではなく、ゆっくりと光を返します。原石からの歩留まりがラウンドより良いため、同じ予算であれば一回り大きな石に手が届くことも少なくありません。",
        ],
      },
      {
        heading: "なぜDからFなのか",
        body: [
          "D・E・Fは無色に分類されるカラーグレードです。一石ずつ見比べても、枠に留めてしまえばこの三つを言い当てられる方はほとんどいません。ただ、この三つとニアカラーレス以下を並べたときの差は、どなたの目にもはっきりと見えます。",
          "日本で選ばれる地金はプラチナとホワイトゴールドが中心です。白い金属は石の色みを隠してくれませんので、無色域を選ぶ意味がもっとも大きく出ます。反対にイエローゴールドやピンクゴールドに留めるのであれば、Gカラーを選んで浮いた分をサイズや研磨に充てるという判断も十分に成り立ちます。",
        ],
      },
      {
        heading: "お求めの流れ",
        body: [
          "当店の石はパーセル買いではなく一石ずつの仕入れですので、お日にちに合わせてお取り置きが可能です。気になる石の参照番号をお知らせいただければ、鑑定書・画像・お値段をまとめてご返信いたします。",
        ],
      },
    ],
    brief: { shapes: "ラウンド、クッション", colour: "D〜F（無色）" },
    primary: { shapes: ["round", "cushion"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "valentines-day-en",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 February, fixed" },
    title: "Japanese Valentine's Day diamonds: round and cushion, D to F",
    description:
      "Round and cushion loose diamonds in D-F for the Japanese Valentine's Day, where the gifting convention runs the opposite way and self-purchase has grown around the date.",
    eyebrow: "Japan · Valentine's Day, in English",
    heading: "In Japan, women give on the fourteenth",
    standfirst:
      "Japanese Valentine's Day runs in the opposite direction to the Western one. On 14 February it is women who give, and what they traditionally give is chocolate. Men reciprocate a month later, on White Day. Understanding that inversion is the whole of understanding this market in February.",
    sections: [
      {
        heading: "The chocolate convention, and its categories",
        body: [
          "The gifts are formally categorised in a way that has no Western equivalent. Giri-choco, obligation chocolate, goes to colleagues and acquaintances as a social courtesy carrying no romantic meaning. Honmei-choco, true-feeling chocolate, goes to a partner or someone the giver hopes will become one, and is expected to be noticeably better.",
          "Tomo-choco between friends has grown steadily in recent years, while giri-choco has declined as workplaces have moved away from the obligation. None of this involves jewellery in the traditional pattern: on 14 February itself, jewellery is not what changes hands between couples.",
        ],
      },
      {
        heading: "Why the date still matters for diamonds",
        body: [
          "What has grown around it instead is go-hōbi, the reward for oneself. Self-purchase of jewellery by women in their thirties and forties clusters around this date, and the department stores now merchandise for it directly, siting fine jewellery beside the chocolate halls through early February.",
          "That is a genuinely different customer from a gift buyer. She is choosing for herself, she will keep the piece for decades, and she generally arrives already knowing what she is looking at. The filter here is built for her rather than for someone shopping for a present.",
        ],
      },
      {
        heading: "Why round and cushion, and D to F",
        body: [
          "The round is the only shape with an overall cut grade on its report, which makes it the easiest to buy well on specification without handling the stone. The cushion returns light more softly, with rounded corners and larger facets, and it yields better from the rough than a round does, so the same budget often reaches a larger stone.",
          "D to F is the colourless band, and it matters here because Japanese setting runs overwhelmingly to platinum. Platinum is the least forgiving metal for body colour: it gives a stone nowhere to hide warmth, which is exactly why the colourless grades are worth their premium in this market specifically.",
        ],
      },
    ],
    brief: { shapes: "Round and cushion", colour: "D-F, colourless" },
    primary: { shapes: ["round", "cushion"], colors: ["D", "E", "F"] },
  },
  {
    ...ja,
    slug: "white-day",
    date: { kind: "fixed", month: 3, day: 14, rule: "3月14日" },
    title: "ホワイトデーのお返しに選ぶダイヤモンド｜ラウンド・ハート",
    description:
      "ホワイトデーのお返しに向けた、ラウンドとハートシェイプのルースダイヤモンド。カラーはDからFの無色域。天然・ラボグロウンとも鑑定書付き、一石ずつお見積りいたします。",
    eyebrow: "日本 · ホワイトデー",
    heading: "三月十四日、お返しの一石",
    standfirst:
      "ホワイトデーは日本で生まれ、いまも日本と近隣のいくつかの国にしかない習慣です。お返しの品としてジュエリーが選ばれる割合は高く、とりわけ本命へのお返しでは、菓子ではなく身につけられるものが選ばれます。",
    sections: [
      {
        heading: "お返しに求められるもの",
        body: [
          "ホワイトデーのお返しには、いただいたものより少し良いものを、という感覚が根づいています。金額の多寡というより、選ぶのに手間をかけたことが伝わるかどうかが要になります。既製のセットではなく石から選ぶという行為そのものが、その手間の証しになります。",
          "もうひとつ、この日は三月十四日という日付が動かないことも効いています。二月十四日からちょうど一か月。準備の時間は十分にありますので、慌てて選ぶ必要はありません。",
        ],
      },
      {
        heading: "なぜラウンドとハートなのか",
        body: [
          "ラウンドは、お返しとしてもっとも外れのないシェイプです。カット総合評価が鑑定書に載る唯一の形ですから、紙の上で品質を確かめてから選べます。将来ペンダントから指輪へ、といった仕立て直しにも無理なく応じます。",
          "ハートシェイプは、意図をはっきりと伝えたいときの選択です。ただし研磨の良し悪しがもっとも表に出る形でもあります。左右のふくらみが揃っているか、中央のくぼみが鋭く入っているか、輪郭が中心線に対して対称か。鑑定書のシンメトリー評価と、実物の画像の両方でご確認ください。",
        ],
      },
      {
        heading: "なぜDからFなのか",
        body: [
          "D・E・Fは無色域のカラーグレードです。贈り物として人の目に触れる機会が多いものほど、この域を選んでおく意味があります。プラチナ台であればなおさらで、白い地金は石の色みをまったく隠してくれません。",
        ],
      },
    ],
    brief: { shapes: "ラウンド、ハート", colour: "D〜F（無色）" },
    primary: { shapes: ["round", "heart"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "white-day-en",
    date: { kind: "fixed", month: 3, day: 14, rule: "14 March, fixed" },
    title: "White Day diamonds: round and heart, D to F",
    description:
      "Round and heart loose diamonds in D-F for White Day on 14 March, the Japanese reciprocal gifting date where jewellery is among the most common returns.",
    eyebrow: "Japan · White Day, in English",
    heading: "The reciprocal date, one month later",
    standfirst:
      "White Day is a Japanese invention with no Western equivalent. Exactly one month after Valentine's Day, on 14 March, the men who received chocolate in February are expected to return the gesture — and jewellery is one of the most common things they return it with.",
    sections: [
      {
        heading: "Where the date came from",
        body: [
          "White Day was created by the Japanese confectionery industry in the 1970s to complete the exchange that Valentine's Day had left one-sided, and the name comes from the white chocolate and marshmallow originally sold for it. It has since spread to South Korea, Taiwan and China, and essentially nowhere else.",
          "What began as confectionery has broadened considerably. For a return to a partner rather than a colleague, the expectation now runs to something kept rather than something eaten, and fine jewellery sits at the top of that range.",
        ],
      },
      {
        heading: "The convention of returning more",
        body: [
          "There is an established expectation, sometimes called sanbai-gaeshi or triple return, that the reciprocal gift should exceed what was received. The multiplier is not taken literally, but the principle behind it is real: returning something obviously lesser reads badly, and returning something visibly considered reads well.",
          "The effect on jewellery buying is that this date, rather than 14 February, is the one where a man in Japan is most likely to be buying a diamond. It is also a date fixed to the calendar, so there is a clear month of preparation between the two.",
        ],
      },
      {
        heading: "Why round and heart, and D to F",
        body: [
          "The round is the safe and adaptable choice, the only shape with a published cut standard, and the easiest to reset later if the piece is remade. The heart states the intention openly, which suits a honmei return, but it is the least forgiving shape to buy: matched lobes, a clean cleft and an outline symmetrical about its centre are all essential, and all visible in images.",
          "D to F is the colourless band, and it earns its premium in a market that sets almost everything in platinum. White metal gives body colour nowhere to hide, so the grades that would be indistinguishable in yellow gold are not indistinguishable here.",
        ],
      },
    ],
    brief: { shapes: "Round and heart", colour: "D-F, colourless" },
    primary: { shapes: ["round", "heart"], colors: ["D", "E", "F"] },
  },
  {
    ...ja,
    slug: "christmas-eve",
    date: { kind: "fixed", month: 12, day: 24, rule: "12月24日" },
    title: "クリスマスイブのプロポーズに｜ラウンド・オーバル、Dカラーから",
    description:
      "クリスマスイブのプロポーズと贈り物に向けた、ラウンドとオーバルのルースダイヤモンド。カラーはDからFの無色域。天然・ラボグロウンとも鑑定書付きです。",
    eyebrow: "日本 · クリスマスイブ",
    heading: "一年でいちばん、指輪が開けられる夜",
    standfirst:
      "日本のクリスマスイブは、家族で過ごす日ではなく、恋人と過ごす夜です。プロポーズの日として十二月二十四日を選ぶ方は多く、この一夜に向けて動く指輪の数は年間のどの日よりも多くなります。",
    sections: [
      {
        heading: "イブに間に合わせるということ",
        body: [
          "この日に照準を合わせる場合、制約になるのは石ではなく仕立てです。ルースそのものは短い期間でご用意できますが、枠に留めて仕上げるには相応の日数がかかり、しかも十二月は工房がもっとも立て込む時期にあたります。",
          "確実な進め方は、先に石を押さえてしまうことです。参照番号でお取り置きしたうえで、枠のご相談をゆっくり進めていただくのが結果として早く、選択肢も広く残ります。",
        ],
      },
      {
        heading: "なぜラウンドとオーバルなのか",
        body: [
          "ラウンドは婚約指輪の基準となるシェイプです。プロポーションの国際基準が定められている唯一の形で、鑑定書のカット評価がそのまま品質の目安になります。将来仕立て直すことになっても、まず困ることがありません。",
          "オーバルは、同じカラット数でもより大きく見えるシェイプです。重さが縦方向に配分されるぶん、上から見た面積が広く、指を長く見せる効果もあります。日本の手のサイズに対して、一カラット未満でも十分な存在感が出るという点で、近年とくに支持を集めています。",
        ],
      },
      {
        heading: "オーバルで一点だけ確かめること",
        body: [
          "オーバルには必ずボウタイと呼ばれる、中央を横切る暗い帯が出ます。ファセットの配置から生じるもので、あるかないかではなく、目立つか目立たないかの問題です。そしてこれは鑑定書には記載されません。気になる石の画像をご請求ください。ひと目で分かります。",
        ],
      },
    ],
    brief: { shapes: "ラウンド、オーバル", colour: "D〜F（無色）" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "christmas-eve-en",
    date: { kind: "fixed", month: 12, day: 24, rule: "24 December, fixed" },
    title: "Japanese Christmas Eve diamonds: round and oval, D to F",
    description:
      "Round and oval loose diamonds in D-F for Christmas Eve in Japan, the country's largest proposal night. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "Japan · Christmas Eve, in English",
    heading: "Japan's biggest proposal night is 24 December",
    standfirst:
      "Christmas in Japan is not a family festival and it is not a religious one. It is a romantic evening, and Christmas Eve specifically is the most significant date night in the Japanese year — the night on which more proposals are made than on any other.",
    sections: [
      {
        heading: "How Christmas became a couples' night",
        body: [
          "Japan has no large Christian population, so Christmas arrived as a commercial and social occasion without the family obligations attached to it elsewhere. What it acquired instead, from the 1980s onwards, was a firm association with couples: a dinner reservation, an illumination, and a hotel room booked months ahead.",
          "The result inverts the Western pattern completely. Where 25 December in Europe or America means family, in Japan the 24th means a partner, and the 25th is comparatively quiet. New Year, not Christmas, is the family occasion in the Japanese calendar.",
        ],
      },
      {
        heading: "What that means for buying",
        body: [
          "This is the single most concentrated proposal date in the country, and the constraint on it is workshop capacity rather than stone availability. A loose stone can be confirmed quickly; a finished ring in the second half of December cannot.",
          "The reliable sequence is to reserve the stone first and let the setting follow. That leaves the widest choice of stones and takes the finishing work out of the worst congested fortnight of the year.",
        ],
      },
      {
        heading: "Why round and oval",
        body: [
          "The round is the benchmark for an engagement stone, the only shape with a published proportion standard, and the most straightforward to reset if the ring is ever remade.",
          "The oval reads larger than a round of the same weight because the weight is distributed along a longer outline, and it elongates the finger — which has made it particularly popular in a market where a well-cut stone under one carat is entirely normal. One caveat: every oval carries a bow-tie across its centre, no report records it, and it is immediately visible in images.",
        ],
      },
    ],
    brief: { shapes: "Round and oval", colour: "D-F, colourless" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F"] },
  },
  {
    ...ja,
    slug: "seijin-no-hi",
    date: { kind: "computed", id: "jp-seijin-no-hi", rule: "1月の第2月曜日" },
    title: "成人の日の贈り物に｜ラウンド・プリンセス、無色のダイヤモンド",
    description:
      "成人の日の記念に贈るルースダイヤモンド。ラウンドとプリンセスカット、カラーはDからFの無色域。天然・ラボグロウンとも鑑定書付きで、一石ずつお見積りいたします。",
    eyebrow: "日本 · 成人の日",
    heading: "一度きりの日に、長く残るものを",
    standfirst:
      "成人の日は一月の第二月曜日。振袖と写真のほかに、その日を覚えておくためのものを贈りたいというご相談を、毎年この時期にいただきます。十年、二十年と身につけられるものであれば、なおさらです。",
    sections: [
      {
        heading: "最初の一石として",
        body: [
          "成人の記念は、多くの方にとって初めて本格的な宝石を持つ機会になります。だからこそ、流行に寄りすぎない形を選んでおくほうが長く使えます。二十歳で贈られたものが三十代、四十代でも違和感なく身につけられるかどうか。その一点で選んで差し支えありません。",
          "仕立てについても同じことが言えます。ルースでお求めいただき、まずはシンプルなペンダントに。指輪が似合う年齢になってから留め直す。そうした持ち方ができるのが、石から選ぶことの利点です。",
        ],
      },
      {
        heading: "なぜラウンドとプリンセスなのか",
        body: [
          "ラウンドは、五十年後も古びない唯一のシェイプと言って差し支えありません。プロポーションの国際基準があり、鑑定書のカット評価で品質が確かめられます。仕立て直しにも制約がありません。",
          "プリンセスカットは、四角い輪郭にブリリアントの輝きを収めた形です。直線的な意匠とよく合い、振袖の帯や小物の直線とも響き合います。原石からの歩留まりが良いため、同じご予算でひと回り大きな石を選びやすいという実際的な利点もあります。",
        ],
      },
      {
        heading: "無色域を選ぶ理由と、プリンセスの注意点",
        body: [
          "カラーはDからFの無色域をお勧めしています。長く持つものほど、後から色みが気になりはじめるためです。プラチナ台であれば白い地金が色みを隠しませんので、この域を選んでおく意味がはっきりと出ます。",
          "プリンセスカットで一点だけ。四隅は石のもっとも薄い部分で、日常の使用で欠けやすい箇所です。指輪に仕立てる場合は、四つの角それぞれに爪がかかる枠をお選びください。",
        ],
      },
    ],
    brief: { shapes: "ラウンド、プリンセス", colour: "D〜F（無色）" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "seijin-no-hi-en",
    date: { kind: "computed", id: "jp-seijin-no-hi", rule: "Second Monday in January" },
    title: "Seijin no Hi diamonds: round and princess, near-colourless D to F",
    description:
      "Round and princess loose diamonds in D-F for Seijin no Hi, the Japanese Coming of Age Day on the second Monday in January. Filtered and ready to enquire on.",
    eyebrow: "Japan · Coming of Age Day, in English",
    heading: "One day, marked once in a lifetime",
    standfirst:
      "Seijin no Hi, Coming of Age Day, falls on the second Monday in January and marks the year in which a person reaches adulthood. It is a national holiday, it happens once, and the gifts given around it are chosen to last.",
    sections: [
      {
        heading: "What the day involves",
        body: [
          "Municipalities hold formal ceremonies for everyone in the relevant age cohort, and attendance is a significant social occasion in its own right. Young women overwhelmingly wear furisode, the long-sleeved kimono worn only before marriage, frequently hired or handed down, and the day is heavily photographed.",
          "The age of majority in Japan was lowered from twenty to eighteen in 2022, but the ceremonies have largely stayed with the twenty-year-old cohort, since twenty remains the age at which drinking and smoking become legal. In practice the occasion is still built around turning twenty.",
        ],
      },
      {
        heading: "Why jewellery, and what kind",
        body: [
          "Accessories are given alongside the furisode, and for many recipients this is the first serious piece of jewellery they own. That shapes the brief more than the ceremony does: the piece has to still make sense when the recipient is forty, which argues against anything closely tied to a current fashion.",
          "Buying a loose stone suits this particularly well. It can be set simply now, as a pendant, and reset into a ring later when that suits the wearer better. The stone is the part that lasts; the setting is the part that can change.",
        ],
      },
      {
        heading: "Why round and princess, and D to F",
        body: [
          "The round is the one shape that will not date, with a published proportion standard and no constraints on later resetting. The princess holds brilliant faceting inside a square outline, which sits well against the strong straight lines of formal dress, and it yields better from the rough so the same budget generally reaches a larger stone.",
          "D to F is the colourless band, and for a piece intended to be kept for decades it is the safer place to be: body colour tends to become more noticeable to an owner over time, not less. If the stone is a princess, choose a setting with a prong over each of the four corners, which are the thinnest and most chip-prone part of the cut.",
        ],
      },
    ],
    brief: { shapes: "Round and princess", colour: "D-F, near-colourless" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F"] },
  },
];
