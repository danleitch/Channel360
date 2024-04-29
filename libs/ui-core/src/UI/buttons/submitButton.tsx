import React from "react";

import LoadingButton from "@mui/lab/LoadingButton";

export const SubmitButton = (params: any) => (
    <LoadingButton
      data-cy="button__submit"
      color="primary"
      size="large"
      variant="contained"
      type="submit"
      {...params}
    >
      Confirm
    </LoadingButton>
  );
