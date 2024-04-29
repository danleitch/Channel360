import React from "react";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";

interface TimePickerProps {
  label: string;
  name: string;
  handleChange?: (e: any) => void;
  defaultValue?: any;
}

export const RHFDateTimePicker: React.FC<TimePickerProps> = ({
  label,
  name,
  handleChange = null,
  defaultValue,
  ...other
}) => {
  const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || dayjs(new Date())}
        render={({ field }) => (
          <DateTimePicker {...field} label={label} {...other} />
        )}
      />
    </LocalizationProvider>
  );
};
