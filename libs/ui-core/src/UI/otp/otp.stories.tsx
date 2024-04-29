// OtpInput.stories.ts|tsx
import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";

import { OtpInput } from "./index";

const meta: Meta = {
  component: OtpInput,
  title: "UI/OtpInput",
};

export default meta;

type Story = StoryObj<typeof OtpInput>;

export const Default: Story = {};

export const SimulatedOtpEntry: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const otpFields = canvas.getAllByPlaceholderText("-");

    for (let i = 0; i < otpFields.length; i++) {
      await userEvent.type(otpFields[i], (i + 1).toString());
    }

    for (let i = 0; i < otpFields.length; i++) {
      await expect(otpFields[i]).toHaveValue((i + 1).toString());
    }
  },
};

export const PastedOtpEntry: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const otpFields = canvas.getAllByPlaceholderText("-");

    const pasteEvent = new Event("paste", {
      bubbles: true,
      cancelable: true,
    }) as any;
    pasteEvent.clipboardData = { getData: (_format: string) => "555555" };

    otpFields[0].dispatchEvent(pasteEvent);

    await new Promise((r) => setTimeout(r, 100));

    for (let i = 0; i < otpFields.length; i++) {
      await expect(otpFields[i]).toHaveValue("5");
    }
  },
};
