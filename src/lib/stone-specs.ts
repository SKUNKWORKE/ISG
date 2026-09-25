import type { Stone } from "./stones";

export const SITE_URL = "https://www.imperialstargems.com";

export function originWord(stone: Stone) {
  return stone.origin === "natural" ? "natural" : "lab-grown";
}

/** The label/value list shared by the stone page and its PDF spec sheet. */
export function stoneSpecs(stone: Stone): [string, string][] {
  return [
    ["Shape", stone.shapeName],
    ["Carat", stone.carat.toFixed(2)],
    ["Colour", stone.color],
    ["Clarity", stone.clarity],
    ...(stone.cut ? ([["Cut", stone.cut]] as [string, string][]) : []),
    ["Polish", stone.polish],
    ["Symmetry", stone.symmetry],
    ["Fluorescence", stone.fluorescence],
    ["Table", `${stone.tablePercent}%`],
    ["Depth", `${stone.depthPercent}%`],
    ["Measurements", stone.measurements],
    ["Origin", stone.origin === "natural" ? "Natural" : "Lab-grown"],
    ["Certificate", `${stone.lab}, report number on enquiry`],
  ];
}
