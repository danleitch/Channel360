import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import uuidv4 from 'src/utils/uuidv4';
import { isAfter, fTimestamp } from 'src/utils/format-time';

import { updateEvent, deleteEvent } from 'src/api/calendar';
import { useOrganizationContext } from 'src/context/organization.context';

import Iconify from 'src/components/iconify';
import { ColorPicker } from 'src/components/color-utils';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { ICalendarDate, ICalendarEvent } from 'src/types/calendar';

// ----------------------------------------------------------------------

type Props = {
  colorOptions: string[];
  onClose: VoidFunction;
  currentEvent?: ICalendarEvent;
};

export default function CalendarForm({ currentEvent, colorOptions, onClose }: Props) {
  const orgId = useOrganizationContext();

  const EventSchema = Yup.object().shape({
    color: Yup.string(),
  });
  const methods = useForm<any>({
    resolver: yupResolver(EventSchema),
    defaultValues: {
      ...currentEvent,
      template: currentEvent?.template?.name || 'Refresh Page',
      subscriberGroup: currentEvent?.subscriberGroup?.name || 'Refresh Page',
    },
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dateError = isAfter(values.start, values.end);

  const onSubmit = handleSubmit(async (data) => {
    const eventData: ICalendarEvent = {
      id: currentEvent?.id ? currentEvent?.id : uuidv4(),
      color: data?.color,
    } as any;

    try {
      if (!dateError) {
        await updateEvent(eventData, orgId);
        onClose();
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  });

  const onDelete = useCallback(async () => {
    try {
      await deleteEvent(orgId, `${currentEvent?.id}`);
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [currentEvent?.id, onClose, orgId]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField disabled name="reference" label="Reference" />

        <RHFTextField disabled name="template" label="Template" />

        <RHFTextField disabled name="subscriberGroup" label="Subscriber Group" />

        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              disabled
              {...field}
              value={new Date(field.value as ICalendarDate)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(fTimestamp(newValue));
                }
              }}
              label="Start date"
              format="dd/MM/yyyy hh:mm a"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          )}
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorPicker
              selected={field.value as string}
              onSelectColor={(color) => field.onChange(color as string)}
              colors={colorOptions}
            />
          )}
        />
      </Stack>

      <DialogActions>
        <Tooltip title="Delete Campaign">
          <IconButton onClick={onDelete}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={dateError}
        >
          Save Changes
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
