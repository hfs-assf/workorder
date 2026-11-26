/**
 * Areas users can pick in forms (sample list until it comes from the API).
 * value = what is saved, label = what users see and search.
 */
import type { Option } from "@/components/ui";

import { Facility } from "./forms";

const HOUSE_AREAS = [
  "TS 1-Type FM-Blok GG-21",
  "TS 1-Type FM-Blok GG-22",
  "TS 2-Type FM-Blok GG-24",
  "TS 2-Type FM-Blok GG-25",
  "TS 2-Type FM-Blok GG-26",
  "TS 3-Type FS-Blok HH-10",
  "TS 3-Type FS-Blok HH-11",
  "TS 4-Type FS-Blok JJ-03",
];

const MESS_AREAS = [
  "Mess C1",
  "Mess C2",
  "Mess C3",
  "Mess C4",
  "Mess C5",
  "Mess C6",
  "Mess C7",
  "Mess C8",
];

/** The area options for one facility, ready for <Select options={…} /> */
export function areaOptions(facility: Facility): Option<string>[] {
  const names = facility === "house" ? HOUSE_AREAS : MESS_AREAS;
  const icon = facility === "house" ? "home-outline" : "restaurant-outline";
  return names.map((name) => ({ value: name, label: name, icon }));
}
