import React from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";

import { Box, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { FormProvider, RHFDateTimePicker } from "./index";

interface RangeProps {
  onSubmit: (data: any) => any;
  providedStartValue?: any;
  providedEndValue?: any;
  loading: boolean;
}

export const RHFRangeSelector: React.FC<RangeProps> = ({
  loading,
  onSubmit,
  providedStartValue,
  providedEndValue,
}) => {
  const methods = useForm();
  const { handleSubmit } = methods;
  const defaultStartDate = dayjs()
    .month(new Date().getMonth())
    .year(new Date().getFullYear())
    .startOf("month");
  const defaultEndDate = dayjs()
    .month(new Date().getMonth())
    .year(new Date().getFullYear())
    .endOf("month");
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack
        sx={{ width: "100%" }}
        direction="row"
        spacing={3}
        justifyContent="flex-end"
        alignItems="center"
      >
        <RHFDateTimePicker
          defaultValue={
            providedStartValue || defaultStartDate
          }
          name="startDate"
          label="Start Date"
        />
        <RHFDateTimePicker
          defaultValue={providedEndValue || defaultEndDate}
          name="endDate"
          label="End Date"
        />

        <Box>
          <LoadingButton
            loading={loading}
            type="submit"
            size="large"
            variant="contained"
          >
            Filter
          </LoadingButton>
        </Box>
      </Stack>
    </FormProvider>
  );
};
