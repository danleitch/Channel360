import { createSlice } from '@reduxjs/toolkit';

import {
  fetchSettings,
  updateSettings,
} from 'src/redux/thunks/settings/fetch-organization-settings';

interface OrgSettingsData {
  optInMessage: string;
  optOutMessage: string;
}

export interface OrgSettingsState {
  orgSettings: Partial<OrgSettingsData>;
  loading: boolean;
  error: string | null;
}

const initialState: OrgSettingsState = {
  orgSettings: {},
  loading: false,
  error: null,
};

const orgSettingsSlice = createSlice({
  name: 'orgSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.orgSettings = action.payload;
        state.loading = false;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.orgSettings = action.payload;
      });
  },
});

export default orgSettingsSlice.reducer;
