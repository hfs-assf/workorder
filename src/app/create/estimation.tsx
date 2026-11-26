import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Platform } from "react-native";

import { AppHeader } from "@/components/navigation";
import {
  AppButton,
  AppInput,
  DatePicker,
  FormSection,
  IconButton,
  newPhotoSlot,
  PhotoSlot,
  PhotoSlotsField,
  Screen,
  Select,
  Stack,
  StateView,
  TextArea,
  toast,
} from "@/components/ui";
import {
  areaOptions,
  ESTIMATION_FORMS,
  isEstimationKind,
  useCloseCreateFlow,
} from "@/features/create";
import { useCurrentUser } from "@/store/user";

type Errors = Partial<
  Record<
    "requester" | "workdayId" | "checkIn" | "checkOut" | "area" | "photos",
    string
  >
>;

/** One screen for all 4 estimation forms; `kind` in the URL picks the config. */
export default function EstimationFormScreen() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  const closeFlow = useCloseCreateFlow();
  const user = useCurrentUser();
  const config = isEstimationKind(kind) ? ESTIMATION_FORMS[kind] : null;

  // Areas the user can pick for this form (house list or mess list)
  const areas = config ? areaOptions(config.facility) : [];

  // Pre-fill from the profile. Area only if the user's own area is in this form's list (same house/mess type).
  const profileArea =
    user && areas.some((a) => a.value === user.area.name)
      ? user.area.name
      : null;

  // Form state (starts with the profile values; the user can still change them)
  const [requester, setRequester] = useState(user?.name ?? "");
  const [workdayId, setWorkdayId] = useState(user?.workdayId ?? "");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [remarks, setRemarks] = useState("");
  const [area, setArea] = useState<string | null>(profileArea);
  const [reference, setReference] = useState("");
  const [photos, setPhotos] = useState<PhotoSlot[]>([newPhotoSlot()]);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  if (!config) {
    return (
      <Screen>
        <StateView
          type="error"
          message="This form doesn't exist."
          onRetry={() => router.back()}
        />
      </Screen>
    );
  }
  const form = config;

  /** Hint under a pre-filled field, so users know where the value came from */
  const fromProfile = (
    value: string | null,
    original: string | null | undefined,
  ) =>
    original && value === original
      ? "From your profile · you can change it"
      : undefined;

  /** Clear a field's error as soon as the user fixes it */
  const clear = (key: keyof Errors) =>
    errors[key] && setErrors((e) => ({ ...e, [key]: undefined }));

  const validate = (): Errors => ({
    requester: requester.trim() ? undefined : "Enter the requester",
    workdayId: workdayId.trim() ? undefined : "Enter the Workday ID",
    checkIn: checkIn ? undefined : "Choose the last check-in date",
    checkOut: !checkOut
      ? "Choose the last check-out date"
      : checkIn && checkOut < checkIn
        ? "Check-out must be on or after check-in"
        : undefined,
    area: area ? undefined : "Choose the area",
    photos: photos.some((p) => p.images.length > 0)
      ? undefined
      : "Add at least one photo",
  });

  const submit = async () => {
    const found = validate();
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      toast.error("Some fields need attention", {
        message: "Check the fields marked in red.",
      });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // stand-in for the API call (Step 6)
    setSaving(false);
    toast.success("Estimation sent", { message: `${form.title} · ${area}` });
    closeFlow(); // close the whole create flow
  };

  return (
    <Screen
      scroll
      header={
        <AppHeader
          safeTop={Platform.OS !== "ios"} // Android: full-screen modal → needs status-bar space
          title={form.title}
          subtitle={form.description}
          onBack={() => router.back()}
          right={
            <IconButton
              icon="close"
              variant="ghost"
              accessibilityLabel="Close"
              onPress={closeFlow}
            />
          }
        />
      }
    >
      <Stack gap="lg">
        <FormSection icon="person-outline" title="Requester">
          <AppInput
            label="Requester"
            placeholder="Full name"
            value={requester}
            onChangeText={(v) => {
              setRequester(v);
              clear("requester");
            }}
            error={errors.requester}
            hint={fromProfile(requester, user?.name)}
          />
          <AppInput
            label="Workday ID"
            placeholder="e.g. 10234567"
            keyboardType="number-pad"
            value={workdayId}
            onChangeText={(v) => {
              setWorkdayId(v);
              clear("workdayId");
            }}
            error={errors.workdayId}
            hint={fromProfile(workdayId, user?.workdayId)}
          />
        </FormSection>

        <FormSection
          icon="calendar-outline"
          title="Stay dates"
          description="The resident's most recent stay."
        >
          <DatePicker
            label="Last check-in date"
            value={checkIn}
            maxDate={new Date()}
            onChange={(d) => {
              setCheckIn(d);
              clear("checkIn");
            }}
            error={errors.checkIn}
          />
          <DatePicker
            label="Last check-out date"
            value={checkOut}
            minDate={checkIn ?? undefined}
            onChange={(d) => {
              setCheckOut(d);
              clear("checkOut");
            }}
            error={errors.checkOut}
          />
        </FormSection>

        <FormSection icon="location-outline" title="Location">
          <Select
            label="Area"
            placeholder={`e.g. ${form.areaExample}`}
            leftIcon={
              form.facility === "house" ? "home-outline" : "restaurant-outline"
            }
            sheetTitle="Choose area"
            options={areas}
            searchable // type "GG-25" or "C6" to find it fast
            value={area}
            onChange={(v) => {
              setArea(v);
              clear("area");
            }}
            error={errors.area}
            hint={fromProfile(area, profileArea)}
          />
          <AppInput
            label="Estimation reference"
            placeholder="e.g. EST-2026-0142"
            value={reference}
            onChangeText={setReference}
            hint="Optional"
          />
          {form.hasRemarks ? (
            <TextArea
              label="Remarks"
              placeholder="What extra work is needed?"
              value={remarks}
              onChangeText={setRemarks}
              maxLength={500}
              rows={3}
            />
          ) : null}
        </FormSection>

        <FormSection
          icon="images-outline"
          title="Photos"
          description="Name each photo by the room, e.g. Ruang tamu, Dapur."
        >
          <PhotoSlotsField
            value={photos}
            onChange={(v) => {
              setPhotos(v);
              clear("photos");
            }}
            labelPlaceholder="e.g. Ruang tamu"
            error={errors.photos}
          />
        </FormSection>

        <AppButton
          title="Send estimation"
          icon="paper-plane-outline"
          size="lg"
          loading={saving}
          onPress={submit}
        />
      </Stack>
    </Screen>
  );
}
