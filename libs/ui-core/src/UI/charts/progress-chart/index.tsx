import React from "react";

import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import CardHeader from "@mui/material/CardHeader";
import LinearProgress from "@mui/material/LinearProgress";

import { FailedToLoadComponent } from "../chart-failed";

interface ChartSeries {
  label: string;
  value: number;
}

interface ChartProps {
  colors: string[];
  series: ChartSeries[];
}

interface Props {
  title?: string;
  subheader?: string;
  chart: ChartProps;
  status: "loading" | "success" | "failed";
}

const GridWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Grid item xs={12} md={12} lg={4} xl={3.5}>
    {children}
  </Grid>
);

export const ProgressChart = ({ title, subheader, chart, status }: Props) => {
  const maxQuantity = Math.max(...chart.series.map((item) => item.value));

  if (status === "loading") {
    return (
      <GridWrapper>
        <Skeleton variant="text" width="20%" />
        <Skeleton variant="rectangular" width="100%" height={335} />
      </GridWrapper>
    );
  }

  if (status === "success") {
    return (
      <GridWrapper>
        <Card>
          <CardHeader title={title} subheader={subheader} />
          <Stack spacing={3} sx={{ p: 3 }}>
            {chart.series.map((item) => (
              <Box key={item.label}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Box sx={{ typography: "overline" }}>{item.label}</Box>
                  <Box sx={{ typography: "subtitle1" }}>{item.value}</Box>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(item.value / maxQuantity) * 100}
                  sx={{
                    height: 8,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
                    "& .MuiLinearProgress-bar": {
                      bgcolor: (theme) => {
                        if (item.label === "Pending")
                          return theme.palette.warning.main;
                        if (item.label === "Canceled")
                          return theme.palette.error.main;
                        return theme.palette.success.main;
                      },
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
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
