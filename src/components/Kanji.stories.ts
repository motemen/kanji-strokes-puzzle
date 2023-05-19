import type { Meta, StoryObj } from "@storybook/react";

import { Kanji } from "./Kanji";

const meta: Meta<typeof Kanji> = {
  title: "Kanji",
  component: Kanji,
};

export default meta;
type Story = StoryObj<typeof Kanji>;

export const Default: Story = {
  args: {
    char: "神",
  },
};

export const FilterSVG: Story = {
  args: {
    char: "神",
    filterSVG: (svg) => {
      svg.querySelectorAll('[id^="kvg:StrokeNumbers_"]').forEach((path) => {
        path.remove();
      });
      return svg;
    },
  },
};
