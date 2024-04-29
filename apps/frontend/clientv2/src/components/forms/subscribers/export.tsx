import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Popup,
  CancelButton,
  FormProvider,
  SubmitButton,
  handleExport,
  RHFDateTimePicker,
} from '@channel360/ui-core';

import { Alert, Stack, Button } from '@mui/material';

import { subscriberService } from 'src/services/subscriber.service';
import { useOrganizationContext } from 'src/context/organization.context';

const ExportSubscriberForm: FC = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const orgId = useOrganizationContext();
  const methods = useForm({});
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { startDate, endDate } = data;
      await subscriberService.exportSubscribers(orgId, startDate, endDate).then((res) => {
        // This will download the the exported file
        handleExport(res.data);
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.errors[0]?.message);
    }
  });

  return (
    <>
      <Popup title="Export Data" header="Choose a date range." open={open} setOpen={setOpen}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <RHFDateTimePicker name="startDate" label="Start Date" />
            <RHFDateTimePicker name="endDate" label="End Date" />
            <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
              <CancelButton onClick={() => setOpen(false)} />
              <SubmitButton loading={isSubmitting} />
            </Stack>
          </Stack>
        </FormProvider>
      </Popup>
      <Button
        data-cy="subscribers__button--export"
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        Export
      </Button>
    </>
  );
};

export default ExportSubscriberForm;
