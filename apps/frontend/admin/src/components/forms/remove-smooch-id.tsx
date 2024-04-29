import React, { FC, useState } from 'react';
import {
  Popup,
  CancelButton,
  DeleteButton,
} from '@channel360/ui-core';

import { Stack, Button } from '@mui/material';

import { adminService } from 'src/services';

interface Props {
  refresh: () => void;
  orgId: string;
  smoochApp: any;
}

export const RemoveSmoochIdForm: FC<Props> = ({ orgId, refresh, smoochApp }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    console.log('submitted');
    try {
      setLoading(true);
      await adminService.removeSmoochIdFromOrganization(orgId, smoochApp.appId);
    } catch (error) {
      console.error('Error creating organization', error);
    } finally {
      refresh();
      setOpen(false);
      setLoading(false);
    }
  };
  console.log(smoochApp);

  return (
    <>
      <Popup
        title="Remove Smooch ID"
        header="Are you sure you want to remove the Smooch App from this organization?"
        open={open}
        setOpen={setOpen}
      >
        <Stack spacing={3}>
          <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
            <CancelButton
              onClick={() => {
                setOpen(false);
                onSubmit();
              }}
            />
            <DeleteButton buttontext="Remove" loading={loading} onClick={() => onSubmit()} />
          </Stack>
        </Stack>
      </Popup>

      <Button
        variant="outlined"
        color="error"
        disabled={!smoochApp}
        onClick={() => {
          setOpen(true);
        }}
      >
        Remove Smooch ID
      </Button>
    </>
  );
};
