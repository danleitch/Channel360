import Case from "case";
import React, { FC } from "react";

import { alpha } from "@mui/material/styles";
import {
  Box,
  Card,
  Stack,
  CardHeader,
  Typography,
  LinearProgress,
} from "@mui/material";

import { fShortenNumber } from "../chart-helpers/format-number";

// ----------------------------------------------------------------------

interface Data {
  label: string;
  quantity: number;
  value: number;
}

interface ProgressLineChartProps {
  title: string;
  subheader?: string;
  data: Data[];
}

export const ProgressLineChart: FC<ProgressLineChartProps> = ({
  title,
  subheader,
  data,

  ...other
}) => {
  const total = data.reduce((acc, progress) => acc + progress.quantity, 0);
  const normalise = (value: number) => ((value - 0) * 100) / (total - 0);
  return (
    <Card
      sx={{
        ...other,
      }}
    >
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3} sx={{ px: 3, my: 5 }}>
        {data.map((progress, index) => (
          <LinearProgress
            variant="determinate"
            key={index}
            value={normalise(progress.value)}
            sx={{
              height: 8,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
              ".MuiLinearProgress-bar": {
                backgroundColor:
                  progress.label === "unread" ? "#ABB0B8" : undefined,
              },
            }}
            color={
              (progress.label === "Pending" && "warning") ||
              (progress.label === "Failed" && "error") ||
              (progress.label === "OutForDelivery" && "secondary") ||
              (progress.label === "Delivered" && "success") ||
              (progress.label === "Read" && "primary") ||
              "secondary"
            }
          />
        ))}
      </Stack>

      <Stack
        direction="row"
        sx={{ px: 3, pb: 3 }}
        justifyContent="space-between"
      >
        {data.map((progress, index) => (
          <Stack key={index} alignItems="center">
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mr: 1, mb: 1 }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: "secondary.main",
                  ...(progress.label === "Pending" && {
                    bgcolor: "warning.main",
                  }),
                  ...(progress.label === "Failed" && {
                    bgcolor: "error.main",
                  }),
                  ...(progress.label === "OutForDelivery" && {
                    bgcolor: "secondary.main",
                  }),
                  ...(progress.label === "Delivered" && {
                    bgcolor: "success.main",
                  }),
                  ...(progress.label === "Read" && {
                    bgcolor: "primary.main",
                  }),
                }}
              />

              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                {Case.capital(progress.label)}
              </Typography>
            </Stack>

            <Typography variant="h6">
              {progress.quantity > 0 ? fShortenNumber(progress.quantity) : 0}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};
