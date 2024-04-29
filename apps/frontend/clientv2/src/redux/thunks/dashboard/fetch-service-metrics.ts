import { createAsyncThunk } from '@reduxjs/toolkit';

import { orgIdType } from 'src/context/organization.context';
import { campaignService, templateService, subscriberService } from 'src/services'; // Adjust the import path to your API service

export const fetchCampaignsData = createAsyncThunk(
  'serviceMetrics/fetchCampaigns',
  async (orgId: orgIdType, { rejectWithValue }) => {
    try {
      const response = await campaignService.getMetrics(orgId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubscribersData = createAsyncThunk(
  'serviceMetrics/fetchSubscribers',
  async (orgId: orgIdType, { rejectWithValue }) => {
    try {
      const response = await subscriberService.getMetrics(orgId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTemplatesData = createAsyncThunk(
  'serviceMetrics/fetchTemplates',
  async (orgId: orgIdType, { rejectWithValue }) => {
    try {
      const response = await templateService.getMetrics(orgId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
