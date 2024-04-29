'use client';

import { Title, CustomDataGrid } from '@channel360/ui-core';
import React, { useState, useEffect, useCallback } from 'react';

import { Box, Card, Grid, Stack, Divider, CardHeader, Typography } from '@mui/material';
import {
  GridColDef,
  GridRowParams,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';

import { adminService } from 'src/services';
import ViewLayout from 'src/layouts/common/view-layout';

import { LoadingScreen } from 'src/components/loading-screen';
import { AssignUserForm, RemoveUserForm } from 'src/components/forms';

import SmoochAppDetails from './smooch-app-detials';

// ----------------------------------------------------------------------

export default function OrganizationDetailsView({ orgId }: any) {
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [org, setOrg] = useState<any>();
  const [orgUsers, setOrgUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const getOrganization = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await adminService.getOrganizationById(orgId);
      setOrg(response.data);
      setOrgUsers(response.data.users);
    } catch (error) {
      console.error('Failed to refresh', error);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  const getAllUsers = useCallback(async () => {
    try {
      const response: any = await adminService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to refresh', error);
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([getOrganization(), getAllUsers()]);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setInitialLoad(false);
      }
    };

    initializeData();
  }, [getOrganization, getAllUsers]);

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'fullName',
        headerName: 'Full Name',
        headerClassName: 'larger-text',
        flex: 2,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.firstName || ''} ${params.row.lastName || ''}`.trim(),
      },
      {
        field: 'email',
        headerName: 'Email',
        headerClassName: 'larger-text',
        flex: 3,
      },
      {
        field: 'username',
        headerName: 'Username',
        headerClassName: 'larger-text',
        flex: 2,
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        headerClassName: 'larger-text',
        flex: 6,
        headerAlign: 'center',
        align: 'center',
        valueGetter: (params: GridRenderCellParams<any>) => new Date(params.value),
      },
      {
        field: 'id',
        headerName: 'ID',
        headerClassName: 'larger-text',
        flex: 3,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'actions',
        type: 'actions',
        flex: 1,
        getActions: (params: GridRowParams) => [
          <RemoveUserForm orgId={orgId} refresh={getOrganization} params={params} />,
        ],
      },
    ],
    [getOrganization, orgId]
  );

  return (
    <>
      {initialLoad ? (
        <LoadingScreen />
      ) : (
        <ViewLayout>
          <Stack spacing={3}>
            <Title> {org?.name}</Title>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: 450 }} variant="outlined">
                  <Typography variant="h4" sx={{ m: 3 }}>
                    Organization Details
                  </Typography>
                  <Divider />
                  {org ? (
                    <Stack direction="row">
                      <div>
                        <CardHeader title="Users" subheader={org?.users?.length} />
                        <CardHeader
                          title="Created"
                          subheader={`${new Date(org.createdAt).toLocaleDateString()} ${new Date(
                            org.createdAt
                          ).toLocaleTimeString()}`}
                        />
                        <CardHeader
                          title="Updated"
                          subheader={`${new Date(org.updatedAt).toLocaleDateString()} ${new Date(
                            org.updatedAt
                          ).toLocaleTimeString()}`}
                        />
                      </div>
                      <div>
                        <CardHeader title="ID" subheader={org?.id} />
                        <CardHeader title="Plan" subheader={org?.plan.title} />
                      </div>
                    </Stack>
                  ) : (
                    <Box sx={{ p: 5 }}>No Organization Details</Box>
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <SmoochAppDetails orgId={orgId} />
              </Grid>
            </Grid>

            <Card>
              <Stack sx={{ m: 3 }} spacing={1} direction="row" justifyContent="flex-end">
                {' '}
                <AssignUserForm orgId={orgId} refresh={getOrganization} users={users} />
              </Stack>

              <CustomDataGrid loading={loading} rows={orgUsers} columns={columns} />
            </Card>
          </Stack>
        </ViewLayout>
      )}
    </>
  );
}
