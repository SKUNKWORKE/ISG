import { EN, KO } from "./labels";
import type { Occasion } from "./types";

/**
 * South Korea, in Korean and in English.
 *
 * White Day is the one occasion in the whole set whose brief cannot be spent on
 * a single filter: fancy pink and colourless D-F are mutually exclusive in the
 * catalogue, because a white stone has no hue to match. It is offered as two
 * links rather than one filter that would quietly return only the pinks.
 */

const ko = {
  region: "kr",
  lang: "ko",
  formatLocale: "ko-KR",
  variant: "native",
  labels: KO,
} as const;

const en = {
  region: "kr",
  lang: "en",
  formatLocale: "en-GB",
  variant: "en",
  labels: EN,
} as const;

export const KR_OCCASIONS: Occasion[] = [
  {
    ...ko,
    slug: "valentines-day",
    date: { kind: "fixed", month: 2, day: 14, rule: "2월 14일" },
    title: "발렌타인데이 다이아몬드 | 라운드, D–F 컬러",
    description:
      "발렌타인데이를 위한 라운드 브릴리언트 나석 다이아몬드. 컬러는 무색 등급인 D부터 F까지. 천연·랩그로운 모두 감정서와 함께 한 알씩 견적해 드립니다.",
    eyebrow: "대한민국 · 발렌타인데이",
    heading: "2월 14일, 여성이 건네는 날",
    standfirst:
      "한국의 발렌타인데이는 여성이 남성에게 마음을 전하는 날입니다. 초콜릿이 기본이지만, 오래 두고 쓸 것을 함께 건네고 싶을 때 선택지는 달라집니다. 그리고 한 달 뒤 화이트데이에 답이 돌아옵니다.",
    sections: [
      {
        heading: "왜 라운드 한 가지인가",
        body: [
          "이 페이지의 필터는 의도적으로 한 가지 셰이프로 좁혀 두었습니다. 라운드 브릴리언트는 감정서에 컷 종합 등급이 기재되는 유일한 셰이프이기 때문입니다. 실물을 보기 전에 서류만으로 품질을 비교할 수 있다는 뜻입니다.",
          "남성용으로 커프스나 타이택, 또는 심플한 펜던트에 세팅하는 경우에도 라운드가 가장 무난합니다. 훗날 다시 세팅을 바꾸더라도 제약이 없고, 어떤 디자인에도 어울립니다.",
        ],
      },
      {
        heading: "왜 D–F 컬러인가",
        body: [
          "D·E·F는 무색으로 분류되는 등급입니다. 세팅을 마친 뒤에는 이 셋을 구분해 낼 수 있는 분이 거의 없지만, 이 구간과 그 아래 구간을 나란히 놓으면 차이는 누구 눈에나 보입니다.",
          "국내에서 선호되는 금속은 플래티넘과 화이트골드입니다. 흰 금속은 돌의 색기를 가려 주지 않기 때문에, 무색 구간을 고르는 의미가 가장 크게 드러납니다. 반대로 옐로골드나 로즈골드에 세팅한다면 G 컬러를 고르고 남는 예산을 크기나 연마에 쓰는 편이 합리적일 수 있습니다.",
        ],
      },
      {
        heading: "주문 절차",
        body: [
          "저희는 파셀 단위가 아니라 한 알씩 매입하기 때문에 원하시는 날짜에 맞춰 보류가 가능합니다. 참조번호를 보내 주시면 감정서와 이미지, 가격을 함께 회신해 드립니다.",
        ],
      },
    ],
    brief: { shapes: "라운드", colour: "D–F (무색)" },
    primary: { shapes: ["round"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "valentines-day-en",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 February, fixed" },
    title: "Korean Valentine's Day diamonds: round, D to F",
    description:
      "Round loose diamonds in D-F for Valentine's Day in South Korea, where women give and men reciprocate on White Day a month later. Filtered and ready to enquire on.",
    eyebrow: "South Korea · Valentine's Day, in English",
    heading: "The giving runs one way in February",
    standfirst:
      "As in Japan, Valentine's Day in South Korea is the day women give to men. Chocolate is the convention, the reciprocal gift comes on White Day a month later, and the pattern is close enough to the Japanese one that the two are often described together — though Korea has added a good deal of its own.",
    sections: [
      {
        heading: "One date in a very full calendar",
        body: [
          "Korea marks the fourteenth of every month as a couples' occasion of some kind. February is Valentine's Day and March is White Day; April is Black Day, when those who received nothing on either eat jajangmyeon together; there is a Rose Day in May, a Kiss Day in June, and so on through the year.",
          "Most of these are light-hearted and commercially thin. February and March are the two that carry real spending, and of the two it is March, when men reciprocate, that moves the most jewellery.",
        ],
      },
      {
        heading: "Why round only",
        body: [
          "The filter here is narrowed to a single shape deliberately. The round brilliant is the only cut for which the laboratories issue an overall cut grade, which makes it the only shape where two stones can be properly compared on paper rather than by eye.",
          "It is also the most adaptable. Whether the stone ends up in a pendant, a pair of cufflinks or a tie tack, a round works, and it resets into anything later without complication.",
        ],
      },
      {
        heading: "Why D to F",
        body: [
          "D, E and F are the colourless grades, hard to separate individually once mounted but clearly whiter as a band than anything below them when two stones sit side by side.",
          "Korean setting runs strongly to platinum and white gold, and white metal is where that difference actually shows, because it gives a stone nowhere to conceal warmth. In yellow or rose gold the argument weakens and the money is usually better spent on size or cut.",
        ],
      },
    ],
    brief: { shapes: "Round", colour: "D-F, colourless" },
    primary: { shapes: ["round"], colors: ["D", "E", "F"] },
  },
  {
    ...ko,
    slug: "white-day",
    date: { kind: "fixed", month: 3, day: 14, rule: "3월 14일" },
    title: "화이트데이 다이아몬드 | 오벌·하트, 팬시 핑크와 무색",
    description:
      "화이트데이 답례 선물을 위한 오벌과 하트 셰이프 나석 다이아몬드. 팬시 핑크 컬러와 무색 D–F 두 가지로 보실 수 있습니다. 천연·랩그로운 모두 감정서 포함.",
    eyebrow: "대한민국 · 화이트데이",
    heading: "3월 14일, 답례가 돌아오는 날",
    standfirst:
      "화이트데이는 한국에서 남성이 여성에게 답례하는 날이며, 주얼리가 가장 자주 선택되는 날이기도 합니다. 2월에 받은 것보다 더 갖추어 답하는 것이 관례이고, 그래서 이 날 움직이는 다이아몬드는 발렌타인데이보다 훨씬 많습니다.",
    sections: [
      {
        heading: "팬시 핑크, 또는 무색",
        body: [
          "이 날에 어울리는 선택지는 두 갈래입니다. 하나는 팬시 핑크 다이아몬드입니다. 색이 곧 메시지가 되기 때문에 설명이 따로 필요 없고, 흔치 않다는 점 자체가 답례의 무게를 대신합니다.",
          "다른 하나는 무색 D–F 구간입니다. 색으로 말하는 대신 품질로 말하는 쪽이며, 어떤 디자인에도 무리 없이 들어가고 오래 두고 보아도 질리지 않습니다. 아래 버튼은 팬시 핑크를, 본문 아래의 링크는 무색 구간을 각각 따로 보여 드립니다.",
        ],
      },
      {
        heading: "왜 오벌과 하트인가",
        body: [
          "오벌은 같은 캐럿이라도 더 커 보이는 셰이프입니다. 무게가 길이 방향으로 배분되어 위에서 본 면적이 넓고, 손가락을 길어 보이게 합니다. 1캐럿 미만에서도 충분한 존재감이 나오기 때문에 국내에서 특히 선호됩니다.",
          "하트는 뜻을 분명히 전하고 싶을 때의 선택입니다. 다만 연마의 완성도가 가장 드러나는 형태이기도 합니다. 좌우 볼륨이 같은지, 가운데 홈이 또렷한지, 윤곽이 중심선을 기준으로 대칭인지 — 감정서의 시메트리 등급과 실물 이미지를 함께 확인하시기 바랍니다.",
        ],
      },
      {
        heading: "팬시 컬러에 대해 한 가지",
        body: [
          "팬시 컬러 다이아몬드는 무색 등급과 완전히 다른 기준으로 평가됩니다. D–Z 척도가 아니라 색조와 채도, 농도로 나뉘며, 같은 핑크라도 등급에 따라 가격 차이가 매우 큽니다. 재고와 시세가 수시로 바뀌므로 관심 있는 석의 참조번호를 알려 주시면 정확히 안내해 드리겠습니다.",
        ],
      },
    ],
    brief: { shapes: "오벌, 하트", colour: "팬시 핑크 / D–F" },
    primary: { shapes: ["oval", "heart"], fancyHue: "Pink" },
    secondary: {
      filter: { shapes: ["oval", "heart"], colors: ["D", "E", "F"] },
      label: "무색 D–F로 보기",
      note: "색으로 말하는 대신 품질로 답하고 싶으시다면, 같은 두 셰이프를 무색 D–F 구간에서 보실 수 있습니다. 팬시 컬러와 무색은 서로 다른 기준으로 매겨지기 때문에 목록도 따로 나뉩니다.",
    },
  },
  {
    ...en,
    slug: "white-day-en",
    date: { kind: "fixed", month: 3, day: 14, rule: "14 March, fixed" },
    title: "Korean White Day diamonds: oval and heart, fancy pink or D to F",
    description:
      "Oval and heart loose diamonds for White Day in South Korea, offered as fancy pink or as colourless D-F. The reciprocal date where jewellery is the most common return.",
    eyebrow: "South Korea · White Day, in English",
    heading: "The date that actually moves the jewellery",
    standfirst:
      "White Day, on 14 March, is when Korean men reciprocate what they received a month earlier — and the convention is to return something more considerable than what was given. It is the larger of the two dates by a distance, and jewellery is the most common thing returned.",
    sections: [
      {
        heading: "Reciprocity, and the expectation attached to it",
        body: [
          "The date was imported from Japan, where the confectionery industry created it in the 1970s, but Korea has made rather more of it. The underlying expectation, that the return should exceed what was received, is taken seriously enough to have pushed the occasion well beyond confectionery and into jewellery.",
          "It is also embedded in an unusually dense calendar: Korea marks the fourteenth of every month as a couples' occasion of some description. Most are trivial, and April's Black Day, for those who received nothing in either February or March, is largely a joke. March is the one that carries real weight.",
        ],
      },
      {
        heading: "Two different answers: pink, or colourless",
        body: [
          "A fancy pink diamond states the occasion through its colour, and rarity does the rest of the work. Fancy colours are graded on an entirely separate system from the white scale — by hue, tone and saturation rather than by letter — and prices vary enormously between grades of what is loosely called pink.",
          "Colourless D to F is the other answer, speaking through quality rather than colour, and it goes into any design without argument. These are offered as two separate links rather than one because they genuinely are two different markets: a stone is graded on one scale or the other, never both, so a single filter could not honestly show you both at once.",
        ],
      },
      {
        heading: "Why oval and heart",
        body: [
          "The oval reads larger than a round of the same weight, since the weight is distributed along a longer outline, and it elongates the finger. That makes it a strong choice in a market where well-cut stones under one carat are entirely normal. Every oval carries a bow-tie across its centre, though, which no report records — ask for images.",
          "The heart states the intention openly and suits the occasion, but it is the least forgiving cut to buy. Matched lobes, a clean cleft and a symmetrical outline are all essential, and all of them are visible in photographs before you commit.",
        ],
      },
    ],
    brief: { shapes: "Oval and heart", colour: "Fancy pink, or D-F" },
    primary: { shapes: ["oval", "heart"], fancyHue: "Pink" },
    secondary: {
      filter: { shapes: ["oval", "heart"], colors: ["D", "E", "F"] },
      label: "See colourless D-F instead",
      note: "If quality rather than colour is the message, the same two shapes are available in the colourless D-F band. Fancy and white stones are graded on separate scales, so the two lists are necessarily separate.",
    },
  },
  {
    ...ko,
    slug: "couple-anniversaries",
    date: { kind: "evergreen", rule: "100일, 200일, 1000일 — 만난 날로부터 셉니다" },
    title: "100일·1000일 기념 다이아몬드 | 라운드·오벌, D–F",
    description:
      "커플 기념일을 위한 라운드와 오벌 나석 다이아몬드. 컬러는 무색 D–F 구간. 천연·랩그로운 모두 감정서와 함께 한 알씩 견적해 드립니다.",
    eyebrow: "대한민국 · 100일 · 1000일 기념일",
    heading: "날짜를 세는 관계",
    standfirst:
      "한국에서 커플은 만난 날로부터 날짜를 셉니다. 100일, 200일, 그리고 1000일. 달력에 고정된 날이 아니라 두 사람만의 날이기 때문에, 준비할 시간을 정확히 알 수 있다는 점이 오히려 장점이 됩니다.",
    sections: [
      {
        heading: "1000일이라는 기준",
        body: [
          "100일은 가볍게, 200일과 300일은 그보다 조금 더. 그러다 1000일에 이르면 성격이 달라집니다. 만 2년 9개월에 가까운 시간이고, 이 시점에 커플링을 넘어서는 반지가 오가는 일이 드물지 않습니다. 실제로 청혼으로 이어지는 경우도 많습니다.",
          "무엇보다 이 날짜들은 미리 알 수 있습니다. 크리스마스나 발렌타인데이처럼 모두가 한꺼번에 몰리는 날이 아니므로, 공방이 붐비지 않는 시기에 여유 있게 맞출 수 있습니다. 급하게 고르지 않아도 된다는 것은 생각보다 큰 차이입니다.",
        ],
      },
      {
        heading: "왜 라운드와 오벌인가",
        body: [
          "라운드는 기준이 되는 셰이프입니다. 프로포션의 국제 기준이 정해진 유일한 형태이고, 감정서의 컷 등급으로 품질을 확인할 수 있습니다. 나중에 세팅을 바꾸더라도 제약이 없습니다.",
          "오벌은 같은 무게로 더 큰 면적을 냅니다. 위에서 본 크기가 넓고 손가락을 길어 보이게 하므로, 예산이 정해져 있고 존재감이 중요할 때 가장 효율이 좋은 선택입니다.",
        ],
      },
      {
        heading: "미리 준비하는 편이 낫습니다",
        body: [
          "나석은 비교적 빠르게 준비되지만 세팅에는 시간이 걸립니다. 날짜가 정해져 있다면 먼저 석을 참조번호로 보류해 두시고, 디자인은 그다음에 정하셔도 늦지 않습니다. 오벌은 중앙을 가로지르는 보타이가 반드시 있으니 이미지로 확인하시기 바랍니다.",
        ],
      },
    ],
    brief: { shapes: "라운드, 오벌", colour: "D–F (무색)" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "couple-anniversaries-en",
    date: { kind: "evergreen", rule: "100, 200 and 1,000 days, counted from the day the couple met" },
    title: "Korean 100-day and 1,000-day anniversary diamonds: round and oval, D to F",
    description:
      "Round and oval loose diamonds in D-F for Korean couple milestones, counted in days from the start of the relationship rather than fixed to the calendar.",
    eyebrow: "South Korea · Couple anniversaries, in English",
    heading: "Relationships counted in days, not years",
    standfirst:
      "Korean couples count their relationship in days from the date they started seeing each other, and mark the round numbers. The hundredth day is the first milestone; the thousandth is the one that matters. Neither is fixed to the calendar, which changes how you buy for them.",
    sections: [
      {
        heading: "How the milestones work",
        body: [
          "The count starts on day one, the day the relationship began, and the hundredth day arrives a little over three months later. It is marked, usually modestly. Two hundred and three hundred follow the same pattern with diminishing ceremony.",
          "The thousandth day is different in kind. It falls at roughly two years and nine months, it signals a relationship that has become serious, and it is a common point for a ring that is not merely a couple ring. A proportion of these milestones turn into proposals.",
        ],
      },
      {
        heading: "Why an unfixed date is an advantage",
        body: [
          "Every other occasion on this site competes with everyone else buying for the same day. These do not. The date is specific to one couple, it is known months ahead, and it almost never coincides with the congested periods in a workshop's year.",
          "That means the whole sequence can be done properly: compare two or three stones, look at images, have the setting made without compressing the schedule. It is the least pressured buying window in this entire calendar.",
        ],
      },
      {
        heading: "Why round and oval, and D to F",
        body: [
          "The round is the benchmark, the only cut with a published proportion standard, and the easiest to reset later. The oval covers more of the finger per carat because its weight is spread along a longer outline, so it reads larger at the same weight — subject to checking the bow-tie across its centre, which appears on no report and is obvious in any image.",
          "D to F is the colourless band. For a piece that marks a specific relationship and will be worn indefinitely, it is the grade range least likely to be second-guessed later, particularly in the platinum and white gold this market prefers.",
        ],
      },
    ],
    brief: { shapes: "Round and oval", colour: "D-F, colourless" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F"] },
  },
  {
    ...ko,
    slug: "seongin-ui-nal",
    date: { kind: "computed", id: "kr-seongin-ui-nal", rule: "5월 셋째 월요일" },
    title: "성년의 날 다이아몬드 | 라운드, D–F 컬러",
    description:
      "성년의 날 선물을 위한 라운드 브릴리언트 나석 다이아몬드. 컬러는 무색 D–F 구간. 천연·랩그로운 모두 감정서와 함께 한 알씩 견적해 드립니다.",
    eyebrow: "대한민국 · 성년의 날",
    heading: "장미, 향수, 그리고 반지",
    standfirst:
      "성년의 날은 5월 셋째 월요일입니다. 스무 살이 되는 해에 맞는 하루이고, 장미 스무 송이 또는 백 송이와 향수, 그리고 반지가 전통적인 선물 구성으로 이야기되어 왔습니다.",
    sections: [
      {
        heading: "세 가지 선물",
        body: [
          "장미는 열정을, 향수는 기억을, 입맞춤은 책임을 뜻한다고들 합니다. 여기에 반지가 더해지는 구성이 오래 이야기되어 왔고, 앞의 두 가지가 그 계절에 사라지는 것과 달리 반지는 남습니다.",
          "그래서 이 날의 선물은 유행을 타지 않는 쪽이 낫습니다. 스무 살에 받은 것을 서른, 마흔에도 무리 없이 낄 수 있는지 — 그 한 가지 기준으로 고르셔도 충분합니다.",
        ],
      },
      {
        heading: "왜 라운드 한 가지인가",
        body: [
          "라운드 브릴리언트는 오십 년이 지나도 낡지 않는 유일한 셰이프라고 해도 무리가 없습니다. 프로포션의 국제 기준이 있고, 감정서의 컷 종합 등급으로 품질을 확인할 수 있는 유일한 형태이기도 합니다.",
          "세팅을 바꾸기에도 가장 자유롭습니다. 처음에는 단순한 펜던트로, 나중에 반지로 다시 물릴 수 있습니다. 나석으로 구입하시는 이점이 바로 여기에 있습니다.",
        ],
      },
      {
        heading: "왜 D–F인가",
        body: [
          "오래 두고 쓸 것일수록 무색 구간을 권해 드립니다. 색기는 시간이 지날수록 눈에 덜 띄는 것이 아니라 오히려 더 신경 쓰이게 되는 쪽입니다. 플래티넘이나 화이트골드에 세팅한다면 흰 금속이 색기를 가려 주지 않으므로 더욱 그렇습니다.",
        ],
      },
    ],
    brief: { shapes: "라운드", colour: "D–F (무색)" },
    primary: { shapes: ["round"], colors: ["D", "E", "F"] },
  },
  {
    ...en,
    slug: "seongin-ui-nal-en",
    date: { kind: "computed", id: "kr-seongin-ui-nal", rule: "Third Monday in May" },
    title: "Seongin-ui-nal diamonds: round, D to F",
    description:
      "Round loose diamonds in D-F for the Korean Coming of Age Day, the third Monday in May, where a ring is part of the traditional gift set. Filtered and ready to enquire on.",
    eyebrow: "South Korea · Coming of Age Day, in English",
    heading: "A ring is part of the traditional set",
    standfirst:
      "Seongin-ui-nal, Korea's Coming of Age Day, falls on the third Monday in May for those turning twenty. Unusually among coming-of-age occasions anywhere, the conventional gift is specified almost to the item — and one of those items is a ring.",
    sections: [
      {
        heading: "The three gifts",
        body: [
          "The traditional set is roses, perfume and a kiss, with a ring frequently added as the fourth and most lasting element. The roses are usually twenty, one for each year, or a hundred for emphasis. Each element is held to stand for something: passion, memory, and responsibility respectively.",
          "It is a lighter, more romantic occasion than the Japanese Seijin no Hi, with less institutional ceremony attached — no municipal ceremony, no formal dress. The gifts come from a partner, a family member or a close friend rather than from the state.",
        ],
      },
      {
        heading: "What lasts out of that set",
        body: [
          "Two of the three conventional gifts are gone within a season. The ring is the part that stays, which puts it under a different standard: it needs to make sense to the recipient at forty as well as at twenty.",
          "That argues against anything tied closely to a current style, and in favour of buying the stone rather than a finished piece. A loose stone can be set simply now and reset into something else entirely in ten years, and the stone is the part that holds its value through that.",
        ],
      },
      {
        heading: "Why round only, and D to F",
        body: [
          "The filter is narrowed to one shape on purpose. The round brilliant is the only cut with a published proportion standard and an overall cut grade on the report, which makes it both the easiest to buy well and the one least likely to look dated in twenty years. It also resets into anything without complication.",
          "D to F is the colourless band, and for a piece meant to be kept indefinitely it is the safer choice: body colour tends to become more noticeable to an owner over time rather than less, particularly in the platinum and white gold that dominate Korean setting.",
        ],
      },
    ],
    brief: { shapes: "Round", colour: "D-F, colourless" },
    primary: { shapes: ["round"], colors: ["D", "E", "F"] },
  },
  {
    ...ko,
    slug: "parents-day",
    date: { kind: "fixed", month: 5, day: 8, rule: "5월 8일" },
    title: "어버이날 다이아몬드 | 라운드, D–G 컬러",
    description:
      "어버이날 선물을 위한 라운드 나석 다이아몬드. 컬러는 D부터 G까지. 천연·랩그로운 모두 감정서와 함께 한 알씩 견적해 드립니다.",
    eyebrow: "대한민국 · 어버이날",
    heading: "5월 8일, 카네이션 다음의 선물",
    standfirst:
      "한국에서는 어머니날과 아버지날을 따로 두지 않고 5월 8일 하루에 함께 기립니다. 카네이션이 기본이지만, 그 위에 무엇을 더할지 고민하시는 분들을 위한 페이지입니다.",
    sections: [
      {
        heading: "매일 착용할 수 있는 것",
        body: [
          "이 날의 선물은 아껴 두었다가 특별한 자리에만 꺼내는 물건보다, 매일 착용할 수 있는 쪽이 오래 쓰입니다. 귀에 다는 한 쌍, 단순한 펜던트, 혹은 오른손에 끼는 반지 정도가 실제로 가장 오래 사용됩니다.",
          "5월은 가정의 달이라 불릴 만큼 행사가 몰리는 시기입니다. 어린이날과 어버이날, 그리고 성년의 날이 같은 달에 있으니, 준비는 조금 일찍 시작하시는 편이 좋습니다.",
        ],
      },
      {
        heading: "왜 라운드 한 가지인가",
        body: [
          "귀걸이처럼 두 알을 맞춰야 하는 경우, 라운드가 압도적으로 유리합니다. 감정서에 컷 종합 등급이 기재되는 유일한 셰이프이기 때문에, 눈으로 맞추기 전에 서류로 맞출 수 있습니다. 두 알의 연마 차이는 무게 차이보다 훨씬 먼저 눈에 띕니다.",
          "펜던트 한 알로 가는 경우에도 마찬가지입니다. 어떤 디자인에도 무리 없이 들어가고, 나중에 다시 세팅하기에도 제약이 없습니다.",
        ],
      },
      {
        heading: "왜 D–G인가",
        body: [
          "F에서 끊지 않고 G까지 넓히면 고를 수 있는 폭이 크게 늘어납니다. G는 니어 컬러리스의 가장 위쪽이고, 세팅을 마친 상태에서는 비교용 석 없이 F와 구분하기 어렵습니다. 그렇게 아낀 예산은 크기나 연마 등급에 쓰는 편이 실제로 눈에 보입니다.",
        ],
      },
    ],
    brief: { shapes: "라운드", colour: "D–G" },
    primary: { shapes: ["round"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...en,
    slug: "parents-day-en",
    date: { kind: "fixed", month: 5, day: 8, rule: "8 May, fixed" },
    title: "Korean Parents' Day diamonds: round, D to G",
    description:
      "Round loose diamonds in D-G for Korean Parents' Day on 8 May, a single date covering both parents. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "South Korea · Parents' Day, in English",
    heading: "One date for both parents",
    standfirst:
      "Korea does not hold separate days for mothers and fathers. Both are marked together on 8 May, Eobeoinal, and the date is fixed rather than tied to a particular Sunday — which makes it one of the simpler occasions in this calendar to plan for.",
    sections: [
      {
        heading: "A fixed date in a crowded month",
        body: [
          "May is referred to in Korea as the family month, and it is genuinely congested: Children's Day on the 5th, Parents' Day on the 8th, Teachers' Day on the 15th, and Coming of Age Day on the third Monday. Several of these involve gifts, and they fall within a fortnight of each other.",
          "The practical consequence is to start earlier than the date alone would suggest. The 8th does not move, so there is no ambiguity about when it falls, but everything around it competes for the same two weeks.",
        ],
      },
      {
        heading: "The convention, and what goes beyond it",
        body: [
          "Carnations are the traditional gift, pinned to a parent's clothing or given as a bouquet. Anything above that is a matter of choice rather than convention, and jewellery is the usual step up.",
          "The brief that follows is for something worn daily rather than kept for occasions: a pair of studs, a simple pendant, or a ring for the right hand. Nothing here is asked to function as an engagement piece.",
        ],
      },
      {
        heading: "Why round, and why D to G",
        body: [
          "Where two stones have to match, as in a pair of earrings, the round is the clear choice: it is the only shape with an overall cut grade on the report, so a pair can be matched on paper before being matched by eye. A small difference in cut between two stones shows long before a difference in weight does.",
          "Running the band to G rather than stopping at F widens the field considerably without admitting colour that shows in wear. G sits at the top of near-colourless and is not separable from F in a mounted stone without a comparison set. The saving goes into carat or cut, both of which are visible every day.",
        ],
      },
    ],
    brief: { shapes: "Round", colour: "D-G" },
    primary: { shapes: ["round"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...ko,
    slug: "chuseok",
    date: { kind: "lunar", rule: "음력 8월 15일 — 양력으로는 9월에서 10월 사이" },
    title: "추석 선물 다이아몬드 | 라운드, D–G 컬러",
    description:
      "추석 선물을 위한 라운드 나석 다이아몬드. 컬러는 D부터 G까지. 천연·랩그로운 모두 감정서와 함께 한 알씩 견적해 드립니다.",
    eyebrow: "대한민국 · 추석",
    heading: "온 가족이 모이는 자리에서",
    standfirst:
      "추석은 음력 8월 15일로, 양력으로는 해마다 9월에서 10월 사이를 오갑니다. 한 해에서 가장 크게 가족이 모이는 명절이고, 선물이 오가는 규모도 그에 걸맞습니다.",
    sections: [
      {
        heading: "날짜가 해마다 바뀝니다",
        body: [
          "추석은 음력에 따르기 때문에 양력 날짜가 고정되어 있지 않습니다. 이 페이지에 특정 날짜를 적어 두지 않은 것도 그 때문입니다. 음력 계산을 이 사이트에서 다루고 있지 않은 이상, 틀린 날짜를 적는 것보다 규칙만 밝혀 두는 편이 낫다고 판단했습니다.",
          "다만 연휴가 길고 물류가 몰리는 시기라는 점은 매년 같습니다. 배송과 세팅 모두 평소보다 여유를 두고 잡으시는 것을 권해 드립니다.",
        ],
      },
      {
        heading: "왜 라운드 한 가지인가",
        body: [
          "명절 선물은 여러 사람의 눈에 오릅니다. 그런 자리에서 가장 설명이 필요 없는 셰이프가 라운드입니다. 감정서에 컷 종합 등급이 기재되는 유일한 형태이므로, 품질을 서류로 보여 드릴 수 있다는 실질적인 장점도 있습니다.",
          "귀걸이처럼 두 알을 맞추는 경우에도 라운드가 가장 수월합니다. 눈으로 맞추기 전에 수치로 맞출 수 있기 때문입니다.",
        ],
      },
      {
        heading: "왜 D–G인가",
        body: [
          "D에서 G까지는 육안으로 충분히 희게 보이는 구간입니다. F에서 끊는 대신 G까지 넓히면 선택의 폭이 크게 늘어나고, 아낀 예산은 크기나 연마로 돌릴 수 있습니다. 세팅을 마치면 F와 G를 나란히 놓고 비교하지 않는 한 구분되지 않습니다.",
        ],
      },
    ],
    brief: { shapes: "라운드", colour: "D–G" },
    primary: { shapes: ["round"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...en,
    slug: "chuseok-en",
    date: {
      kind: "lunar",
      rule: "The 15th day of the 8th lunar month, falling in September or October",
    },
    title: "Chuseok diamonds: round, D to G",
    description:
      "Round loose diamonds in D-G for Chuseok, the Korean autumn harvest festival and its largest family gathering of the year. Filtered and ready to enquire on.",
    eyebrow: "South Korea · Chuseok, in English",
    heading: "The largest family gathering of the Korean year",
    standfirst:
      "Chuseok falls on the fifteenth day of the eighth lunar month, which puts it somewhere in September or October depending on the year. It is the harvest festival and the biggest family occasion in Korea, and the volume of gifting around it is substantial.",
    sections: [
      {
        heading: "Why no date is printed on this page",
        body: [
          "Chuseok moves against the Gregorian calendar because it is set by the lunar one, and this site does not carry a lunisolar calendar. Rather than print a date that might be wrong, the rule is stated instead and the date left to be confirmed.",
          "What does not change is the shape of the period: a multi-day holiday, very heavy domestic travel, and logistics under strain for a week or more either side. Allow more time than usual for both shipping and setting.",
        ],
      },
      {
        heading: "The gifting convention",
        body: [
          "Chuseok gifting is large in volume and mostly practical — food, household goods and corporate gift sets circulate in enormous quantities. Jewellery is the exception rather than the rule, and it appears where the occasion is doubling as something else: a significant birthday, a retirement, or a family milestone that happens to fall in the same week.",
          "That makes it a secondary jewellery occasion rather than a primary one, which is worth being straightforward about. It is on this list because the gathering is real and the gifting is real, not because Chuseok is a diamond occasion in the way that White Day is.",
        ],
      },
      {
        heading: "Why round, and why D to G",
        body: [
          "A gift given in front of an extended family is looked at by a lot of people at once. The round is the shape that needs no explanation in that setting, and it is the only cut carrying an overall cut grade on the report, so its quality can be demonstrated on paper rather than asserted.",
          "D to G keeps the stone visibly white while leaving room to spend on what is actually noticed, which is size and how the stone behaves in light. Once mounted, F and G are not separable without putting them side by side.",
        ],
      },
    ],
    brief: { shapes: "Round", colour: "D-G" },
    primary: { shapes: ["round"], colors: ["D", "E", "F", "G"] },
  },
];
