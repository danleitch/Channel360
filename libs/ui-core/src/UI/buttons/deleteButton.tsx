import React from "react";

import LoadingButton from "@mui/lab/LoadingButton";

export const DeleteButton = (params: any) => (
    <LoadingButton
      data-cy="button__delete"
      color="error"
      size="large"
      variant="contained"
      type="submit"
      {...params}
    >
      {params.buttontext ? params.buttontext : "Delete"}
    </LoadingButton>
  );
