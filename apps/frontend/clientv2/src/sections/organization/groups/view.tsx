'use client';

import Case from 'case';
import { useMemo, useState } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridColDef, GridRowParams, GridActionsCellItem } from '@mui/x-data-grid';

import { useRouter } from 'src/routes/hooks';

import { groupService } from 'src/services';
import ViewLayout from 'src/layouts/common/view-layout';
import { orgIdType } from 'src/context/organization.context';

import AddGroupForm from 'src/components/forms/groups/add-group-form';
import EditGroupForm from 'src/components/forms/groups/edit-group-form';
import DeleteGroupForm from 'src/components/forms/groups/delete-group-form';

import { Group } from '../../../models/group';

const Groups = (props: any) => {
  const router = useRouter();
  const { refresh } = props;
  const [group, setGroup] = useState<Group>();
  const [open, setOpen] = useState(false);
  const [openEditGroup, setOpenEditGroup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        headerClassName: 'larger-text',
        flex: 1,

        renderHeader: (params) => (
          <span data-cy={`table-header__${Case.kebab(params.field)}`}>
            {params.colDef.headerName}
          </span>
        ),
      },
      {
        field: 'description',
        headerName: 'Description',
        headerClassName: 'larger-text',
        flex: 2,
        renderHeader: (params) => (
          <span data-cy={`table-header__${Case.kebab(params.field)}`}>
            {params.colDef.headerName}
          </span>
        ),
      },
      {
        field: 'memberCount',
        headerName: 'Member Count',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        cellClassName: 'larger-text',
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
              setGroup(params.row);
              setOpenEditGroup(true);
            }}
            icon={
              <EditIcon
                style={{ fontSize: 30 }}
                color="primary"
                data-cy={`groups-table-button-edit-${Case.pascal(params.row.name)}`}
              />
            }
            label="Edit"
          />,
          <GridActionsCellItem
            onClick={() => {
              setGroup(params.row);
              setOpenDeleteDialog(true);
            }}
            icon={
              <DeleteIcon
                style={{ fontSize: 30 }}
                data-cy={`groups-table-button-delete-${Case.pascal(params.row.name)}`}
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

  const navigate = async (groupId: string) => {
    router.push(`${groupId}`);
  };

  return (
    <ViewLayout>
      <Title>Groups</Title>

      <Stack sx={{ m: 3 }} spacing={1} direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(true);
          }}
          data-cy="groups__add-group-button"
        >
          ADD
        </Button>
      </Stack>
      <Card data-cy="groups-table">
        <ServerSideTable
          columns={columns}
          onRowClick={(params) => navigate(params.row.id)}
          {...props}
        />
      </Card>
      <Popup
        title="Create Group"
        header="Fill in the details to create a new group"
        open={open}
        setOpen={setOpen}
      >
        <AddGroupForm setOpen={setOpen} refresh={refresh} />
      </Popup>
      {group ? (
        <>
          <Popup
            title="Edit Group"
            header="Change details about this group"
            open={openEditGroup}
            setOpen={setOpenEditGroup}
          >
            <EditGroupForm refresh={refresh} group={group} setOpen={setOpenEditGroup} />
          </Popup>
          <Popup
            title="Delete Group"
            header={`Are you sure you want to delete "${group?.name}" ?`}
            open={openDeleteDialog}
            setOpen={setOpenDeleteDialog}
          >
            <DeleteGroupForm refresh={refresh} group={group} setOpen={setOpenDeleteDialog} />
          </Popup>
        </>
      ) : null}
    </ViewLayout>
  );
};

const fetchGroupDetailsData = async (
  orgId: orgIdType,
  paginationModel: PaginationModel,
  searchQuery: string
) => {
  const response = await groupService.getAll(
    orgId,
    paginationModel.page + 1,
    paginationModel.pageSize,
    searchQuery,
    true
  );
  const { data, total } = response.data;

  return { items: data, total };
};
// We wrap the component in a HOC to get the data from the server
const EnhancedGroupView = withServerSideTable(Groups, fetchGroupDetailsData);

export default EnhancedGroupView;
