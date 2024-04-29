import { createAsyncThunk } from '@reduxjs/toolkit';

import { organizationService } from 'src/services';
import { orgIdType } from 'src/context/organization.context';

interface UpdateOrgSettingsArg {
  orgId: orgIdType;
  data: any;
}

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (orgId: orgIdType, { rejectWithValue }) => {
    try {
      const response = await organizationService.getSettings(orgId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async ({ orgId, data }: UpdateOrgSettingsArg, { rejectWithValue }) => {
    try {
      const response = await organizationService.updateSettings(orgId, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);
