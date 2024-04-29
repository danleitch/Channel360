import { Dayjs } from "dayjs";
import React, { useState, useEffect, FunctionComponent } from "react";

import { PieChart } from "../pie-chart";
import ColumnChart from "../column-chart";
import { LineChart } from "../line-chart";
import { DonutChart } from "../donut-chart";
import { ProgressChart } from "../progress-chart";
import { StackedColumnChart } from "../stacked-column-chart";

interface fetchChartDataFunc {
  (id: string, startDate?: Dayjs, endDate?: Dayjs): Promise<ChartData>;
}

interface DynamicChartProps {
  chartId: string;
  chartType: string;
  fetchChartData: fetchChartDataFunc;
}

interface ChartSeries {
  name: string;
  data: number[];
}

interface ChartData {
  chart: {
    colors: string[];
    categories: string[];
    series: ChartSeries[];
  };
}

type ChartComponentType =
  | typeof PieChart
  | typeof ColumnChart
  | typeof LineChart
  | typeof DonutChart
  | typeof ProgressChart
  | typeof StackedColumnChart
  | null;

export const DynamicChart: React.FC<DynamicChartProps> = ({
  chartId,
  chartType,
  fetchChartData,
}) => {
  const [chartData, setChartData] = useState<ChartData>({
    chart: {
      colors: [],
      categories: [],
      series: [],
    },
  });
  const [status, setStatus] = useState<string>("loading");

  const getComponentType = (type: string): ChartComponentType => {
    switch (type) {
      case "DonutChart":
        return DonutChart;
      case "PieChart":
        return PieChart;
      case "ColumnChart":
        return ColumnChart;
      case "LineChart":
        return LineChart;
      case "ProgressChart":
        return ProgressChart;
      case "FailedChart":
        return ProgressChart;
      case "StackedColumnChart":
        return StackedColumnChart;
      default:
        return null;
    }
  };

  useEffect(() => {
    setStatus("loading");
    const fetchData = async () => {
      try {
        const data = await fetchChartData(chartId);

        setChartData(data);
        setStatus("success");
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        setStatus("failed");
      }
    };

    if (chartId) {
      fetchData().catch((error) =>
        console.error("Error fetching chart data:", error)
      );
    }
  }, [chartId, fetchChartData]);

  const ChartComponent = getComponentType(
    chartType
  ) as FunctionComponent<any> | null;
  const chartProps = {
    ...chartData,
    status,
    chart: {
      ...chartData.chart,
      colors: chartData.chart.colors,
    },
  };

  return ChartComponent ? <ChartComponent {...chartProps} /> : null;
};
