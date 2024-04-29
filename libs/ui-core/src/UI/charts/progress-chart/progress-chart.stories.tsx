import React from "react";

import { ProgressChart } from "./index";

export default {
  title: "Charts/Progress Chart",
  component: ProgressChart,
};

const Template = () => {
  return (
    <ProgressChart
      status="success"
      title="Message Categories"
      chart={{
        colors: ["#ff9800", "#9e9e9e", "#3f51b5"],
        series: [
          {
            label: "Pending",
            value: 40,
          },
          {
            label: "Canceled",
            value: 2,
          },
          {
            label: "Completed",
            value: 10,
          },
        ],
      }}
    />
  );
};

export const Default = Template.bind({});
