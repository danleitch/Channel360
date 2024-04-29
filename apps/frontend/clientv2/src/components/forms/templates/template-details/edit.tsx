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
import { Alert, FormLabel } from '@mui/material';

import validationSchemas from 'src/utils/validations';

import { templateService } from 'src/services';
import { Template, SelectedTag } from 'src/models';
import { useOrganizationContext } from 'src/context/organization.context';

import { SubscriberFields } from './create';

type CreateTagFormProps = {
  refresh: () => void;
  template: Template;
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedTag: SelectedTag;
};

type UpdatedTag = {
  index: number;
  type: string;
  value?: string;
  fields?: string;
};

export const EditTagForm: FC<CreateTagFormProps> = ({
  template,
  refresh,
  selectedTag,
  open,
  setOpen,
}) => {
  const orgId = useOrganizationContext();
  const [errorMsg, setErrorMsg] = useState('');

  const [tag, setTag] = useState<any>(selectedTag.type);
  const methods = useForm<any>({
    resolver: yupResolver(validationSchemas.editTag),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = methods;

  useEffect(() => {
    reset();
    setTag(selectedTag.type);
  }, [selectedTag, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const tags = { ...template.tags };

      const updatedTag: UpdatedTag = {
        index: selectedTag.index,
        type: Case.kebab(data.tag_type),
      };

      if (data.tag_type === 'hard-coded' || data.tag_type === 'on-campaign-creation') {
        updatedTag.value = data.tag_field;
      } else {
        updatedTag.fields = data.tag_field || Case.camel(data.subscriber_field);
      }

      const tagArray = tags[selectedTag.contentType.toLowerCase() as keyof typeof tags];
      const tagIndex = tagArray.findIndex((newTag) => newTag.index === selectedTag.index);
      if (tagIndex > -1) {
        tagArray[tagIndex] = updatedTag;
      } else {
        throw new Error('Tag not found');
      }

      await templateService.updateTemplate(orgId, template.id, { tags });

      refresh();
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Error updating template:', error);
      setErrorMsg(typeof error === 'string' ? error : error.error);
    }
  });

  return (
    <Popup
      width="400px"
      open={open}
      setOpen={setOpen}
      title="Edit Tag"
      header="Change the Tag Type and/or its value."
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          <FormLabel>Tag Type</FormLabel>
          <RHFRadioButton
            defaultValue={selectedTag.type}
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
  );
};
