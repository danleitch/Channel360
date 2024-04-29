'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  Popup,
  Title,
  PaginationModel,
  ServerSideTable,
  withServerSideTable,
} from '@channel360/ui-core';

import { Stack, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridRowParams, GridActionsCellItem } from '@mui/x-data-grid';

import { useRouter } from 'src/routes/hooks';

import { groupService } from 'src/services';
import { Group, SubscriberType } from 'src/models';
import ViewLayout from 'src/layouts/common/view-layout';
import { subscriberService } from 'src/services/subscriber.service';
import { orgIdType, useOrganizationContext } from 'src/context/organization.context';

import {
  EditSubscriberForm,
  CreateSubscriberForm,
  ImportSubscriberForm,
  DeleteSubscriberForm,
  ExportSubscriberForm,
  AssignSubscribersForm,
} from 'src/components/forms/subscribers/index';

const SubscriberView = (props: any) => {
  const router = useRouter();
  const { refresh } = props;
  const orgId = useOrganizationContext();
  const [subscriber, setSubscriber] = useState<SubscriberType>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [openEditSubscriber, setOpenEditSubscriber] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [subIdArray, setSubIdArray] = useState<string[]>([]);

  function getFullName(params: { row: { firstName: string; lastName: string } }) {
    return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
  }

  const columns = React.useMemo(
    () => [
      {
        field: 'mobileNumber',
        headerName: 'Mobile Number',
        headerClassName: 'larger-text',
        flex: 1,
      },
      {
        field: 'fullName',
        headerName: 'Full Name',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 2,
        valueGetter: getFullName,
      },
      {
        field: 'optInStatus',
        headerName: 'Opted In',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        type: 'boolean',
        flex: 2,
      },
      {
        field: 'actions',
        type: 'actions',
        flex: 1,
        getActions: (params: { row: SubscriberType }) => [
          <GridActionsCellItem
            onClick={() => {
              setSubscriber(params.row);
              setOpenEditSubscriber(true);
            }}
            icon={
              <EditIcon
                style={{ fontSize: 30 }}
                color="primary"
                data-cy={`subscriber__update${params.row.mobileNumber}`}
              />
            }
            label="Edit"
          />,
          <GridActionsCellItem
            onClick={() => {
              setSubscriber(params.row);
              setOpenDeleteDialog(true);
            }}
            icon={
              <DeleteIcon
                style={{ fontSize: 30 }}
                data-cy={`subscriber__delete${params.row.mobileNumber}`}
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

  const navigate = (rowId: string) => {
    router.push(`${rowId}`);
  };

  const getGroupOptions = useCallback(async () => {
    await groupService.getAll(orgId).then((response) => {
      if (response) {
        setGroups(response.data.data);
      }
    });
  }, [orgId]);

  useEffect(() => {
    if (orgId) {
      getGroupOptions();
    }
  }, [orgId, getGroupOptions]);

  return (
    <ViewLayout>
      <Title>Subscribers</Title>
      <Stack sx={{ m: 3 }} spacing={1} direction="row" justifyContent="flex-end">
        <Button
          disabled={!(subIdArray?.length > 1)}
          variant="contained"
          color="error"
          onClick={() => setOpenBulkDeleteDialog(true)}
        >
          Bulk Delete
        </Button>

        <AssignSubscribersForm subscriberIds={subIdArray} refresh={refresh} groups={groups} />
        <ExportSubscriberForm />
        <ImportSubscriberForm groups={groups} refresh={refresh} />
        <CreateSubscriberForm refresh={refresh} />
      </Stack>

      <ServerSideTable
        checkboxSelection
        onRowClick={(params: GridRowParams) => navigate(params.row.id)}
        onRowSelectionModelChange={(data: string[]) => {
          setSubIdArray(data);
        }}
        columns={columns}
        {...props}
      />

      {subscriber && (
        <>
          <Popup
            title="Edit Subscriber"
            header="Change details about this subscriber"
            open={openEditSubscriber}
            setOpen={setOpenEditSubscriber}
          >
            <EditSubscriberForm
              subscriber={subscriber}
              setOpen={setOpenEditSubscriber}
              refresh={refresh}
            />
          </Popup>
          <Popup
            title="Delete Subscriber"
            header={`Are you sure you want to delete ${subscriber.firstName} ${subscriber.lastName}, ${subscriber.mobileNumber} ?`}
            open={openDeleteDialog}
            setOpen={setOpenDeleteDialog}
          >
            <DeleteSubscriberForm
              subscriber={subscriber}
              setOpen={setOpenDeleteDialog}
              refresh={refresh}
            />
          </Popup>
        </>
      )}
      <Popup
        title="Delete Subscribers"
        header="Are you sure you want to delete all the selected numbers?"
        open={openBulkDeleteDialog}
        setOpen={setOpenBulkDeleteDialog}
      >
        <DeleteSubscriberForm
          bulkSubscribers={subIdArray}
          setOpen={setOpenBulkDeleteDialog}
          refresh={refresh}
          bulkDelete
        />
      </Popup>
    </ViewLayout>
  );
};

const fetchGroupDetailsData = async (
  orgId: orgIdType,
  paginationModel: PaginationModel,
  searchQuery: string
) => {
  const response = await subscriberService.getAll(
    orgId,
    paginationModel.page,
    paginationModel.pageSize,
    searchQuery
  );
  const { subscribers, totalSubscribers } = response.data;

  return { items: subscribers, total: totalSubscribers };
};
// We wrap the component in a HOC to get the data from the server
const EnhancedSubscriberView = withServerSideTable(SubscriberView, fetchGroupDetailsData);

export default EnhancedSubscriberView;
