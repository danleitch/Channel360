import { createSlice } from '@reduxjs/toolkit';

import { fetchChartIds } from 'src/redux/thunks/dashboard/fetch-chart-ids';

const initialState = {
  data: [],
  loading: false,
  error: null as ErrorType | null,
};

interface ErrorType {
  message: string;
}

export const chartSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChartIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartIds.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchChartIds.rejected, (state, action) => {
        state.error = action.payload as ErrorType;
        state.loading = false;
      });
  },
});

export default chartSlice.reducer;
