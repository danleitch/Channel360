import React, { useState } from 'react';
import { CustomDataGrid } from '@channel360/ui-core';
import { useDispatch, useSelector } from 'react-redux';

import { Card, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridColDef, GridRowParams, GridActionsCellItem } from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import { RootState, AppDispatch } from 'src/redux/store';
import { useOrganizationContext } from 'src/context/organization.context';
import { fetchApiKeys, revokeApiKey } from 'src/redux/thunks/settings/fetch-developer-settings';

import Label from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';

export default function IntegrationsTable() {
  const { apiKeys, loading, revokeLoading } = useSelector(
    (state: RootState) => state.developerSettings
  );
  const dispatch = useDispatch<AppDispatch>();
  const orgId = useOrganizationContext();
  const confirm = useBoolean();
  const [keyId, setKeyId] = useState('');

  const handleDeleteClick = (apiKeyId: string) => {
    setKeyId(apiKeyId);
    confirm.onTrue();
  };

  const handleConfirmDelete = async () => {
    if (keyId) {
      await dispatch(revokeApiKey({ orgId, keyId })).unwrap();
      confirm.onFalse();
      dispatch(fetchApiKeys(orgId));
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      headerClassName: 'larger-text',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'apiKey',
      headerName: 'Api Key',
      headerClassName: 'larger-text',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'revoked',
      headerName: 'Revoked',
      headerClassName: 'larger-text',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Label variant="soft" color={params.row.revoked ? 'error' : 'success'}>
          {params.row.revoked.toString()}
        </Label>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      headerClassName: 'larger-text',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => fDateTime(params.value, 'dd/MM/yyyy HH:mm'),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated',
      headerClassName: 'larger-text',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => fDateTime(params.value, 'dd/MM/yyyy HH:mm'),
    },
    {
      field: 'actions',
      type: 'actions',
      flex: 1,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<DeleteIcon style={{ fontSize: 25 }} color="error" />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row.id)}
        />,
      ],
    },
  ];

  return (
    <>
      <Card>
        <Typography variant="h4" sx={{ m: 3 }}>
          API Keys
        </Typography>
        <CustomDataGrid
          enableRowHover={false}
          loading={loading}
          toolbar={() => <div />}
          rows={apiKeys}
          columns={columns}
        />
      </Card>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={<>Are you sure want to delete this key?</>}
        action={
          <LoadingButton
            loading={revokeLoading}
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}
