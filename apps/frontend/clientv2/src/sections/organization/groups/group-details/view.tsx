'use client';

import * as React from 'react';
import { AnyObject } from 'yup/lib/types';
import { useState, useEffect } from 'react';
import {
  Popup,
  Title,
  DeleteButton,
  ServerSideTable,
  PaginationModel,
  withServerSideTable,
} from '@channel360/ui-core';

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Link, Stack, Typography, Breadcrumbs } from '@mui/material';
import { GridColDef, GridRowParams, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { groupService } from 'src/services';
import { SubscriberType, Group as GroupType } from 'src/models/group';
import { orgIdType, useOrganizationContext } from 'src/context/organization.context';

import DeleteSubscriberForm from 'src/components/forms/groups/group-details/delete-subscriber';

interface GroupDetailsProps {
  groupId: string;
}

const GroupDetails: React.FC<GroupDetailsProps> = (props: any) => {
  const { refresh, modelId } = props;
  const [group, setGroup] = useState<GroupType>();
  const [subscriber, setSubscriber] = useState<SubscriberType>();
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [openBulkRemoveDialog, setOpenBulkRemoveDialog] = useState(false);
  const [subIdArray, setSubIdArray] = useState<string[]>([]);
  const router = useRouter();

  const orgId = useOrganizationContext();

  function getFullName(params: AnyObject) {
    return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
  }

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await groupService.getGroup(orgId, modelId);

        setGroup(response.data);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };
    fetchGroup();
  }, [refresh, modelId, orgId]);

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'mobileNumber',
        headerName: 'Mobile Number',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        valueGetter: (params: AnyObject) => params.row.mobileNumber,
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
        valueGetter: (params: AnyObject) => params.row.optInStatus,
      },
      {
        field: 'actions',
        type: 'actions',
        flex: 1,
        getActions: (params: AnyObject) => [
          <GridActionsCellItem
            onClick={() => {
              setSubscriber(params.row);
              setSubIdArray([params.row.id]);
              setOpenRemoveDialog(true);
            }}
            icon={<DeleteIcon style={{ fontSize: 30 }} color="error" />}
            label="Remove"
          />,
        ],
      },
    ],
    []
  );

  const navigate = async (subId: string) => {
    const ref = paths.dashboard.subscribers(orgId, subId);
    router.push(ref);
  };
  
  return (
    <Box sx={{ m: 8 }}>
      <Stack spacing={3}>
        {group && (
          <>
            <Title>{group.name}</Title>
            <Typography variant="h6">{group.description}</Typography>
            <Breadcrumbs aria-label="breadcrumb" separator="•">
              <Link color="inherit" href="/">
                Dashboard
              </Link>
              <Link color="inherit" href={`/organization/${orgId}/groups`}>
                Groups
              </Link>
              <Title color="text.primary">Details</Title>
            </Breadcrumbs>
          </>
        )}

        <Stack spacing={3} direction="column">
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <DeleteButton
              data-cy="groups-details__bulk-remove-button"
              disabled={subIdArray.length < 2}
              onClick={() => {
                setOpenBulkRemoveDialog(true);
              }}
            />
          </Stack>

          <ServerSideTable
            checkboxSelection
            columns={columns}
            onRowClick={(params: GridRowParams) => navigate(params.row.id)}
            onRowSelectionModelChange={(data: string[]) => {
              setSubIdArray(data);
            }}
            {...props}
          />
        </Stack>
      </Stack>

      {group && (
        <>
          <Popup
            title="Remove Subscribers"
            header={`Are you sure you want to remove the selected numbers from "${group.name}"?`}
            open={openBulkRemoveDialog}
            setOpen={setOpenBulkRemoveDialog}
          >
            <DeleteSubscriberForm
              group={group}
              subscriberIds={subIdArray}
              setOpen={setOpenBulkRemoveDialog}
              refresh={refresh}
            />
          </Popup>
          {subscriber && (
            <Popup
              title="Remove Subscriber"
              header={`Are you sure you want to remove "${
                subscriber.firstName
                  ? `${subscriber.firstName} ${subscriber.lastName}`
                  : subscriber.mobileNumber
              }" from "${group.name}"?`}
              open={openRemoveDialog}
              setOpen={setOpenRemoveDialog}
            >
              <DeleteSubscriberForm
                group={group}
                subscriberIds={subIdArray}
                setOpen={setOpenRemoveDialog}
                refresh={refresh}
              />
            </Popup>
          )}
        </>
      )}
    </Box>
  );
};

const fetchGroupDetailsData = async (
  orgId: orgIdType,
  paginationModel: PaginationModel,
  searchQuery: string,
  groupId: string
) => {
  const response = await groupService.getGroupSubscribers(
    orgId,
    paginationModel.page + 1,
    paginationModel.pageSize,
    searchQuery,
    groupId
  );
  const { subscribers } = response.data;
  const { total } = response.data;

  return { items: subscribers, total };
};
// We wrap the component in a HOC to get the data from the server
const EnhancedGroupDetails = withServerSideTable(GroupDetails, fetchGroupDetailsData);

export default EnhancedGroupDetails;
