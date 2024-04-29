// src/features/apiKeys/apiKeysThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';

import { developerService } from 'src/services';
import { orgIdType } from 'src/context/organization.context';

interface RevokeApiKeyArg {
  orgId: orgIdType;
  keyId: string;
}

export const fetchApiKeys = createAsyncThunk(
  'apiKeys/fetchApiKeys',
  async (orgId: orgIdType, { rejectWithValue }) => {
    try {
      const response = await developerService.getApiKeys(orgId);
      return response.data.reverse();
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const requestApiKey = createAsyncThunk(
  'apiKeys/requestKey',
  async (orgId: orgIdType, { rejectWithValue }) => {
    try {
      const response = await developerService.requestApiKey(orgId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const revokeApiKey = createAsyncThunk(
  'apiKeys/revokeKey',
  async ({ orgId, keyId }: RevokeApiKeyArg, { rejectWithValue }) => {
    try {
      const response = await developerService.revokeApiKey(orgId, keyId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);
