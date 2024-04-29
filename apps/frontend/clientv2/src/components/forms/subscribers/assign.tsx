import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Popup, RHFSelect, CancelButton, FormProvider, SubmitButton } from '@channel360/ui-core';

import { Alert, Stack, Button } from '@mui/material';

import { Group } from 'src/models';
import { groupService } from 'src/services';
import { useOrganizationContext } from 'src/context/organization.context';

type AssignSubscribersFromProps = {
  groups: Group[];
  refresh: () => void;
  subscriberIds: string[];
};

const AssignSubscribersFrom: FC<AssignSubscribersFromProps> = ({
  subscriberIds,
  groups,
  refresh,
}) => {
  const methods = useForm({});
  const orgId = useOrganizationContext();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await groupService.assignSubscriberToGroup(orgId, data.groupId, subscriberIds);
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
      <Popup title="Assign Subscriber" header="Are you sure?" open={open} setOpen={setOpen}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <RHFSelect
              label="Groups"
              name="groupId"
              options={groups}
              labelKey="name"
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
        disabled={!(subscriberIds.length > 0)}
        color="success"
        variant="contained"
        onClick={() => {
          setOpen(true);
          reset();
        }}
        data-cy="subscribers__button--assign"
      >
        Assign
      </Button>
    </>
  );
};

export default AssignSubscribersFrom;
