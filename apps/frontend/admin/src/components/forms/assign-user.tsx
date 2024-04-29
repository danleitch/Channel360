import { useForm } from 'react-hook-form';
import React, { FC, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Popup, RHFSelect, FormProvider, CancelButton, SubmitButton } from '@channel360/ui-core';

import { Stack, Button } from '@mui/material';

import validationSchemas from 'src/utils/validations';

import { adminService } from 'src/services';

interface Props {
  refresh: () => void;
  users: any[];
  orgId: string;
}

export const AssignUserForm: FC<Props> = ({ orgId, refresh, users }) => {
  const [open, setOpen] = useState(false);

  const methods = useForm({
    resolver: yupResolver(validationSchemas.user),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      await adminService.assignUserToOrganization(orgId, data.user);
    } catch (error) {
      console.error('Error creating organization', error);
    } finally {
      reset();
      refresh();
      setOpen(false);
    }
  });

  return (
    <>
      <Popup title="Assign User to Organization" open={open} setOpen={setOpen}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            <RHFSelect
              name="user"
              label="Select User"
              options={users}
              labelKey="email"
              valueKey="id"
            />

            <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
              <CancelButton onClick={() => setOpen(false)} />
              <SubmitButton loading={isSubmitting} />
            </Stack>
          </Stack>
        </FormProvider>
      </Popup>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          reset();
          setOpen(true);
        }}
      >
       Assign User
      </Button>
    </>
  );
};
