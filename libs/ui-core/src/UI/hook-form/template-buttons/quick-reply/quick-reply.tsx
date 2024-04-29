import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Card, Stack, TextField, IconButton } from "@mui/material";

export type QuickReplySchema = {
  type: string;
  text: string;
};
interface ListQuickReplyProps {
  fields: QuickReplyFields[];
  remove: (index?: number | number[]) => void;
  append: (
    obj: QuickReplySchema | QuickReplySchema[],
    focusOptions?: any
  ) => void;
}

export type QuickReplyFields = { id: string } & QuickReplySchema;

export const ListQuickReply: React.FC<ListQuickReplyProps> = ({
  fields,
  append,
  remove,
}) => {
  const handleAppend = () => {
    append({ type: "QUICK_REPLY", text: "" });
  };
  const { control } = useFormContext();
  return (
    <>
      {fields.map((field, index) => (
        <Card
          key={field.id}
          variant="outlined"
          sx={{
            width: "100%",
            mt: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            direction="row"
            sx={{
              width: "100%",
              maxWidth: "80%",
              alignItems: "center",
              mt: 4,
              mb: 4,
            }}
          >
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

            {fields.length > 1 && (
              <Box sx={{ mt: 0.3, ml: 1 }}>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => remove(index)}
                >
                  <CloseIcon color="error" />
                </IconButton>
              </Box>
            )}
          </Stack>
        </Card>
      ))}

      {fields.length < 3 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAppend}
          sx={{ mt: 2 }}
        >
          Add Button
        </Button>
      )}
    </>
  );
};
