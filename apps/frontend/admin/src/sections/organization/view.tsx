'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Title, CustomDataGrid } from '@channel360/ui-core';

import { Card, Stack } from '@mui/material';
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';

import { adminService } from 'src/services';
import ViewLayout from 'src/layouts/common/view-layout';

import { CreateOrganizationForm } from 'src/components/forms/create-org';

// ----------------------------------------------------------------------

export default function OrganizationView() {
  const [loading, setLoading] = useState(false);
  const [orgs, setOrgs] = useState<any>([]);
  const [plans, setPlans] = useState<any>([]);
  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      headerClassName: 'larger-text',
      flex: 2,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      headerClassName: 'larger-text',
      flex: 3,
      valueGetter: (params: GridRenderCellParams<any>) => new Date(params.value),

      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'users',
      headerClassName: 'larger-text',
      headerName: 'Users',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => params.row.users.length,
    },
  ];

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await adminService.getAll();
      setOrgs(response.data);
    } catch (error) {
      console.error('Failed to refresh templates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlans = useCallback(async () => {
    try {
      const response: any = await adminService.getAllPlans();
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to refresh templates:', error);
    }
  }, []);

  const navigate = (rowId: string) => {
    router.push(`${rowId}`);
  };

  useEffect(() => {
    refresh();
    getPlans();
  }, [refresh, getPlans]);
  return (
    <ViewLayout>
      <Title> Organizations </Title>
      <Stack sx={{ m: 3 }} direction="row" justifyContent="flex-end">
        <CreateOrganizationForm plans={plans} refresh={refresh} />
      </Stack>
      <Card>
        <CustomDataGrid
          loading={loading}
          rows={orgs}
          columns={columns}
          onRowClick={(params) => navigate(params.row.id)}
        />
      </Card>
    </ViewLayout>
  );
}
