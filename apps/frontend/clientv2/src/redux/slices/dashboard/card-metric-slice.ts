// dashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';

import {
  fetchCampaignsData,
  fetchTemplatesData,
  fetchSubscribersData,
} from 'src/redux/thunks/dashboard/fetch-service-metrics';

const serviceMetricsSlice = createSlice({
  name: 'serviceMetrics',
  initialState: {
    campaigns: { status: 'loading', data: { count: 0, title: '' }, error: null },
    subscribers: { status: 'loading', data: { count: 0, title: '' }, error: null },
    templates: { status: 'loading', data: { count: 0, title: '' }, error: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    // Campaigns
    builder
      .addCase(fetchCampaignsData.pending, (state) => {
        state.campaigns.status = 'loading';
      })
      .addCase(fetchCampaignsData.fulfilled, (state, action) => {
        state.campaigns.status = 'success';
        state.campaigns.data = action.payload;
      })
      .addCase(fetchCampaignsData.rejected, (state, action) => {
        state.campaigns.status = 'failed';
        state.campaigns.error = action.payload as any;
      })
      // Repeat for subscribers and templates
      .addCase(fetchSubscribersData.pending, (state) => {
        state.subscribers.status = 'loading';
      })
      .addCase(fetchSubscribersData.fulfilled, (state, action) => {
        state.subscribers.status = 'success';
        state.subscribers.data = action.payload;
      })
      .addCase(fetchSubscribersData.rejected, (state, action) => {
        state.subscribers.status = 'failed';
        state.subscribers.error = action.payload as any;
      })
      .addCase(fetchTemplatesData.pending, (state) => {
        state.templates.status = 'loading';
      })
      .addCase(fetchTemplatesData.fulfilled, (state, action) => {
        state.templates.status = 'success';
        state.templates.data = action.payload;
      })
      .addCase(fetchTemplatesData.rejected, (state, action) => {
        state.templates.status = 'failed';
        state.templates.error = action.payload as any;
      });
  },
});

export default serviceMetricsSlice.reducer;
