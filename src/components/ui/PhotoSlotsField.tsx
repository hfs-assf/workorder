import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import { makeStyles } from "@/hooks/use-theme";
import { PickedImage } from "@/utils/image-picker";

import { AppButton } from "./AppButtton";
import { AppInput } from "./AppInput";
import { AppText } from "./AppText";
import { FieldLabel, FieldMessage } from "./Field";
import { IconButton } from "./IconButton";
import { ImageUploadField } from "./ImageUploadFile";
import { Row, Stack } from "./Stack";

export type PhotoSlot = { id: string; label: string; images: PickedImage[] };

/** A new empty row. `id` only needs to be unique inside this list. */
export const newPhotoSlot = (label = ""): PhotoSlot => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  label,
  images: [],
});

type Props = {
  value: PhotoSlot[];
  onChange: (slots: PhotoSlot[]) => void;
  label?: string;
  hint?: string;
  error?: string;
  /** Example for the name field, e.g. "e.g. Ruang tamu" */
  labelPlaceholder?: string;
  maxSlots?: number;
  maxSizeMB?: number;
  multiple?: boolean;
  maxPerSlot?: number;
};

/**
 * A growing list of named photos: "Ruang tamu" + photo, "Dapur" + photo…
 * "+ Add another photo" adds a row; each row can be removed.
 */
export function PhotoSlotsField({
  value,
  onChange,
  label,
  hint,
  error,
  labelPlaceholder = "e.g. Ruang tamu",
  maxSlots = 20,
  maxSizeMB = 5,
  multiple = false,
  maxPerSlot = 5,
}: Props) {
  const styles = useStyles();
  const perSlot = multiple ? maxPerSlot : 1;

  const update = (id: string, patch: Partial<PhotoSlot>) =>
    onChange(value.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const remove = (id: string) => onChange(value.filter((s) => s.id !== id));
  const add = () => onChange([...value, newPhotoSlot()]);

  return (
    <Stack gap="sm">
      <FieldLabel label={label} error={error} />

      {value.map((slot, i) => (
        <Animated.View
          key={slot.id}
          entering={FadeIn}
          exiting={FadeOut}
          layout={LinearTransition}
          style={styles.slot}
        >
          <Row>
            <AppText variant="label" color="textMuted" style={{ flex: 1 }}>
              Photo {i + 1}
            </AppText>
            {value.length > 1 ? (
              <IconButton
                icon="trash-outline"
                variant="ghost"
                size={32}
                accessibilityLabel={`Remove photo ${i + 1}`}
                onPress={() => remove(slot.id)}
              />
            ) : null}
          </Row>
          <AppInput
            placeholder={labelPlaceholder}
            value={slot.label}
            onChangeText={(text) => update(slot.id, { label: text })}
          />
          <ImageUploadField
            value={slot.images}
            onChange={(images) => update(slot.id, { images })}
            multiple={false}
            maxCount={1}
            maxSizeMB={maxSizeMB}
            tileSize={multiple ? 88 : 104}
            hint={
              multiple
                ? `Up to ${perSlot} photos, max ${maxSizeMB} MB each`
                : `Max ${maxSizeMB} MB`
            }
          />
        </Animated.View>
      ))}

      {value.length < maxSlots ? (
        <AppButton
          title="Add another photo"
          icon="add"
          variant="secondary"
          size="sm"
          onPress={add}
        />
      ) : null}

      <FieldMessage error={error} hint={hint} />
    </Stack>
  );
}

const useStyles = makeStyles((t) => ({
  slot: {
    gap: t.spacing.sm,
    padding: t.spacing.md,
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
}));
