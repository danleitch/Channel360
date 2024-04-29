import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { RootState } from 'src/redux/store';
import { setDateRange } from 'src/redux/slices/dashboard/date-range-slice';

export default function DateSelector() {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state: RootState) => state.dateRange);

  const handleStartDateChange = (newValue: Dayjs | null) => {
    const startOfDay = newValue ? newValue.startOf('day').toISOString() : null;
    dispatch(
      setDateRange({
        startDate: startOfDay,
        endDate,
      })
    );
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    const endOfDay = newValue ? newValue.endOf('day').toISOString() : null;
    dispatch(
      setDateRange({
        startDate,
        endDate: endOfDay,
      })
    );
  };

  const threeMonths = dayjs().subtract(3, 'month');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" spacing={2}>
        <DatePicker
          minDate={threeMonths}
          views={['year', 'month', 'day']}
          disableFuture
          label="Start Date"
          value={dayjs(startDate)}
          onChange={handleStartDateChange}
        />
        <DatePicker
          minDate={threeMonths}
          views={['year', 'month', 'day']}
          disableFuture
          label="End Date"
          value={dayjs(endDate)}
          onChange={handleEndDateChange}
        />
      </Stack>
    </LocalizationProvider>
  );
}
