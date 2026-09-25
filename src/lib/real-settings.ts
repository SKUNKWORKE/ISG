import "server-only";
import { ALL_JEWELRY } from "./real-jewelry";
import { isSettingDesign, toSettingDesign, type SettingDesign } from "./ring-builder";
import type { ShapeSlug } from "./shapes";

/** Every ring design with a centre stone, offered as a setting in the builder. */
export const SETTING_DESIGNS: SettingDesign[] = ALL_JEWELRY.filter(isSettingDesign).map(toSettingDesign);

export function findSettingDesign(sku: string): SettingDesign | undefined {
  return SETTING_DESIGNS.find((d) => d.sku === sku);
}

export function designsForShape(shape: ShapeSlug): SettingDesign[] {
  return SETTING_DESIGNS.filter((d) => d.centreShape === shape);
}

export const SHAPES_WITH_DESIGNS = new Set(SETTING_DESIGNS.map((d) => d.centreShape));
