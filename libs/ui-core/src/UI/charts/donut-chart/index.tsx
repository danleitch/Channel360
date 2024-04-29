import React from "react";
import sumBy from "lodash/sumBy";
import { ApexOptions } from "apexcharts";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Grid, Skeleton } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Card, { CardProps } from "@mui/material/Card";
import { alpha, useTheme } from "@mui/material/styles";

import Chart, { useChart } from "../chart-helpers";
import { FailedToLoadComponent } from "../chart-failed";
import { fShortenNumber } from "../chart-helpers/format-number";

// ----------------------------------------------------------------------

type ItemProps = {
  label: string;
  value: number;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  percentageOf: string;
  label?: string;
  keyLabel: string;
  chart: {
    colors?: string[];
    series: ItemProps[];
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

export const DonutChart = ({
  percentageOf,
  title,
  subheader,
  label,
  keyLabel,
  chart,
  status,
  useGridWrapper = true,
  ...other
}: Props) => {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;

  const total = sumBy(series, "value");
  const foundItem = series.find((i) => i.label === percentageOf);
  const chartSeries =
    series.length > 0 && foundItem ? (foundItem.value / total) * 100 : 0;

  const chartOptions = useChart({
    legend: {
      show: false,
    },
    grid: {
      padding: { top: -32, bottom: -32 },
    },
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: "64%" },
        dataLabels: {
          name: { offsetY: -16 },
          value: { offsetY: 8 },
          total: {
            label,
            formatter: () => fShortenNumber(total),
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
          <CardHeader title={title} subheader={subheader} sx={{ mb: 8 }} />
          <Chart
            key={total}
            dir="ltr"
            type="radialBar"
            series={[chartSeries]}
            options={chartOptions}
            width="100%"
            height={320}
          />
          <Stack spacing={2} sx={{ p: 5 }}>
            {series.map((item) => (
              <Stack
                key={item.label}
                spacing={1}
                direction="row"
                alignItems="center"
                sx={{
                  typography: "subtitle2",
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: alpha(theme.palette.grey[500], 0.16),
                    borderRadius: 0.75,
                    ...(item.label === percentageOf && {
                      bgcolor: colors[1],
                    }),
                  }}
                />
                <Box sx={{ color: "text.secondary", flexGrow: 1 }}>
                  {item.label}
                </Box>
                {item.value} {keyLabel}
              </Stack>
            ))}
          </Stack>
        </Card>
      ) : (
        <FailedToLoadComponent />
      )}
    </>
  );

  return useGridWrapper ? <GridWrapper>{content}</GridWrapper> : <>{content}</>;
};
