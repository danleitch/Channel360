import * as React from "react";

import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";

export interface PopupProps {
  children: React.ReactNode;
  setOpen: (open: boolean) => void;
  open: boolean;
  title: string;
  header?: string;
  width?: string;
  submissionColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
}

export const Popup: React.FC<PopupProps> = ({
  header = " ",
  title = " ",
  children,
  width = "480px",
  setOpen,
  open = true,
}) => (
    <Dialog
      sx={{
        ".MuiDialog-paper": {
          width,
          maxWidth: "100%",
        },
      }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle data-cy="popup__header-title" variant="h3">
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText data-cy="popup__header-text">
          {header}
        </DialogContentText>
        <Stack  sx={{ my: 3 }}>
          {children}
        </Stack>
      </DialogContent>
    </Dialog>
  );
