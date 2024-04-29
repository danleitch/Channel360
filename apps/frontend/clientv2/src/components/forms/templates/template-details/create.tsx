import Case from 'case';
import { useForm } from 'react-hook-form';
import { FC, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Popup,
  RHFSelect,
  CancelButton,
  FormProvider,
  RHFTextField,
  SubmitButton,
  RHFRadioButton,
} from '@channel360/ui-core';

import Stack from '@mui/material/Stack';
import { Alert, Button, FormLabel } from '@mui/material';

import validationSchemas from 'src/utils/validations';

import { Template } from 'src/models';
import { templateService } from 'src/services';
import { useOrganizationContext } from 'src/context/organization.context';

type CreateTagFormProps = {
  refresh: () => void;
  template: Template;
  tagList: number[];
};

export const SubscriberFields = [
  { value: 'FIRST_NAME', label: 'First Name' },
  { value: 'LAST_NAME', label: 'Last Name' },
  { value: 'MOBILE_NUMBER', label: 'Mobile Number' },
];

export const CreateTagForm: FC<CreateTagFormProps> = ({ template, refresh, tagList }) => {
  const orgId = useOrganizationContext();
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<string>('on-campaign-creation');

  const methods = useForm<any>({
    resolver: yupResolver(validationSchemas.tag),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
    watch,
  } = methods;

  const watchedContentType = watch('content_type');

  useEffect(() => {
    if (watchedContentType === 'buttons') {
      setValue('index', '');
    }
  }, [watchedContentType, setValue]);
  const onSubmit = handleSubmit(async (data) => {
    try {
      const contentType = Case.lower(data.content_type) as keyof typeof template.tags;

      const newTag = {
        index: parseInt(data.index, 10),
        type: Case.kebab(data.tag_type),
        [data.tag_type === 'hard-coded' || data.tag_type === 'on-campaign-creation'
          ? 'value'
          : 'fields']: data.tag_field || Case.camel(data.subscriber_field || ''),
      };

      const updatedTag = {
        ...template.tags,
        [contentType]: [...template.tags[contentType], newTag],
      };

      await templateService.updateTemplate(orgId, template.id, { tags: updatedTag });

      refresh();
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Error updating template:', error);
      setErrorMsg(typeof error === 'string' ? error : error.error);
    }
  });

  return (
    <>
      <Popup width="400px" open={open} setOpen={setOpen} title="Title">
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <FormLabel>Content Type</FormLabel>
            <RHFRadioButton name="content_type" list={['head', 'body', 'buttons']} />
            <RHFSelect
              name="index"
              label="Index"
              options={tagList}
              disabled={watchedContentType === 'buttons'}
            />

            <FormLabel>Tag Type</FormLabel>
            <RHFRadioButton
              name="tag_type"
              list={['on-campaign-creation', 'subscriber-field', 'hard-coded', 'csv']}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTag(e.target.value);
                setValue('tag_field', '');
                setValue('subscriber_field', '');
              }}
            />
            {tag === 'hard-coded' && <RHFTextField name="tag_field" label="Hard Coded Value" />}

            {tag === 'on-campaign-creation' && (
              <RHFTextField name="tag_field" label="Placeholder Text" />
            )}

            {tag === 'subscriber-field' && (
              <RHFSelect
                label="Subscriber Fields"
                name="subscriber_field"
                labelKey="label"
                valueKey="value"
                options={SubscriberFields}
              />
            )}

            {tag === 'csv' && <RHFTextField name="tag_field" label="Placeholder Text" />}
            <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
              <CancelButton onClick={() => setOpen(false)} />
              <SubmitButton loading={isSubmitting} />
            </Stack>
          </Stack>
        </FormProvider>
      </Popup>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          reset();
          setTag('on-campaign-creation');
          setOpen(true);
        }}
      >
        Create
      </Button>
    </>
  );
};
