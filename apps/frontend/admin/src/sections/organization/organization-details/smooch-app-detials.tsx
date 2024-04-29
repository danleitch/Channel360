import React, { useState, useEffect, useCallback } from 'react';

import { Box, Card, Stack, Divider, Typography, CardHeader, CircularProgress } from '@mui/material';

import { adminService } from 'src/services';

import { AssignSmoochIdForm } from 'src/components/forms';
import { RemoveSmoochIdForm } from 'src/components/forms/remove-smooch-id';

const SmoochAppDetails = ({ orgId }: any) => {
  const [smoochApp, setSmoochApp] = useState<any>();
  const [loading, setLoading] = useState(false);

  const getSmoochApp = useCallback(async () => {
    try {
      setLoading(true);
      setSmoochApp(null);
      const response = await adminService.getSmoochByOrgId(orgId);
      setSmoochApp(response.data);
    } catch (error) {
      console.error('Failed to refresh', error);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    getSmoochApp();
  }, [getSmoochApp]);

  return (
    <Card sx={{ p: 2, height: 450 }} variant="outlined">
      <Stack justifyContent="space-between" direction="row">
        <Typography variant="h4" sx={{ m: 3 }}>
          Smooch App Details
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Stack spacing={1} direction="row">
            <AssignSmoochIdForm orgId={orgId} refresh={getSmoochApp} smoochApp={smoochApp} />
            <RemoveSmoochIdForm orgId={orgId} refresh={getSmoochApp} smoochApp={smoochApp} />
          </Stack>
        </Box>
      </Stack>
      <Divider />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {smoochApp ? (
            <Stack direction="row">
              <div>
                <CardHeader title="Name" subheader={smoochApp.name} />

                <CardHeader
                  title="Created"
                  subheader={`${new Date(smoochApp?.createdAt).toLocaleDateString()} ${new Date(
                    smoochApp?.createdAt
                  ).toLocaleTimeString()}`}
                />
                <CardHeader
                  title="Updated"
                  subheader={`${new Date(smoochApp?.updatedAt).toLocaleDateString()} ${new Date(
                    smoochApp?.updatedAt
                  ).toLocaleTimeString()}`}
                />
              </div>
              <div>
                <CardHeader title="App ID" subheader={smoochApp.appId} />
                <CardHeader title="App Token" subheader={smoochApp?.appToken} />
                <CardHeader title="Integration ID" subheader={smoochApp?.integrationId} />
                <CardHeader title="ID" subheader={smoochApp?.id} />
              </div>
            </Stack>
          ) : (
            <Box sx={{ p: 5 }}>No Smooch App Assigned</Box>
          )}
        </>
      )}
    </Card>
  );
};

export default SmoochAppDetails;
