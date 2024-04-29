'use client';

import Case from 'case';
import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Popup,
  Title,
  ServerSideTable,
  PaginationModel,
  withServerSideTable,
} from '@channel360/ui-core';

import { Card } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridColDef, GridRowParams, GridActionsCellItem } from '@mui/x-data-grid';

import { fDateTime } from 'src/utils/format-time';

import { Campaign } from 'src/models';
import { campaignService } from 'src/services';
import ViewLayout from 'src/layouts/common/view-layout';
import { orgIdType } from 'src/context/organization.context';

import CreateForm from 'src/components/forms/campaigns/createForm';
import DeleteForm from 'src/components/forms/campaigns/deleteForm';

const CampaignsView = (props: any) => {
  const { refresh } = props;
  const router = useRouter();
  const [activeCampaign, setActiveCampaign] = useState<Campaign>();
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'reference',
        headerName: 'Reference',
        headerClassName: 'larger-text',
        flex: 2,
        renderHeader: (params) => (
          <span data-cy={`table-header__${Case.kebab(params.field)}`}>
            {params.colDef.headerName}
          </span>
        ),
      },
      {
        field: 'templateName',
        headerName: 'Template',
        headerClassName: 'larger-text',
        flex: 2,
        valueGetter: (params) => params.row.template.name,
        renderHeader: (params) => (
          <span data-cy={`table-header__${Case.kebab(params.field)}`}>
            {params.colDef.headerName}
          </span>
        ),
      },
      {
        field: 'groupName',
        headerName: 'Group',
        headerClassName: 'larger-text',
        flex: 1,
        valueGetter: (params) => params.row.subscriberGroup.name,
        renderHeader: (params) => (
          <span data-cy={`table-header__${Case.kebab(params.field)}`}>
            {params.colDef.headerName}
          </span>
        ),
      },
      {
        field: 'scheduled',
        headerName: 'Scheduled',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 2,
        valueGetter: (params) => fDateTime(params.value, 'dd/MM/yyyy HH:mm'),

        renderHeader: (params) => (
          <span data-cy={`table-header__${Case.kebab(params.field)}`}>
            {params.colDef.headerName}
          </span>
        ),
      },
      {
        field: 'actions',
        type: 'actions',
        flex: 1,
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            onClick={() => {
              setActiveCampaign(params.row);
              setOpenDeleteDialog(true);
            }}
            icon={
              <DeleteIcon
                style={{ fontSize: 30 }}
                data-cy={`delete_groups--${params.row.reference}`}
                color="error"
              />
            }
            label="Delete"
          />,
        ],
      },
    ],
    []
  );

  const navigateToCampaignDetails = (rowId: string) => {
    router.push(`${rowId}`);
  };

  return (
    <ViewLayout>
      <Title>Campaigns</Title>

      <Stack sx={{ m: 3 }} spacing={1} direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(true);
          }}
          data-cy="campaigns__button_add"
        >
          ADD
        </Button>
      </Stack>
      <Card>
        <ServerSideTable
          onRowClick={(params: any) => navigateToCampaignDetails(params.id)}
          columns={columns}
          getRowId={(row) => row.id}
          {...props}
        />
      </Card>
      <Popup
        title="Create Campaign"
        header="Fill in the details to create a new campaign"
        open={open}
        setOpen={setOpen}
      >
        <CreateForm handleClose={() => setOpen(false)} setReload={refresh} />
      </Popup>
      <Popup
        title="Delete Group"
        header="Are you sure you want to delete ?"
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
      >
        {activeCampaign && (
          <DeleteForm
            id={activeCampaign.id}
            handleClose={() => setOpenDeleteDialog(false)}
            setReload={refresh}
          />
        )}
      </Popup>
    </ViewLayout>
  );
};

const fetchCampaignData = async (
  orgId: orgIdType,
  paginationModel: PaginationModel,
  searchQuery: string
) => {
  const response = await campaignService.getAll(
    orgId,
    paginationModel.page,
    paginationModel.pageSize,
    searchQuery
  );
  const { data, totalDocuments } = response.data;

  return { items: data, total: totalDocuments };
};

const EnhancedCampaignView = withServerSideTable(CampaignsView, fetchCampaignData);

export default EnhancedCampaignView;
