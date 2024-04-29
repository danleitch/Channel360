import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";

import {
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Select as MuiSelect,
} from "@mui/material";

import { ListQuickReply, QuickReplyFields } from "./quick-reply/quick-reply";
import {
  ListCallToAction,
  CallToActionFields,
} from "./call-to-action/list-call-to-action";

const buttonSchemas = {
  QUICK_REPLY: { type: "QUICK_REPLY", text: "" },
  PHONE_NUMBER: { type: "PHONE_NUMBER", text: "", phoneNumber: "" },
};
export const TemplateButtons = () => {
  const { fields, append, remove } = useFieldArray({
    name: "buttons",
  });
  const [buttonType, setButtonType] = useState<string>("");

  const handleButtonsTypeChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value as string;
    setButtonType(value);
    if (value === "CALL_TO_ACTION") {
      remove();
      append(buttonSchemas.PHONE_NUMBER);
    } else if (value === "QUICK_REPLY") {
      remove();
      append(buttonSchemas.QUICK_REPLY);
    } else if (value === "None") {
      remove();
    }
  };
  const renderButtons = () => {
    if (buttonType === "QUICK_REPLY") {
      return (
        <ListQuickReply
          fields={fields as unknown as QuickReplyFields[]}
          append={append}
          remove={remove}
        />
      );
    }
    if (buttonType === "CALL_TO_ACTION") {
      return (
        <ListCallToAction
          fields={fields as unknown as CallToActionFields[]}
          append={append}
          remove={remove}
        />
      );
    }
    return null;
  };

  return (
    <>
      <FormControl>
        <InputLabel>Button</InputLabel>
        <MuiSelect
          value={buttonType}
          label="Button"
          onChange={handleButtonsTypeChange}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="QUICK_REPLY">Quick Reply</MenuItem>
          <MenuItem value="CALL_TO_ACTION">Call to Action</MenuItem>
        </MuiSelect>
      </FormControl>
      {renderButtons()}
    </>
  );
};
