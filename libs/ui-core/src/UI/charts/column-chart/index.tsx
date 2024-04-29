import React from "react";
import { ApexOptions } from "apexcharts";

import { Box, Grid } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import Card, { CardProps } from "@mui/material/Card";

import Chart, { useChart } from "../chart-helpers";
import { FailedToLoadComponent } from "../chart-failed";

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories: string[];
    colors?: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ApexOptions;
  };
  status: "loading" | "success" | "failed";
}

const GridWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Grid item xs={12} md={6} lg={6} xl={6}>
    {children}
  </Grid>
);

export default function ColumnChart({
  title,
  subheader,
  chart,
  status,
  ...other
}: Props) {
  const theme = useTheme();
  const {
    categories,
    series,
    options,
    colors = [
      theme.palette.primary.main,
      theme.palette.success.light,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.light,
    ],
  } = chart;

  const truncatedCategories = categories?.map((category) =>
    category.length > 20 ? `${category.substring(0, 20)}...` : category
  );

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: "20%",
        distributed: true,
        borderRadius: 6,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: truncatedCategories,
    },
    legend: {
      show: false,
    },

    tooltip: {
      y: {
        formatter: (value: number) => `${value}`,
      },
      x: {
        formatter: (_, { dataPointIndex }) => `${categories[dataPointIndex]}`,
      },
    },
    ...options,
  });

  if (status === "loading") {
    return (
      <GridWrapper>
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="rectangular" width="100%" height={450} />
        <Skeleton variant="text" />
      </GridWrapper>
    );
  }

  if (status === "success") {
    return (
      <GridWrapper>
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
      </GridWrapper>
    );
  }
  return (
    <GridWrapper>
      <FailedToLoadComponent />
    </GridWrapper>
  );
}
