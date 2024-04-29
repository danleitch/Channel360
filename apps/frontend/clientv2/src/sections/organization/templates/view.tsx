'use client';

import { useRouter } from 'next/navigation';
import { Title, CustomDataGrid } from '@channel360/ui-core';
import React, { useState, useEffect, useCallback } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { GridColDef, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Card,
  Stack,
  Select,
  Tooltip,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';

import { templateService } from 'src/services';
import { Template } from 'src/models/template';
import ViewLayout from 'src/layouts/common/view-layout';
import { useOrganizationContext } from 'src/context/organization.context';

import { TemplateMenu } from 'src/components/custom/templates';
import { CreateTemplateForm } from 'src/components/forms/templates';

const Templates = () => {
  const orgId = useOrganizationContext();

  const router = useRouter();

  const [templates, setTemplates] = useState<Template[]>([]);

  const [enabled, setEnabled] = React.useState('true');

  const [loading, setLoading] = useState(false);

  const refresh = useCallback(
    async (enabledParameter?: string) => {
      try {
        setLoading(true);
        const response = await templateService.getAll(orgId, enabledParameter);
        setTemplates(response.data.reverse());
      } catch (error) {
        console.error('Failed to refresh templates:', error);
      } finally {
        setLoading(false);
      }
    },
    [orgId]
  );

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        headerClassName: 'larger-text',
        flex: 2,
      },
      {
        field: 'description',
        headerName: 'Description',
        headerClassName: 'larger-text',
        flex: 2,
      },
      {
        field: 'createdAt',
        headerName: 'Date Created',
        headerClassName: 'larger-text',
        type: 'date',
        align: 'center',
        headerAlign: 'center',
        flex: 1,
        valueGetter: (params: GridRenderCellParams<any>) => new Date(params.value),
      },
      {
        field: 'language',
        headerName: 'Language',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
      },
      {
        field: 'category',
        headerName: 'Category',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
      },
      {
        field: 'status',
        headerName: 'Status',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
      },
      {
        field: 'enabled',
        type: 'boolean',
        headerName: 'Enabled',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        filterable: false,
      },
      {
        field: 'actions',
        type: 'actions',
        flex: 1,
        getActions: (params: GridRowParams) => [
          <TemplateMenu row={params.row} refresh={refresh} />,
        ],
      },
    ],
    [refresh]
  );

  const navigate = (rowId: string) => {
    router.push(`${rowId}`);
  };

  const refreshButton = async () => {
    try {
      setLoading(true);
      await templateService.ingest(orgId);
      await refresh(enabled);
    } catch (error) {
      console.error('Error during refresh operation:', error);
    }
  };
  useEffect(() => {
    if (orgId) {
      refresh(enabled);
    }
  }, [orgId, refresh, enabled]);

  const handleChange = async (event: SelectChangeEvent) => {
    setEnabled(event.target.value as string);
  };

  return (
    <ViewLayout>
      <Title>Templates</Title>
      <Stack sx={{ m: 3 }} spacing={1} direction="row" justifyContent="flex-end">
        <CreateTemplateForm refresh={refresh} enabled={enabled} />
        <Tooltip title="Sync the status of your templates with WhatsApp to see whether they have been rejected or approved.">
          <LoadingButton
            onClick={refreshButton}
            loading={loading}
            color="warning"
            endIcon={<RefreshIcon />}
            variant="outlined"
          >
            Manual Sync
          </LoadingButton>
        </Tooltip>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <Select value={enabled} onChange={handleChange}>
            <MenuItem value="true">Enabled</MenuItem>
            <MenuItem value="false">Disabled</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Card>
        <CustomDataGrid
          loading={loading}
          rows={templates}
          columns={columns}
          onRowClick={(params) => navigate(params.row.name)}
        />
      </Card>
    </ViewLayout>
  );
};

export default Templates;
