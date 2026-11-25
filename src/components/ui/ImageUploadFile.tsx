import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import { makeStyles } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";
import { PickedImage, pickImages, PickSource } from "@/utils/image-picker";

import { AppButton } from "./AppButtton";
import { AppText } from "./AppText";
import { BottomSheet } from "./BottomSheet";
import { FieldLabel, FieldMessage } from "./Field";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";
import { Stack } from "./Stack";
import { toast } from "./Toast";

type Props = {
  value: PickedImage[];
  onChange: (images: PickedImage[]) => void;
  label?: string;
  hint?: string;
  error?: string;
  /** Allow picking several at once. Default true */
  multiple?: boolean;
  /** Max number of photos. Default 10 */
  maxCount?: number;
  maxSizeMB?: number;
  /** Size of each thumbnail tile (px). Default 88 */
  tileSize?: number;
};

/** Thumbnails + an "Add photo" tile → camera or gallery. Refuses files over maxSizeMB. */
export function ImageUploadField({
  value,
  onChange,
  label,
  hint,
  error,
  multiple = true,
  maxCount = 10,
  maxSizeMB = 5,
  tileSize = 88,
}: Props) {
  const styles = useStyles();
  const [sheetOpen, setSheetOpen] = useState(false);
  const canAdd = value.length < maxCount;
  const tile = { width: tileSize, height: tileSize };

  const pick = async (source: PickSource) => {
    setSheetOpen(false);
    const result = await pickImages(source, {
      multiple,
      limit: maxCount - value.length,
      maxSizeMB,
    });

    if (result.status === "denied") {
      toast.error(
        source === "camera" ? "Camera access needed" : "Photo access needed",
        {
          message: "Allow it in your phone settings, then try again.",
        },
      );
      return;
    }
    if (result.status === "cancelled") return;
    if (result.tooBig > 0) {
      toast.warning(
        `${result.tooBig} photo${result.tooBig > 1 ? "s are" : " is"} over ${maxSizeMB} MB`,
        {
          message: "Choose a smaller photo.",
        },
      );
    }
    if (result.images.length)
      onChange([...value, ...result.images].slice(0, maxCount));
  };

  const remove = (uri: string) =>
    onChange(value.filter((img) => img.uri !== uri));

  return (
    <View style={styles.wrapper}>
      <FieldLabel label={label} error={error} />

      <View style={styles.grid}>
        {value.map((img) => (
          <Animated.View
            key={img.uri}
            entering={FadeIn}
            exiting={FadeOut}
            layout={LinearTransition}
            style={[styles.thumb, tile]}
          >
            <Image
              source={{ uri: img.uri }}
              style={styles.image}
              contentFit="cover"
              transition={150}
            />
            <Pressable
              onPress={() => remove(img.uri)}
              hitSlop={8}
              style={styles.remove}
              accessibilityLabel="Remove photo"
            >
              <Icon name="close" size={14} color="onPrimary" />
            </Pressable>
          </Animated.View>
        ))}

        {canAdd ? (
          <PressableScale
            onPress={() => setSheetOpen(true)}
            haptic="tap"
            scaleTo={0.95}
            accessibilityLabel="Add photo"
            style={[styles.add, tile, !!error && styles.addError]}
          >
            <Icon
              name="camera-outline"
              size={24}
              color={error ? "danger" : "primary"}
            />
            <AppText variant="caption" color={error ? "danger" : "primary"}>
              Add photo
            </AppText>
          </PressableScale>
        ) : null}
      </View>

      <FieldMessage
        error={error}
        hint={hint ?? `JPG or PNG, max ${maxSizeMB} MB each`}
      />

      <BottomSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Add photo"
      >
        <Stack gap="sm" style={styles.sheet}>
          <AppButton
            title="Take a photo"
            icon="camera-outline"
            variant="secondary"
            onPress={() => pick("camera")}
          />
          <AppButton
            title={multiple ? "Choose from gallery" : "Choose a photo"}
            icon="images-outline"
            variant="outline"
            onPress={() => pick("library")}
          />
        </Stack>
      </BottomSheet>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: { gap: t.spacing.xs + 2 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: t.spacing.sm },
  thumb: {
    borderRadius: t.radius.md,
    overflow: "hidden",
    backgroundColor: t.colors.surfaceMuted,
  },
  image: { width: "100%", height: "100%" },
  remove: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: t.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.colors.overlay,
  },
  add: {
    borderRadius: t.radius.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: alpha(t.colors.primary, 0.5),
    backgroundColor: alpha(t.colors.primary, 0.05),
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  addError: {
    borderColor: t.colors.danger,
    backgroundColor: alpha(t.colors.danger, 0.05),
  },
  sheet: { paddingBottom: t.spacing.md },
}));
