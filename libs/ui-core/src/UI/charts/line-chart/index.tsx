import React from "react";
import { ApexOptions } from "apexcharts";

import CardHeader from "@mui/material/CardHeader";
import Card, { CardProps } from "@mui/material/Card";
import { Box, Grid, Skeleton, useTheme } from "@mui/material";

import Chart, { useChart } from "../chart-helpers";
import { FailedToLoadComponent } from "../chart-failed";

// ----------------------------------------------------------------------

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
const GridWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Grid item xs={12}>
    {children}
  </Grid>
);
export const LineChart = ({
  title,
  subheader,
  chart,
  status,
  ...other
}: Props) => {
  const theme = useTheme();
  const {
    colors = [
      theme.palette.primary.main,
      theme.palette.success.light,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.light,
    ],
    categories,
    series,
    options,
  } = chart;

  const chartOptions = useChart({
    colors,
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    xaxis: {
      categories,
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
              type="area"
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
};
