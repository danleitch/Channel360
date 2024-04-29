import React, { useState, useEffect } from "react";
import {
  Controller,
  FieldValues,
  useFormContext,
  ControllerRenderProps,
} from "react-hook-form";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Card,
  Stack,
  Select,
  MenuItem,
  TextField,
  IconButton,
  CardActions,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";

export type CallToActionSchema = {
  type: string;
  text: string;
  phoneNumber?: string;
  url?: string;
  example?: string[];
};

type CallToActionProps = {
  fields: CallToActionSchema[];
  remove: (index?: number | number[]) => void;
  append: (
    obj: CallToActionSchema | CallToActionSchema[],
    focusOptions?: any
  ) => void;
  index: number;
  field: CallToActionSchema;
};

export const CallToAction: React.FC<CallToActionProps> = ({
  fields,
  field: parentField,
  index,
  remove,
  append,
}) => {
  const { control, watch, unregister } = useFormContext();
  const [urlInput, setUrlInput] = useState("");

  const watchedUrl = watch(`buttons.${index}.url`);

  useEffect(() => {
    const urlHasParameter = watchedUrl?.endsWith("{{1}}");
    if (!urlHasParameter) {
      unregister(`buttons.${index}.example`);
    }
  }, [watchedUrl, unregister, index]);

  useEffect(
    () => () => {
      setUrlInput("");
    },
    [parentField.type]
  );

  const handleTypeChange = (
    e: SelectChangeEvent,
    field: ControllerRenderProps<FieldValues, `buttons.${number}.type`>
  ) => {
    let newButtonType: CallToActionSchema = {
      type: "PHONE_NUMBER",
      text: "",
      phoneNumber: "",
    };
    if (e.target.value === "URL") {
      newButtonType = {
        type: e.target.value,
        text: "",
        url: "",
      };
    } else if (e.target.value === "PHONE_NUMBER") {
      newButtonType = {
        type: e.target.value,
        text: "",
        phoneNumber: "",
      };
    }
    remove(index);
    append(newButtonType);
    field.onChange(e);
  };
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <CardActions sx={{ marginLeft: "90%" }}>
        {fields.length > 1 ? (
          <Box sx={{ height: "40px" }}>
            <IconButton
              color="error"
              size="small"
              onClick={() => remove(index)}
            >
              <CloseIcon color="error" />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ height: "40px" }} />
        )}
      </CardActions>

      <Stack spacing={3} sx={{ width: "80%" }}>
        <Stack spacing={3} direction="row">
          <Controller
            name={`buttons.${index}.type`}
            control={control}
            defaultValue={parentField.type ? parentField.type : "PHONE_NUMBER"}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl fullWidth disabled={fields.length > 1}>
                <Select
                  {...field}
                  placeholder="name"
                  onChange={(e) => handleTypeChange(e, field)}
                >
                  <MenuItem value="PHONE_NUMBER">Phone Number</MenuItem>
                  <MenuItem value="URL">Website Url</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name={`buttons.${index}.text`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                placeholder="Button Text"
                error={!!error}
                helperText={error?.message}
                {...field}
              />
            )}
          />
        </Stack>
        <Box sx={{ pb: "40px" }}>
          {parentField.type === "PHONE_NUMBER" ? (
            <Controller
              name={`buttons.${index}.phoneNumber`}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Phone Number"
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
          ) : (
            <Stack spacing={3}>
              <Controller
                name={`buttons.${index}.url`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    placeholder="URL"
                    error={!!error}
                    helperText={error?.message}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      field.onChange(e);
                    }}
                    value={field.value}
                  />
                )}
              />

              {urlInput.endsWith("{{1}}") && (
                <Controller
                  name={`buttons.${index}.example`}
                  control={control}
                  defaultValue={[""]}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      error={!!error}
                      helperText={
                        Array.isArray(error)
                          ? error[0]?.message
                          : error?.message
                      }
                      fullWidth
                      placeholder="URL Parameter"
                      onChange={(e) => {
                        const newValue = e.target.value;
                        field.onChange([newValue]);
                      }}
                      value={field.value[0] || ""}
                    />
                  )}
                />
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </Card>
  );
};
