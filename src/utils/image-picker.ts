/**
 * Pick photos from the camera or gallery, with permission handling and a size limit.
 * Returns the accepted photos and how many were too big, so the caller can explain why.
 */
import * as ImagePicker from "expo-image-picker";

export type PickedImage = {
  uri: string;
  name: string;
  sizeBytes: number | null;
  width: number;
  height: number;
};

export type PickSource = "camera" | "library";

type Options = {
  multiple?: boolean;
  /** How many more can be added (gallery stops the user at this number) */
  limit?: number;
  maxSizeMB?: number;
};

export type PickResult =
  | { status: "ok"; images: PickedImage[]; tooBig: number }
  | { status: "cancelled" }
  | { status: "denied" };

export async function pickImages(
  source: PickSource,
  { multiple = false, limit, maxSizeMB = 5 }: Options = {},
): Promise<PickResult> {
  // 1. Ask permission (the phone shows its own pop-up the first time)
  const permission =
    source === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return { status: "denied" };

  // 2. Open the camera or the gallery
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    quality: 0.7, // compress a little: photos stay sharp but upload faster
    allowsMultipleSelection: source === "library" && multiple,
    selectionLimit: multiple ? limit : 1,
  };

  const result =
    source === "camera"
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
  if (result.canceled) return { status: "cancelled" };

  // 3. Keep only photos under the size limit
  const maxBytes = maxSizeMB * 1024 * 1024;
  const all: PickedImage[] = result.assets.map((a, i) => ({
    uri: a.uri,
    name: a.fileName ?? `photo-${Date.now()}-${i}.jpg`,
    sizeBytes: a.fileSize ?? null,
    width: a.width,
    height: a.height,
  }));
  const images = all.filter(
    (img) => img.sizeBytes === null || img.sizeBytes <= maxBytes,
  );

  return { status: "ok", images, tooBig: all.length - images.length };
}

/** 2_400_000 → "2.4 MB" */
export function formatBytes(bytes: number | null) {
  if (bytes === null) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
