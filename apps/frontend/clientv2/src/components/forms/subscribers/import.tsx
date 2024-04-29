import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Popup,
  RHFSelect,
  CancelButton,
  FormProvider,
  SubmitButton,
  RHFUploadFile,
} from '@channel360/ui-core';

import { Alert, Stack, Button } from '@mui/material';

import { Group } from 'src/models/group';
import { subscriberService } from 'src/services/subscriber.service';
import { useOrganizationContext } from 'src/context/organization.context';

type ImportSubscriberFormProps = {
  groups: Group[];
  refresh: () => void;
};

const ImportSubscriberForm: FC<ImportSubscriberFormProps> = ({ groups, refresh }) => {
  const orgId = useOrganizationContext();
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const methods = useForm({});

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const { file, group: groupId } = data;
    const formData = new FormData();

    formData.append('file', file[0], 'subscriberList.csv');

    try {
      await subscriberService.importSubscribers(orgId, formData, groupId);
      reset();
      setOpen(false);
      refresh();
    } catch (error) {
      console.error(error.errors[0]?.message);
      setErrorMsg(typeof error === 'string' ? error : error.errors[0]?.message);
    }
  });

  return (
    <>
      <Popup
        title="Import Subscribers"
        header="Upload a CSV file with a list of the subscribers you want to import. Below is an example."
        open={open}
        setOpen={setOpen}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            <a href="/assets/exampleSubscribers.csv" download>
              <strong>Download Example CSV</strong>
            </a>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <RHFUploadFile name="file" fileType=".csv" />
            <RHFSelect name="group" label="Groups" valueKey="id" labelKey="name" options={groups} />
            <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
              <CancelButton onClick={() => setOpen(false)} />
              <SubmitButton loading={isSubmitting} />
            </Stack>
          </Stack>
        </FormProvider>
      </Popup>
      <Button
        data-cy="subscribers__button--import"
        color="warning"
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Import
      </Button>
    </>
  );
};

export default ImportSubscriberForm;
