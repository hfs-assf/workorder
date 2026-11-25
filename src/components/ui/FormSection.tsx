import { ReactNode } from "react";

import { AppText } from "./AppText";
import { Card } from "./Card";
import { Icon, IconName } from "./Icon";
import { Row, Stack } from "./Stack";

type Props = {
  title: string;
  description?: string;
  icon?: IconName;
  children: ReactNode;
};

/** A titled group of fields inside a solid card. Splits long forms into easy chunks. */
export function FormSection({ title, description, icon, children }: Props) {
  return (
    <Card variant="elevated">
      <Stack gap="xs">
        <Row gap="sm">
          {icon ? <Icon name={icon} size={18} color="primary" /> : null}
          <AppText variant="label" style={{ fontSize: 15 }}>
            {title}
          </AppText>
        </Row>
        {description ? (
          <AppText variant="caption" color="textMuted">
            {description}
          </AppText>
        ) : null}
      </Stack>
      <Stack gap="md" style={{ marginTop: 4 }}>
        {children}
      </Stack>
    </Card>
  );
}
