import { useForm } from 'react-hook-form';
import React, { FC, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Popup,
  RHFSelect,
  RHFTextField,
  FormProvider,
  CancelButton,
  SubmitButton,
} from '@channel360/ui-core';

import { Stack, Button } from '@mui/material';

import validationSchemas from 'src/utils/validations';

import { adminService } from 'src/services';

interface Props {
  refresh: () => void;
  plans: any[];
}

export const CreateOrganizationForm: FC<Props> = ({ refresh, plans }) => {
  const [open, setOpen] = useState(false);

  const methods = useForm({
    resolver: yupResolver(validationSchemas.createOrganization),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await adminService.create(data);
      refresh();
    } catch (error) {
      console.error('Error creating organization', error);
    } finally {
      reset();
      setOpen(false);
    }
  });

  return (
    <>
      <Popup title="Create Organization" open={open} setOpen={setOpen}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3} sx={{ my: 3 }}>
            <RHFTextField name="name" label="Organization Name" />
            <RHFSelect options={plans} name="planId" label="Plan" valueKey="id" labelKey="title" />

            <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
              <CancelButton onClick={() => setOpen(false)} />
              <SubmitButton loading={isSubmitting} />
            </Stack>
          </Stack>
        </FormProvider>
      </Popup>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create Organization
      </Button>
    </>
  );
};
