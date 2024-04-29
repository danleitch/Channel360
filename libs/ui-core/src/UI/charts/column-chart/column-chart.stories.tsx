import React from "react";

import ColumnChart from "./index";

export default {
  title: "Charts/Column Chart",
  component: ColumnChart,
};

const Template = () => {
  return (
    <ColumnChart
      status={"success"}
      title="Notification Metrics"
      chart={{
        categories: [
          "Read",
          "Delivered",
          "Delivered To Handset",
          "Failed",
          "Pending",
        ],

        series: [
          {
            name: "Messages",
            data: [5, 4, 3, 2, 1],
          },
        ],
      }}
    />
  );
};

export const Default = Template.bind({});
