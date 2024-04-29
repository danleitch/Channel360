import React from "react";

import { DynamicChart } from "./index";
import {
  ColumnChartObject,
  DonutChartObject,
  LineChartObject,
  PieChartObject,
  ProgressChartObject,
  StackedColumnChartObject,
} from "./mock-objects";
import { Grid } from "@mui/material";
export default {
  title: "Charts/Render Chart",
  component: DynamicChart,
};

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const fetchChartData = async (chartId) => {
  await delay(500);

  if (chartId === "FailedChart") {
    throw new Error("Failed to fetch chart data.");
  }

  let response;
  if (chartId === "ColumnChart") {
    response = ColumnChartObject;
  } else if (chartId === "PieChart") {
    response = PieChartObject;
  } else if (chartId === "DonutChart") {
    response = DonutChartObject;
  } else if (chartId === "LineChart") {
    response = LineChartObject;
  } else if (chartId === "ProgressChart") {
    response = ProgressChartObject;
  } else if (chartId === "StackedColumnChart") {
    response = StackedColumnChartObject;
  }

  return response;
};

const Template = ({ charts }) => (
  <Grid container spacing={3}>
    {charts.map(({ chartId, chartType }) => (
      <DynamicChart
        key={chartId}
        chartId={chartId}
        chartType={chartType}
        fetchChartData={fetchChartData}
      />
    ))}
  </Grid>
);

export const Default = Template.bind({});
Default.args = {
  charts: [
    { chartId: "StackedColumnChart", chartType: "StackedColumnChart" },
    { chartId: "ColumnChart", chartType: "ColumnChart" },
    { chartId: "DonutChart", chartType: "DonutChart" },
    { chartId: "PieChart", chartType: "PieChart" },
    { chartId: "LineChart", chartType: "LineChart" },
    { chartId: "ProgressChart", chartType: "ProgressChart" },
  ],
};

export const WithFailedResponse = Template.bind({});
WithFailedResponse.args = {
  charts: [
    { chartId: "ColumnChart", chartType: "ColumnChart" },
    { chartId: "FailedChart", chartType: "FailedChart" },
    { chartId: "LineChart", chartType: "LineChart" },
  ],
};
