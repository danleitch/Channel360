import { useForm } from 'react-hook-form';
import React, { FC, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Popup, FormProvider, CancelButton, SubmitButton, RHFTextField } from '@channel360/ui-core';

import { Stack, Button } from '@mui/material';

import validationSchemas from 'src/utils/validations';

import { adminService } from 'src/services';

interface Props {
  refresh: () => void;
  orgId: string;
  smoochApp: any;
}

export const AssignSmoochIdForm: FC<Props> = ({ orgId, refresh, smoochApp }) => {
  const [open, setOpen] = useState(false);

  const methods = useForm({
    resolver: yupResolver(validationSchemas.appId),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await adminService.assignSmoochIdToOrganization(orgId, data.appId);
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
      <Popup title="Assign Smooch ID" open={open} setOpen={setOpen}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            <RHFTextField name="appId" label="App Id" />

            <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
              <CancelButton onClick={() => setOpen(false)} />
              <SubmitButton loading={isSubmitting} />
            </Stack>
          </Stack>
        </FormProvider>
      </Popup>
      <Button
        variant="outlined"
        color="warning"
        disabled={!!smoochApp}
        onClick={() => {
          reset();
          setOpen(true);
        }}
      >
        Assign Smooch ID
      </Button>
    </>
  );
};
