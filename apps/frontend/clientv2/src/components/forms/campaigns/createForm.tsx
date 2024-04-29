import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  RHFSelect,
  FormProvider,
  RHFTextField,
  CancelButton,
  SubmitButton,
  RHFUploadFile,
  RHFDateTimePicker,
  RHFCapturedAtCreationTimeFields,
} from '@channel360/ui-core';

import { Stack, Skeleton } from '@mui/material';

import validationSchemas from 'src/utils/validations';

import { Template } from 'src/models';
import { Group } from 'src/models/group';
import { useOrganizationContext } from 'src/context/organization.context';
import {
  groupService,
  handleUpload,
  handleCsvUpload,
  templateService,
  campaignService,
} from 'src/services';

import { MessagePreview } from 'src/components/message-preview';

const CreateForm = ({ handleClose, setReload }: any) => {
  const orgId = useOrganizationContext();

  const [template, setTemplate] = useState<Template>();

  const [templateOptions, setTemplateOptions] = useState<any[]>([]);

  const [groupOptions, setGroupOptions] = useState<any[]>([]);

  const methods = useForm({
    resolver: yupResolver(validationSchemas.createCampaign(template)),
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await templateService.getConfigured(orgId);
      const options = response.data.map((option: any) => ({
        id: option.id,
        name: option.name,
        components: option.components,
        tags: option.tags,
      }));
      setTemplateOptions(options);
    };

    const fetchGroups = async () => {
      const response = await groupService.getAll(orgId);
      const options = response.data.data.map((option: Group) => ({
        id: option.id,
        name: option.name,
      }));
      setGroupOptions(options);
    };

    fetchTemplates();
    fetchGroups();
  }, [orgId]);

  const onTemplateSelection = (e: any) => {
    const selectedTemplate = templateOptions.find(
      (filterdTemplate) => filterdTemplate.id === e.target.value
    );
    setTemplate(selectedTemplate);
  };

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data: any) => {
    let fileLocation: any;
    let fileName: any;
    let fileKey: any;
    let onCreationTagIndex = 0;
    let onCsvTagIndex = 0;
    if (!template) return;
    if (data?.file?.[0]) {
      fileLocation = await handleUpload(orgId, data.file[0]);
      fileName = data.file[0].name;
    }
    if (data?.csvFile?.[0]) {
      fileKey = await handleCsvUpload(orgId, data.csvFile[0]);
    }

    const updatedTags = {
      ...template.tags,
      head:
        template.components[0].format === 'DOCUMENT'
          ? [
              {
                document: {
                  filename: fileName,
                  link: fileLocation,
                },
                type: 'document',
              },
            ]
          : template.tags.head.map(
              (
                obj: {
                  type: string;
                },
                index: number
              ) => {
                if (obj.type === 'on-campaign-creation') {
                  return { ...obj, value: data.onCreationTag[index].text };
                }
                if (obj.type === 'csv') {
                  return { ...obj, fields: data.csvTags[index].text };
                }
                return obj;
              }
            ),

      body: template.tags.body.map((obj: { type: string }) => {
        if (obj.type === 'on-campaign-creation') {
          const value = data.onCreationTag[onCreationTagIndex].text;
          onCreationTagIndex += 1;

          return { ...obj, value };
        }

        if (obj.type === 'csv') {
          const fields = data.csvTags[onCsvTagIndex].text;
          onCsvTagIndex += 1;
          return { ...obj, fields, url: fileKey };
        }

        return obj;
      }),
      buttons: template.tags.buttons.map((obj: { type: string }) => {
        if (obj.type === 'on-campaign-creation') {
          const value = data.onCreationTag[onCreationTagIndex].text;
          onCreationTagIndex += 1;

          return { ...obj, value };
        }

        if (obj.type === 'csv') {
          const fields = data.csvTags[onCsvTagIndex].text;
          onCsvTagIndex += 1;
          return { ...obj, fields, url: fileKey };
        }

        return obj;
      }),
    };
  
    await campaignService.create(orgId, {
      ...data,
      schedule: new Date(data.scheduled).getTime() + 7200000,
      tags: updatedTags,
      template: template.id,
    });

    reset();
    handleClose();
    setReload(true);
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {/** Form Inputs * */}
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

        {/** File Upload * */}
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

        <RHFDateTimePicker name="scheduled" label="Schedule" />

        {/** Action Buttons * */}
        <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
          <CancelButton data-cy="campaign-create__button_cancel" onClick={handleClose} />
          <SubmitButton data-cy="campaign-create__button_submit" loading={isSubmitting} />
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default CreateForm;
