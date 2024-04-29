import React from "react";

import { DonutChart } from "./index";

export default {
  title: "Charts/Donut Chart",
  component: DonutChart,
};

const Template = () => (
  <DonutChart
    status="success"
    percentageOf="Read"
    title="Read/Unread"
    keyLabel="Messages"
    chart={{
      series: [
        { label: "Read", value: 20 },
        { label: "Unread", value: 66 },
      ],
    }}
  />
);

export const Default = Template.bind({});
