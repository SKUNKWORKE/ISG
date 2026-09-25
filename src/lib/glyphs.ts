/**
 * Wireframe geometry for the twelve cut shapes, drawn face-up in a 100x100
 * viewBox as a gemmologist's plotting diagram would draw them: a girdle
 * outline, then the facet lines inside it.
 *
 * `outline` is the girdle. `facets` is ordered outside-in, which is the order
 * the hover animation draws them in.
 */

export type GlyphGeometry = {
  outline: string;
  facets: string[];
};

export const GLYPHS: Record<string, GlyphGeometry> = {
  round: {
    outline: "M10 50a40 40 0 1 0 80 0a40 40 0 1 0-80 0Z",
    facets: [
      // Girdle octagon, then the table, then the eight bezel facets between them.
      "M86.96 65.31L65.31 86.96L34.69 86.96L13.04 65.31L13.04 34.69L34.69 13.04L65.31 13.04L86.96 34.69Z",
      "M64.78 56.12L56.12 64.78L43.88 64.78L35.22 56.12L35.22 43.88L43.88 35.22L56.12 35.22L64.78 43.88Z",
      "M64.78 56.12L86.96 65.31",
      "M56.12 64.78L65.31 86.96",
      "M43.88 64.78L34.69 86.96",
      "M35.22 56.12L13.04 65.31",
      "M35.22 43.88L13.04 34.69",
      "M43.88 35.22L34.69 13.04",
      "M56.12 35.22L65.31 13.04",
      "M64.78 43.88L86.96 34.69",
    ],
  },

  princess: {
    outline: "M12 12H88V88H12Z",
    facets: [
      "M12 12L88 88",
      "M88 12L12 88",
      "M50 30L70 50L50 70L30 50Z",
    ],
  },

  cushion: {
    outline:
      "M30 10H70Q90 10 90 30V70Q90 90 70 90H30Q10 90 10 70V30Q10 10 30 10Z",
    facets: [
      "M38 26H62Q74 26 74 38V62Q74 74 62 74H38Q26 74 26 62V38Q26 26 38 26Z",
      "M17 17L31 31",
      "M83 17L69 31",
      "M83 83L69 69",
      "M17 83L31 69",
      "M50 10L50 26",
      "M50 90L50 74",
      "M10 50L26 50",
      "M90 50L74 50",
    ],
  },

  emerald: {
    // Step cut: concentric cut-corner rectangles, no radiating facets.
    outline: "M32 6H68L86 24V76L68 94H32L14 76V24Z",
    facets: [
      "M36 16H64L78 30V70L64 84H36L22 70V30Z",
      "M40 26H60L70 36V64L60 74H40L30 64V36Z",
      "M32 6L36 16",
      "M68 6L64 16",
      "M86 24L78 30",
      "M86 76L78 70",
      "M68 94L64 84",
      "M32 94L36 84",
      "M14 76L22 70",
      "M14 24L22 30",
    ],
  },

  oval: {
    outline: "M50 8a28 42 0 1 0 0 84a28 42 0 1 0 0-84Z",
    facets: [
      "M50 32a12 18 0 1 0 0 36a12 18 0 1 0 0-36Z",
      "M50 8L50 32",
      "M50 92L50 68",
      "M22 50L38 50",
      "M78 50L62 50",
      "M30 26L41 36",
      "M70 26L59 36",
      "M70 74L59 64",
      "M30 74L41 64",
    ],
  },

  pear: {
    outline: "M50 6C50 6 78 34 78 58C78 77 65 92 50 92C35 92 22 77 22 58C22 34 50 6 50 6Z",
    facets: [
      "M50 26C50 26 66 42 66 57C66 68 59 77 50 77C41 77 34 68 34 57C34 42 50 26 50 26Z",
      "M50 6L50 26",
      "M22 58L34 57",
      "M78 58L66 57",
      "M50 92L50 77",
      "M29 79L39 71",
      "M71 79L61 71",
    ],
  },

  marquise: {
    outline: "M50 8C64 20 76 36 76 50C76 64 64 80 50 92C36 80 24 64 24 50C24 36 36 20 50 8Z",
    facets: [
      "M50 28C58 36 64 44 64 50C64 56 58 64 50 72C42 64 36 56 36 50C36 44 42 36 50 28Z",
      "M50 8L50 28",
      "M50 92L50 72",
      "M24 50L36 50",
      "M76 50L64 50",
    ],
  },

  radiant: {
    outline: "M32 6H68L86 22V78L68 94H32L14 78V22Z",
    facets: [
      "M40 28H60L70 38V62L60 72H40L30 62V38Z",
      "M40 28L32 6",
      "M60 28L68 6",
      "M70 38L86 22",
      "M70 62L86 78",
      "M60 72L68 94",
      "M40 72L32 94",
      "M30 62L14 78",
      "M30 38L14 22",
    ],
  },

  asscher: {
    outline: "M30 8H70L92 30V70L70 92H30L8 70V30Z",
    facets: [
      "M36 20H64L80 36V64L64 80H36L20 64V36Z",
      "M42 32H58L68 42V58L58 68H42L32 58V42Z",
      "M19 19L32 32",
      "M81 19L68 32",
      "M81 81L68 68",
      "M19 81L32 68",
    ],
  },

  heart: {
    outline:
      "M50 92C50 92 16 66 16 42C16 28 26 20 36 20C44 20 50 26 50 32C50 26 56 20 64 20C74 20 84 28 84 42C84 66 50 92 50 92Z",
    facets: [
      "M50 74C50 74 30 58 30 44C30 36 35 32 40 32C45 32 50 36 50 41C50 36 55 32 60 32C65 32 70 36 70 44C70 58 50 74 50 74Z",
      "M50 32L50 41",
      "M16 42L30 44",
      "M84 42L70 44",
      "M50 92L50 74",
    ],
  },

  trillion: {
    outline: "M50 12L86 80Q88 86 82 86H18Q12 86 14 80Z",
    facets: [
      "M50 34L72 74H28Z",
      "M50 12L50 34",
      "M86 80L72 74",
      "M14 80L28 74",
      "M50 86L50 74",
    ],
  },

  hexagon: {
    outline: "M35 12L65 12L85 50L65 88L35 88L15 50Z",
    facets: [
      "M41.75 29.1L58.25 29.1L69.25 50L58.25 70.9L41.75 70.9L30.75 50Z",
      "M35 12L41.75 29.1",
      "M65 12L58.25 29.1",
      "M85 50L69.25 50",
      "M65 88L58.25 70.9",
      "M35 88L41.75 70.9",
      "M15 50L30.75 50",
    ],
  },
};
