import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { RootState, AppDispatch } from 'src/redux/store';
import { useOrganizationContext } from 'src/context/organization.context';
import { fetchApiKeys, requestApiKey } from 'src/redux/thunks/settings/fetch-developer-settings';

import Iconify from 'src/components/iconify';

import IntegrationsTable from '../table';

export default function IntegrationSettingsView() {
  const { apiKeys, requestLoading } = useSelector((state: RootState) => state.developerSettings);

  const dispatch = useDispatch<AppDispatch>();
  const orgId = useOrganizationContext();

  useEffect(() => {
    if (apiKeys.length === 0) {
      dispatch(fetchApiKeys(orgId));
    }
  }, [dispatch, orgId, apiKeys.length]);

  const handleRequestApiKey = () => {
    dispatch(requestApiKey(orgId))
      .unwrap()
      .then(() => {
        dispatch(fetchApiKeys(orgId));
      })
      .catch((error) => console.error('Failed to request API key:', error));
  };

  return (
    <Stack spacing={3}>
      <LoadingButton
        variant="contained"
        startIcon={<Iconify icon="mingcute:add-line" />}
        loading={requestLoading}
        sx={{
          ml: 'auto',
        }}
        onClick={handleRequestApiKey}
      >
        Request Key
      </LoadingButton>

      <IntegrationsTable />
    </Stack>
  );
}
