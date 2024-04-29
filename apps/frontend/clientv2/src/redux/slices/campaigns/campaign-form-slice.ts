// src/features/calendar/calendarSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Group, Template } from 'src/models';
import { orgIdType } from 'src/context/organization.context';
import { groupService, templateService } from 'src/services';

interface CalendarState {
  templateOptions: Template[];
  groupOptions: Group[];
  loading: boolean;
  error: string | null;
}
const initialState: CalendarState = {
  templateOptions: [],
  groupOptions: [],
  loading: false,
  error: null,
};

export const fetchTemplates = createAsyncThunk(
  'calendar/fetchTemplates',
  async (orgId: orgIdType, { rejectWithValue }) => {
    try {
      const response = await templateService.getConfigured(orgId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchGroups = createAsyncThunk(
  'calendar/fetchGroups',
  async (orgId: orgIdType, { rejectWithValue }) => {
    try {
      const response = await groupService.getAll(orgId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templateOptions = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groupOptions = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export const calendarActions = calendarSlice.actions;
export default calendarSlice.reducer;
