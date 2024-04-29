import Case from "case";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Box, Button, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { RHFTextField } from "./rhf-text-field";

interface UploadFileProps {
  name: string;
  fileType: string;
}

const Input = styled("input")({
  display: "none",
});

export const RHFUploadFile: React.FC<UploadFileProps> = ({
  name,
  fileType,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <RHFTextField
            name="upload-file"
            label={Case.title(name)}
            variant="outlined"
            disabled={!value}
            error={!!error}
            helperText={error?.message}
            autoFocus
            value={value ? `${value[0]?.name?.substring(0, 20)  }...` : ""}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Button
                  sx={{ height: "100%", width: "50%" }}
                  variant="contained"
                  color="primary"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload
                  <Input
                    accept={fileType}
                    type="file"
                    onChange={(e) => {
                      onChange(e.target.files);
                    }}
                  />
                </Button>
              ),
            }}
          />
        </Box>
      )}
    />
  );
};
