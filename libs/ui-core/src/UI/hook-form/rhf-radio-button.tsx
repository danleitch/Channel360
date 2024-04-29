import Case from "case";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Radio,
  Tooltip,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

const ToolTips: { [key: string]: string } = {
  "hard-coded":
    "The value is specified on the template, and can not be changed during the campaign creation",
  "on-campaign-creation":
    "The creator of the campaign will be prompted for this value when creating the actual campaign, the same value will be used for all messages in the campaign.",
  "subscriber-field":
    "The value will be taken from the subscriber details, and will be different for each subscriber in the campaign.",
  "csv": "The value will be taken from an external file, and will be different for each subscriber in the campaign.",
  "buttons": "Buttons do not require an index, there can only be one variable in the URL.",
};


interface RadioButtonProps {
  name: string;
  list: string[];
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | null;
  disabled?: boolean;
  defaultValue?: any;
}

export const RHFRadioButton: React.FC<RadioButtonProps> = ({
  name,
  list,
  handleChange = null,
  disabled,
  defaultValue,
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || list[0]}
      render={({ field: { onChange, value } }) => (
        <RadioGroup
          aria-label={Case.title(name)}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            handleChange && handleChange(e);
          }}
        >
          {list.map((listItem, index) => (
            <Box key={index} sx={{ display: "flex" }}>
              <FormControlLabel
                label={Case.capital(listItem)}
                value={listItem}
                control={<Radio disabled={disabled} />}
              />
              {ToolTips[listItem] && (
                <Tooltip title={ToolTips[listItem]} placement="right">
                  <InfoIcon color="action" sx={{ marginLeft: "auto" }} />
                </Tooltip>
              )}
            </Box>
          ))}
        </RadioGroup>
      )}
    />
  );
};
