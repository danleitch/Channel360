import { createSlice } from '@reduxjs/toolkit';

import {
  fetchApiKeys,
  revokeApiKey,
  requestApiKey,
} from 'src/redux/thunks/settings/fetch-developer-settings';

export const devSettingsSlice = createSlice({
  name: 'devSettings',
  initialState: {
    apiKeys: [],
    loading: false,
    requestLoading: false,
    revokeLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiKeys.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApiKeys.fulfilled, (state, action) => {
        state.apiKeys = action.payload;
        state.loading = false;
      })
      .addCase(fetchApiKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as any;
      })
      .addCase(requestApiKey.pending, (state) => {
        state.requestLoading = true;
      })
      .addCase(requestApiKey.fulfilled, (state) => {
        state.requestLoading = false;
      })
      .addCase(requestApiKey.rejected, (state, action) => {
        state.requestLoading = false;
        state.error = action.error.message as any;
      })
      .addCase(revokeApiKey.pending, (state) => {
        state.revokeLoading = true;
      })
      .addCase(revokeApiKey.fulfilled, (state) => {
        state.revokeLoading = false;
      })
      .addCase(revokeApiKey.rejected, (state, action) => {
        state.revokeLoading = false;
        state.error = action.error.message as any;
      });
  },
});

export default devSettingsSlice.reducer;
