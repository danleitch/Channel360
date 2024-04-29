import React from "react";

import { Button } from "@mui/material";

export const CancelButton = (params: any) => (
    <Button
      data-cy="button__cancel"
      color="inherit"
      size="large"
      variant="outlined"
      {...params}
    >
      Cancel
    </Button>
  );
