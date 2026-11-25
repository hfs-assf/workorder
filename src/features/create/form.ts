/**
 * The forms that the (+) button can open.
 * The 4 estimation forms share ONE screen; this config is the only difference between them.
 */
import type { IconName, Option } from "@/components/ui";

export type Facility = "house" | "mess";

export type EstimationKind =
  | "additional-house"
  | "additional-mess"
  | "original-house"
  | "original-mess";

export type EstimationConfig = {
  title: string;
  /** One line under the title in the chooser */
  description: string;
  facility: Facility;
  /** Example shown in the Area field */
  areaExample: string;
  /** Only "Additional – House" has a Remarks field */
  hasRemarks: boolean;
};

export const ESTIMATION_FORMS: Record<EstimationKind, EstimationConfig> = {
  "additional-house": {
    title: "Estimation Additional – House",
    description: "Extra work on top of the original estimate",
    facility: "house",
    areaExample: "TS 2-Type FM-Blok GG-25",
    hasRemarks: true,
  },
  "additional-mess": {
    title: "Estimation Additional – Mess",
    description: "Extra work on top of the original estimate",
    facility: "mess",
    areaExample: "Mess C2",
    hasRemarks: false,
  },
  "original-house": {
    title: "Estimation Original – House",
    description: "First estimate after a resident checks out",
    facility: "house",
    areaExample: "TS 2-Type FM-Blok GG-25",
    hasRemarks: false,
  },
  "original-mess": {
    title: "Estimation Original – Mess",
    description: "First estimate after a resident checks out",
    facility: "mess",
    areaExample: "Mess C6",
    hasRemarks: false,
  },
};

/** Checks that a value from the URL is a real form kind (see C7) */
export const isEstimationKind = (v: unknown): v is EstimationKind =>
  typeof v === "string" && v in ESTIMATION_FORMS;

// ── Maintenance form options ────────────────────────────────

export const UNIT_CATEGORIES: Option<string>[] = [
  { value: "air-conditioner", label: "Air Conditioner", icon: "snow-outline" },
  { value: "curtain", label: "Curtain", icon: "browsers-outline" },
  { value: "electric", label: "Electric", icon: "flash-outline" },
  { value: "furniture", label: "Furniture", icon: "bed-outline" },
  { value: "gas-stove", label: "Gas Stove", icon: "flame-outline" },
  {
    value: "infrastructure",
    label: "Infrastructure",
    icon: "business-outline",
  },
  { value: "painting", label: "Painting", icon: "color-fill-outline" },
  {
    value: "repair-building",
    label: "Repair Building",
    icon: "hammer-outline",
  },
  { value: "trimming", label: "Trimming", icon: "leaf-outline" },
  { value: "water-heater", label: "Water Heater", icon: "water-outline" },
  {
    value: "others",
    label: "Others",
    icon: "ellipsis-horizontal-circle-outline",
  },
];

export const CHECKING_LOCATIONS: Option<string>[] = [
  { value: "living-room", label: "Living Room" },
  { value: "main-bedroom", label: "Main Bedroom" },
  { value: "front-bedroom", label: "Front Bedroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "dining-room", label: "Dining Room" },
  { value: "common-bathroom", label: "Common Bathroom" },
  { value: "rear-bathroom", label: "Rear Bathroom" },
  { value: "drying-space", label: "Drying Space" },
  { value: "other", label: "Other" },
];

export const FACILITY_ICON: Record<Facility, IconName> = {
  house: "home-outline",
  mess: "restaurant-outline",
};
