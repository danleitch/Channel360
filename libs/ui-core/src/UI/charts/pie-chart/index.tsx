import React from "react";
import { ApexOptions } from "apexcharts";

import { Grid, Skeleton } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Card, { CardProps } from "@mui/material/Card";
import { styled, useTheme } from "@mui/material/styles";

import Chart, { useChart } from "../chart-helpers";
import { FailedToLoadComponent } from "../chart-failed";
import { fNumber } from "../chart-helpers/format-number";

// ----------------------------------------------------------------------

const CHART_HEIGHT = 397;
const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  "& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject": {
    height: `100% !important`,
  },
  "& .apexcharts-legend": {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: {
      label: string;
      value: number;
    }[];
    options?: ApexOptions;
  };
  status: "loading" | "success" | "failed";
  useGridWrapper?: boolean;
}

const GridWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Grid item xs={12} md={12} lg={4} xl={3}>
    {children}
  </Grid>
);

export const PieChart = ({
  title,
  subheader,
  chart,
  status,
  useGridWrapper = true,
  ...other
}: Props) => {
  const theme = useTheme();

  const {
    colors = [
      theme.palette.primary.main,
      theme.palette.warning.light,
      theme.palette.success.light,
    ],
    series,
    options,
  } = chart;

  const hasData = series.some(({ value }) => value && value > 0);

  const chartSeries = hasData ? series.map((i) => i.value) : [1];
  const chartLabels = hasData ? series.map((i) => i.label) : ["No Data"];

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: chartLabels,
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      floating: true,
      position: "bottom",
      horizontalAlign: "center",
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: (seriesName: string) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    ...options,
  });

  const content = (
    <>
      {status === "loading" ? (
        <>
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="rectangular" width="100%" height={450} />
          <Skeleton variant="text" width="100%" />
        </>
      ) : status === "success" ? (
        <Card {...other}>
          <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />
          <StyledChart
            dir="ltr"
            type="pie"
            series={chartSeries}
            options={chartOptions}
            width="100%"
            height={280}
          />
        </Card>
      ) : (
        <FailedToLoadComponent />
      )}
    </>
  );

  return useGridWrapper ? <GridWrapper>{content}</GridWrapper> : <>{content}</>;
};
