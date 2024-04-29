import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { formatCampaign } from 'src/utils/format-campaign'; // Adjust the path according to your project structure
import { useDispatch, useSelector } from 'react-redux';
import {
  RHFSelect,
  FormProvider,
  RHFTextField,
  RHFUploadFile,
  RHFCapturedAtCreationTimeFields,
} from '@channel360/ui-core';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Skeleton } from '@mui/material';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { DateTimePicker } from '@mui/x-date-pickers';
import DialogActions from '@mui/material/DialogActions';

import validationSchemas from 'src/utils/validations';
import { isAfter, fTimestamp } from 'src/utils/format-time';

import { Template } from 'src/models';
import { createEvent } from 'src/api/calendar';
import { RootState, AppDispatch } from 'src/redux/store';
import { useOrganizationContext } from 'src/context/organization.context';
import { fetchGroups, fetchTemplates } from 'src/redux/slices/campaigns/campaign-form-slice';

import { ColorPicker } from 'src/components/color-utils';
import { MessagePreview } from 'src/components/message-preview';

import { ICalendarDate, ICalendarEvent } from 'src/types/calendar';

// ----------------------------------------------------------------------

type Props = {
  colorOptions: string[];
  onClose: VoidFunction;
  currentEvent?: ICalendarEvent;
};

export default function CalendarForm({ currentEvent, colorOptions, onClose }: Props) {
  const orgId = useOrganizationContext();

  const [template, setTemplate] = useState<Template>();

  const methods = useForm<any>({
    resolver: yupResolver(validationSchemas.createCampaign(template)),
    defaultValues: currentEvent,
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

  const dispatch = useDispatch<AppDispatch>();

  const { templateOptions, groupOptions } = useSelector((state: RootState) => state.calendar);
  useEffect(() => {
    dispatch(fetchTemplates(orgId));
    dispatch(fetchGroups(orgId));
  }, [dispatch, orgId]);

  const onTemplateSelection = (e: any) => {
    const selectedTemplate = templateOptions.find(
      (filterdTemplate) => filterdTemplate.id === e.target.value
    );
    setTemplate(selectedTemplate);
    methods.setValue('file', undefined);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (template) {
      const campaignData = await formatCampaign({
        data,
        template,
        orgId,
      });

      try {
        if (!dateError) {
          await createEvent(campaignData, orgId);
          onClose();
          reset();
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField
          name="reference"
          label="Reference"
          data-cy="campaign-create__text_reference"
        />
        {templateOptions.length < 1 ? (
          <Skeleton variant="rectangular" width="100%" height={56} animation="wave" />
        ) : (
          <RHFSelect
            options={templateOptions}
            name="template"
            label="Template"
            valueKey="id"
            labelKey="name"
            onSelection={onTemplateSelection}
            data-cy="campaign-create__selector_template"
          />
        )}

        {template && <MessagePreview template={template} />}

        {template?.components?.some(
          (component: any) => component.type === 'HEADER' && component.format === 'DOCUMENT'
        ) && <RHFUploadFile name="file" fileType=" application/pdf, .csv" />}

        {/** On Campaign Creation Tags * */}
        {template && <RHFCapturedAtCreationTimeFields template={template} />}

        {groupOptions.length < 1 ? (
          <Skeleton variant="rectangular" width="100%" height={56} animation="wave" />
        ) : (
          <RHFSelect
            options={groupOptions}
            name="subscriberGroup"
            label="Groups"
            valueKey="id"
            labelKey="name"
            data-cy="campaign-create__selector_groups"
          />
        )}

        <Controller
          name="scheduled"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              {...field}
              value={new Date(field.value as ICalendarDate)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(fTimestamp(newValue));
                }
              }}
              label="Schedule"
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
          Create
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
