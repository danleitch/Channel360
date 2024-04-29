import React from "react";

import { LineChart } from "./index";

export default {
  title: "Charts/Line Chart",
  component: LineChart,
};

const Template = () => {
  return (
    <LineChart
      status="success"
      title="Message Performance"
      chart={{
        categories: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        series: [
          {
            name: "Read",
            data: [10, 41, 35, 51, 49, 62, 69],
          },
          {
            name: "Delivered",
            data: [10, 34, 13, 56, 77, 88, 99],
          },
          {
            name: "Delivered To Handset",
            data: [10, 23, 33, 86, 27, 84, 69],
          },
          {
            name: "Failed",
            data: [3, 25, 76, 23, 87, 12, 2],
          },
          {
            name: "Pending",
            data: [89, 34, 23, 56, 67, 79, 100],
          },
        ],
      }}
    />
  );
};

export const Default = Template.bind({});
