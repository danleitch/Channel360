import React from "react";

import { StackedColumnChart } from "./index";

export default {
  title: "Charts/Stacked Column Chart",
  component: StackedColumnChart,
};

const Template = () => {
  return (
    <StackedColumnChart
      status="success"
      title="Campaign Comparison"
      chart={{
        categories: [
          "Campaign 1",
          "Campaign 2",
          "Campaign 3",
          "Campaign 4",
          "Campaign 5",
          "Campaign 6",
        ],

        series: [
          {
            name: "READ",
            data: [44000, 55000, 41000, 40000, 40000, 40000],
          },
          {
            name: "DELIVERED",
            data: [48000, 50000, 40000, 40000, 40000, 40000],
          },
          {
            name: "FAILED",
            data: [13000, 36000, 20000, 20000, 20000, 20000],
          },
        ],
      }}
    />
  );
};

export const Default = Template.bind({});
