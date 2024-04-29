import React from "react";
import { ApexOptions } from "apexcharts";

import Box from "@mui/material/Box";
import { Grid, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import Card, { CardProps } from "@mui/material/Card";

import Chart, { useChart } from "../chart-helpers";
import { FailedToLoadComponent } from "../chart-failed";

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ApexOptions;
  };
  status: "loading" | "success" | "failed";
}

const truncateLabel = (label: string, maxLength: number = 10) => {
  if (label.length > maxLength) {
    return `${label.substring(0, maxLength)}...`; // Truncate and add ellipsis
  }
  return label;
};

export const StackedColumnChart = ({
  title,
  subheader,
  chart,
  status,
  ...other
}: Props) => {
  const theme = useTheme();
  const {
    categories,
    colors = [
      theme.palette.primary.main,
      theme.palette.success.light,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.light,
    ],
    series,
    options,
  } = chart;

  const chartOptions = useChart({
    chart: {
      stacked: true,
    },
    colors,
    stroke: {
      width: 0,
    },
    xaxis: {
      categories: categories?.map((cat) => truncateLabel(cat)),
      labels: {
        formatter: (val: string) => truncateLabel(val),
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value}`,
      },
      // @ts-ignore
      x: {
        formatter: (val: string) => {
          const originalLabel =
            categories?.find((cat) => truncateLabel(cat) === val) || val;
          return originalLabel;
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "20%",
      },
    },
    ...options,
  });

  return (
    <Grid item xs={12} md={6} lg={6} xl={6}>
      {status === "loading" && (
        <>
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="rectangular" width="100%" height={450} />
          <Skeleton variant="text" />
        </>
      )}
      {status === "success" && (
        <Card {...other}>
          <CardHeader title={title} subheader={subheader} />

          <Box sx={{ p: 3, pb: 1 }}>
            <Chart
              dir="ltr"
              type="bar"
              series={series}
              options={chartOptions}
              width="100%"
              height={390}
            />
          </Box>
        </Card>
      )}

      {status === "failed" && <FailedToLoadComponent />}
    </Grid>
  );
};
