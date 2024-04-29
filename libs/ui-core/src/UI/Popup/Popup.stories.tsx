// Popup.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";

import { Popup } from "./index";

export default {
  title: "UI/Popup",
  component: Popup,
} as Meta<typeof Popup>;

type Story = StoryObj<typeof Popup>;

export const Default: Story = {
  args: {
    title: "Popup Title",
    children: "This can be a form",
    header: "Header",
    width: "300px",
    open: true,
  },
};
