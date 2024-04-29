import React from "react";

import Button from "@mui/material/Button";

import { CallToAction, CallToActionSchema } from "./call-to-action";

interface ListCallToActionProps {
  fields: CallToActionFields[];
  remove: (index?: number | number[]) => void;
  append: (
    obj: CallToActionSchema | CallToActionSchema[],
    focusOptions?: any
  ) => void;
}
export type CallToActionFields = { id: string } & CallToActionSchema;

export const ListCallToAction: React.FC<ListCallToActionProps> = ({
  fields,
  append,
  remove,
}) => {
  const handleAppend = () => {
    const existingTypes = fields.map((field) => field.type);

    if (!existingTypes.includes("PHONE_NUMBER")) {
      append({ type: "PHONE_NUMBER", text: "", phoneNumber: "" });
    } else if (!existingTypes.includes("URL")) {
      append({ type: "URL", text: "", url: "" });
    }
  };

  return (
    <>
      {fields.map((field, index) => (
        <CallToAction
          key={field.id}
          field={field}
          append={append}
          index={index}
          remove={() => remove(index)}
          fields={fields}
        />
      ))}

      {fields.length < 2 && (
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
