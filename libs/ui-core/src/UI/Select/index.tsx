import React, { useMemo, useState } from "react";
import { Path, Control, Controller, FieldValues } from "react-hook-form";

import SearchIcon from "@mui/icons-material/Search";
import {
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  ListSubheader,
  FormHelperText,
  InputAdornment,
  Select as MuiSelect,
} from "@mui/material";

interface SelectProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  field: Path<T>;
  options: Array<{ [key: string]: any }>;
  valueKey: string;
  labelKey: string;
  label: string;
  id?: string;
  errors: Record<string, { message?: string }>;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  autoFocus: false,
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const containsText = (option: any, searchText: string, labelKey: string) =>
  option[labelKey].toLowerCase().includes(searchText.toLowerCase());

export const Select = <T extends FieldValues = FieldValues>({
  control,
  field,
  options,
  valueKey,
  labelKey,
  label,
  id = "demo-simple-select",
  errors,
}: SelectProps<T>): JSX.Element => {
  const [searchText, setSearchText] = useState<string>("");

  const displayedOptions = useMemo(() => {
    if (!searchText) {
      return options;
    }
    return options.filter((option) =>
      containsText(option, searchText, labelKey)
    );
  }, [options, searchText, labelKey]);

  return (
    <Controller
      name={field}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <FormControl fullWidth error={!!errors[field]}>
          <InputLabel id={`${id}-label`}>{label}</InputLabel>
          <MuiSelect
            labelId={`${id}-label`}
            id={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            label={label}
            MenuProps={MenuProps}
          >
            {options?.length > 5 && (
              <ListSubheader>
                <TextField
                  size="small"
                  autoFocus
                  placeholder="Type to search..."
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== "Escape") {
                      e.stopPropagation();
                    }
                  }}
                />
              </ListSubheader>
            )}
            {displayedOptions?.map((option, index) => (
              <MenuItem key={index} value={option[valueKey]}>
                {option[labelKey]}
              </MenuItem>
            ))}
          </MuiSelect>
          <FormHelperText>{errors[field]?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
};
