import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CancelButton, DeleteButton, FormProvider } from '@channel360/ui-core';

import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';

import { SubscriberType } from 'src/models/group';
import { subscriberService } from 'src/services/subscriber.service';
import { useOrganizationContext } from 'src/context/organization.context';

type DeleteSubscriberFormProps = {
  setOpen: (open: boolean) => void;
  refresh: () => void;
  subscriber?: SubscriberType;
  bulkSubscribers?: string[];
  bulkDelete?: boolean;
};

const DeleteSubscriberForm: FC<DeleteSubscriberFormProps> = ({
  bulkDelete,
  subscriber,
  setOpen,
  refresh,
  bulkSubscribers,
}) => {
  const orgId = useOrganizationContext();
  const [errorMsg, setErrorMsg] = useState('');
  const methods = useForm();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async () => {
    try {
      if (bulkDelete && bulkSubscribers) {
        // Handle bulk delete
        await subscriberService.bulkDeleteSubscribers(orgId, bulkSubscribers);
      } else if (subscriber) {
        // Handle single delete
        await subscriberService.deleteSubscriber(orgId, subscriber?.id);
      }
      setOpen(false);
      refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error?.errors?.message);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
          <CancelButton onClick={() => setOpen(false)} />
          <DeleteButton loading={isSubmitting} />
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default DeleteSubscriberForm;
