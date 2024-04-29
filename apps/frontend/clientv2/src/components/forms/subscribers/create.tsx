import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Popup, CancelButton, FormProvider, RHFTextField, SubmitButton } from '@channel360/ui-core';

import { Alert, Stack, Button } from '@mui/material';

import validationSchemas from 'src/utils/validations';

import { subscriberService } from 'src/services/subscriber.service';
import { useOrganizationContext } from 'src/context/organization.context';

type AddSubscriberFormProps = {
  refresh: () => void;
};

const CreateSubscriberForm: FC<AddSubscriberFormProps> = ({ refresh }) => {
  const [errorMsg, setErrorMsg] = useState('');
  const orgId = useOrganizationContext();
  const [open, setOpen] = useState(false);

  const methods = useForm({
    resolver: yupResolver(validationSchemas.addSubscriber),
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await subscriberService.create(orgId, data);
      reset();
      setOpen(false);
      refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.errors[0]?.message);
    }
  });

  return (
    <>
      <Popup
        title="Create Subscriber"
        header="Fill in the details to create a new subscriber"
        open={open}
        setOpen={setOpen}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <RHFTextField
              data-cy="popup--textfield__mobileNumber"
              name="mobileNumber"
              label="Mobile Number"
            />
            <RHFTextField data-cy="popup--textfield__first" name="firstName" label="First Name" />
            <RHFTextField data-cy="popup--textfield__last" name="lastName" label="Last Name" />
            <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
              <CancelButton onClick={() => setOpen(false)} />
              <SubmitButton loading={isSubmitting} />
            </Stack>
          </Stack>
        </FormProvider>
      </Popup>
      <Button
        data-cy="subscribers__button--edit"
        color="primary"
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Create
      </Button>
    </>
  );
};

export default CreateSubscriberForm;
