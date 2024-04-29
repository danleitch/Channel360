import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CancelButton, FormProvider, RHFTextField, SubmitButton } from '@channel360/ui-core';

import { Alert, Stack } from '@mui/material';

import validationSchemas from 'src/utils/validations';

import { SubscriberType } from 'src/models';
import { subscriberService } from 'src/services/subscriber.service';
import { useOrganizationContext } from 'src/context/organization.context';

type EditSubscriberFormProps = {
  setOpen: (open: boolean) => void;
  subscriber: SubscriberType;
  refresh: () => void;
};

const EditSubscriberForm: FC<EditSubscriberFormProps> = ({ subscriber, setOpen, refresh }) => {
  const [errorMsg, setErrorMsg] = useState('');
  const orgId = useOrganizationContext();
  const methods = useForm({
    resolver: yupResolver(validationSchemas.addSubscriber),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await subscriberService.update(orgId, subscriber.id, data);
      reset();
      setOpen(false);
      refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.errors?.message);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        <RHFTextField
          data-cy="popup--textfield__mobileNumber"
          name="mobileNumber"
          label="Mobile Number"
          defaultValue={subscriber?.mobileNumber}
        />
        <RHFTextField
          data-cy="popup--textfield__first"
          name="firstName"
          label="First Name"
          defaultValue={subscriber?.firstName}
        />
        <RHFTextField
          data-cy="popup--textfield__last"
          name="lastName"
          label="Last Name"
          defaultValue={subscriber?.lastName}
        />
        <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
          <CancelButton onClick={() => setOpen(false)} />
          <SubmitButton loading={isSubmitting} />
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default EditSubscriberForm;
