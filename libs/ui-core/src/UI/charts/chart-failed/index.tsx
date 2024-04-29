import React from "react";

import { Stack, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const FailedToLoadComponent = () => (
  <Stack
    direction="column"
    spacing={2}
    alignItems="center"
    justifyContent="center"
    sx={{ p: 3 }}
  >
    <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
    <Typography variant="subtitle1" color="error">
      Failed to Load
    </Typography>
  </Stack>
);
