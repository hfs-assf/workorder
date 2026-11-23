import { router } from "expo-router";
import { useState } from "react";
import { Platform } from "react-native";

import { AppHeader } from "@/components/navigation";
import {
  AppButton,
  AppInput,
  DatePicker,
  IconButton,
  Option,
  Screen,
  Select,
  Stack,
  TextArea,
  toast,
} from "@/components/ui";

type Priority = "low" | "medium" | "high" | "urgent";

const PRIORITIES: Option<Priority>[] = [
  { value: "low", label: "Low", description: "Within 7 days" },
  { value: "medium", label: "Medium", description: "Within 3 days" },
  { value: "high", label: "High", description: "Within 24 hours" },
  { value: "urgent", label: "Urgent", description: "Immediately" },
];

/** Opened by the center (+) button. Real saving comes in the CRUD step. */
export default function CreateWorkOrderScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority | null>("medium");
  const [due, setDue] = useState<Date | null>(null);

  const save = () => {
    toast.success("Work order created", { message: title || "Untitled" });
    router.back();
  };

  return (
    <Screen
      scroll
      header={
        <AppHeader
          // iOS shows modals as a card that already starts below the status bar;
          // Android shows them full-screen, so it needs the status-bar space.
          safeTop={Platform.OS !== "ios"}
          title="New work order"
          right={
            <IconButton
              icon="close"
              variant="ghost"
              accessibilityLabel="Close"
              onPress={() => router.back()}
            />
          }
        />
      }
    >
      <Stack gap="md">
        <AppInput
          label="Title"
          placeholder="e.g. Replace conveyor belt"
          value={title}
          onChangeText={setTitle}
        />
        <TextArea
          label="Description"
          placeholder="What needs to be done?"
          value={description}
          onChangeText={setDescription}
          maxLength={500}
        />
        <Select
          label="Priority"
          leftIcon="flag-outline"
          options={PRIORITIES}
          value={priority}
          onChange={setPriority}
        />
        <DatePicker
          label="Due date"
          value={due}
          onChange={setDue}
          minDate={new Date()}
        />
        <AppButton title="Create work order" icon="checkmark" onPress={save} />
      </Stack>
    </Screen>
  );
}
