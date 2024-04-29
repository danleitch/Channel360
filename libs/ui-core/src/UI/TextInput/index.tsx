import Case from "case";
import React from "react";
import { Controller } from "react-hook-form";

import { TextField, InputProps, TextFieldProps } from "@mui/material";

export interface TextInputProps {
  control: any;
  errors: any;
  field: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  InputProps?: InputProps;
  variant?: TextFieldProps["variant"];
  defaultValue?: string;
  label?: string;
  id?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  control,
  errors,
  field,
  type,
  multiline = false,
  rows,
  InputProps,
  variant,
  defaultValue,
  label,
}) => (
    <Controller
      key={id}
      name={field}
      control={control}
      defaultValue={defaultValue}
      render={({ field: fieldName }) => (
        <TextField
          fullWidth
          data-cy={`test-${Case.kebab(field)}`}
          data-testid="textfield"
          type={type}
          label={label || Case.title(field)}
          value={fieldName.value}
          onChange={fieldName.onChange}
          onBlur={fieldName.onBlur}
          error={!!errors[field]}
          helperText={errors[field]?.message}
          multiline={multiline}
          rows={rows}
          InputProps={InputProps}
          variant={variant}
          autoComplete="off"
        />
      )}
    />
  );
