import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CancelButton, DeleteButton, FormProvider } from '@channel360/ui-core';

import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';

import { Group } from 'src/models/group';
import { groupService } from 'src/services/group.service';
import { useOrganizationContext } from 'src/context/organization.context';

type DeleteSubscriberProps = {
  setOpen: (open: boolean) => void;
  refresh: () => void;
  group: Group;
  subscriberIds: string[];
};

const DeleteSubscriberForm: FC<DeleteSubscriberProps> = ({
  group,
  subscriberIds,
  setOpen,
  refresh,
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
      await groupService.unAssignSubscriberFromGroup(orgId, group.id, subscriberIds);
      setOpen(false);
      refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error.errors[0]?.message === 'string' ? error.errors[0]?.message : error);
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
