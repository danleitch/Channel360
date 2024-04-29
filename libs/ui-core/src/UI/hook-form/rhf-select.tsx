import React, { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import SearchIcon from "@mui/icons-material/Search";
import {
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  ListSubheader,
  FormHelperText,
  InputAdornment,
  SelectProps,
} from "@mui/material";

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

type RHFSelectProps = SelectProps &{
  helperText?: string;
  name: string;
  options: any[];
  valueKey?: string;
  labelKey?: string;
  label: string;
  onSelection?: (e: any) => void;
};

export const RHFSelect = ({
  helperText,
  name,
  options,
  valueKey,
  labelKey,
  label,
  onSelection,
  ...other
}: RHFSelectProps) => {
  const { control } = useFormContext();
  const [searchText, setSearchText] = useState<string>("");

  const isOptionObject = (option: any) => option && typeof option === "object";

  const containsText = (option: any, searchText: string, labelKey?: string) =>
    labelKey
      ? option[labelKey]
          ?.toString()
          .toLowerCase()
          .includes(searchText.toLowerCase())
      : option.toString().toLowerCase().includes(searchText.toLowerCase());

  const displayedOptions = useMemo(() => {
    if (!searchText) {
      return options;
    }
    return options.filter((option: any) =>
      isOptionObject(option)
        ? containsText(option, searchText, labelKey)
        : option.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  }, [options, searchText, labelKey]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            label={label}
            MenuProps={MenuProps}
            onChange={(e) => {
              if (onSelection) {
                onSelection(e);
              }
              field.onChange(e.target.value);
            }}
            {...other}
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
              <MenuItem
                data-cy={`selector_${option[labelKey!]}`}
                key={index}
                value={
                  isOptionObject(option)
                    ? valueKey
                      ? option[valueKey]
                      : JSON.stringify(option)
                    : option
                }
              >
                {isOptionObject(option)
                  ? labelKey
                    ? option[labelKey]
                    : option.toString()
                  : option}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{error ? error?.message : helperText}</FormHelperText>
        </FormControl>
      )}
    />
  );
};
