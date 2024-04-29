import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Stack, Skeleton } from "@mui/material";

import { FailedToLoadComponent } from "../chart-failed";
import { fNumber } from "../chart-helpers/format-number";

interface Props {
  title: string;
  total: number;
  icon: React.ReactElement;
  status: string;
  sx?: any;
}

export const CardSummary = ({
  title,
  total,
  icon,
  sx,
  status,
  ...other
}: Props) => {
  let content;

  switch (status) {
    case "loading":
      content = (
        <Stack direction="row" spacing={3} justifyContent="space-between">
          <Stack direction="column" spacing={2}>
            <Skeleton variant="text" width={150} height={60} />
            <Skeleton variant="text" width={200} />
          </Stack>
          <Skeleton variant="circular" width={150} height={150} />
        </Stack>
      );
      break;
    case "failed":
      content = <FailedToLoadComponent />;
      break;
    case "success":
    default:
      content = (
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            pl: 3,
            ...sx,
          }}
          {...other}
        >
          <Box>
            <Box sx={{ mb: 1, typography: "h3" }}>{fNumber(total)}</Box>
            <Box sx={{ color: "text.secondary", typography: "subtitle2" }}>
              {title}
            </Box>
          </Box>
          <Box
            sx={{
              width: 120,
              height: 120,
              lineHeight: 0,
              borderRadius: "50%",
            }}
          >
            {icon}
          </Box>
        </Card>
      );
  }

  return <>{content}</>;
};
