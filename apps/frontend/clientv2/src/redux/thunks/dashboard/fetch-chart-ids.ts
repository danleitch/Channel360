import { createAsyncThunk } from '@reduxjs/toolkit';

import { chartService } from 'src/services';
import { orgIdType } from 'src/context/organization.context';

export const fetchChartIds = createAsyncThunk(
  'charts/fetchChartIds',
  async (orgId: orgIdType, { rejectWithValue }) => {
    try {
      const response = await chartService.listCharts(orgId);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
