import React, { FC, useState } from 'react';
import { Popup, CancelButton, DeleteButton } from '@channel360/ui-core';

import { Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import { adminService } from 'src/services';

interface Props {
  refresh: () => void;
  params: any;
  orgId: any;
}

export const RemoveUserForm: FC<Props> = ({ orgId, refresh, params }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await adminService.removeUserFromOrganization(orgId, user);
    } catch (error) {
      console.error('Error creating organization', error);
    } finally {
      refresh();
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Popup
        title="Remove User"
        header="Are you sure you want to remove this user form the organization?"
        open={open}
        setOpen={setOpen}
      >
        <Stack spacing={3}>
          <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
            <CancelButton onClick={() => setOpen(false)} />
            <DeleteButton loading={loading} onClick={onSubmit} buttontext="Remove" />
          </Stack>
        </Stack>
      </Popup>
      <GridActionsCellItem
        onClick={() => {
          setUser(params.id);
          setOpen(true);
        }}
        icon={<DeleteIcon style={{ fontSize: 30 }} color="error" />}
        label="Delete"
      />
    </>
  );
};
