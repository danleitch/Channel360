// src/redux/slices/dateRangeSlice.js
import dayjs from 'dayjs';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  startDate: dayjs().subtract(7, 'days').startOf('day').toISOString(),
  endDate: dayjs().endOf('day').toISOString(),
};


export const dateRangeSlice = createSlice({
  name: 'dateRange',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

export const { setDateRange } = dateRangeSlice.actions;

export default dateRangeSlice.reducer;
