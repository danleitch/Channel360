import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Popup,
  RHFSelect,
  FormProvider,
  CancelButton,
  SubmitButton,
  RHFUploadFile,
  RHFCapturedAtCreationTimeFields,
} from '@channel360/ui-core';

import { Stack, Button, Skeleton } from '@mui/material';

import validationSchemas from 'src/utils/validations';

import { Tag, Template, NotificationTag } from 'src/models';
import { useOrganizationContext } from 'src/context/organization.context';
import { handleUpload, templateService, notificationService } from 'src/services';

import { MessagePreview } from 'src/components/message-preview';

export const MessageSubscriberForm = ({ refresh, subscriber }: any) => {
  const orgId = useOrganizationContext();

  const [open, setOpen] = useState(false);

  const [template, setTemplate] = useState<Template>();

  const [templateOptions, setTemplateOptions] = useState<any[]>([]);

  const methods = useForm<any>({
    resolver: yupResolver(validationSchemas.notification(template)),
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await templateService.getConfigured(orgId);
      setTemplateOptions(response.data);
    };
    if (open) {
      fetchTemplates();
    }
  }, [open, orgId]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onTemplateSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTemplate = templateOptions.find(
      (filterdTemplate) => filterdTemplate.id === e.target.value
    );
    methods.setValue('file', undefined);
    setTemplate(selectedTemplate);
  };

  const onSubmit = handleSubmit(async (data: any) => {
    let fileLocation: any;

    if (data?.file?.[0]) {
      fileLocation = await handleUpload(orgId, data.file[0]);
    }

    try {
      const components = [];

      if (fileLocation) {
        components.push({
          type: 'HEADER',
          parameters: [
            {
              type: 'document',
              document: {
                link: fileLocation,
              },
            },
          ],
        });
      }

      if (template!.tags.head.length > 0) {
        const headObject: Tag = template!.tags.head[0];
        if (headObject.type === 'video') {
          components.push({
            type: 'HEADER',
            parameters: [
              {
                type: 'video',
                video: {
                  link: headObject.url,
                },
              },
            ],
          });
        }
        if (headObject.type === 'image') {
          components.push({
            type: 'HEADER',
            parameters: [
              {
                type: 'image',
                image: {
                  link: headObject.url,
                },
              },
            ],
          });
        } else if (headObject.type === 'subscriber-field') {
          const fieldName = headObject.fields as string;
          const textValue = subscriber[fieldName];
          components.push({
            type: 'HEADER',
            parameters: [
              {
                type: 'text',
                text: textValue,
              },
            ],
          });
        } else if (headObject.type === 'on-campaign-creation') {
          components.push({
            type: 'HEADER',
            parameters: [
              {
                type: 'text',
                text: data.onCreationTag[0].text,
              },
            ],
          });
        }
      }
      // Check the body array
      if (template!.tags.body.length > 0) {
        const bodyComponents: NotificationTag[] = [];
        let onCreationTagIndex = 0;
        template!.tags.body.forEach((bodyObject, index) => {
          const fieldName = bodyObject.fields as string;
          const textValue = subscriber[fieldName];
          if (bodyObject.type === 'hard-coded') {
            bodyComponents.push({
              type: 'text',
              text: bodyObject.value as string,
            });
          } else if (bodyObject.type === 'on-campaign-creation') {
            bodyComponents.push({
              type: 'text',
              text: data.onCreationTag[onCreationTagIndex].text,
            });
            onCreationTagIndex += 1;
          } else if (bodyObject.type === 'subscriber-field') {
            bodyComponents.push({
              type: 'text',
              text: textValue,
            });
          }
        });
        components.push({
          type: 'BODY',
          parameters: bodyComponents,
        });
      }

      if (template!.tags.buttons.length > 0) {
        const buttonsComponents: NotificationTag[] = [];
        let onCreationTagIndex = 0;
        template!.tags.buttons.forEach((buttonsObject, index) => {
          const fieldName = buttonsObject.fields as string;
          const textValue = subscriber[fieldName];
          if (buttonsObject.type === 'hard-coded') {
            buttonsComponents.push({
              type: 'text',
              text: buttonsObject.value as string,
            });
          } else if (buttonsObject.type === 'on-campaign-creation') {
            buttonsComponents.push({
              type: 'text',
              text: data.onCreationTag[onCreationTagIndex].text,
            });
            onCreationTagIndex += 1;
          } else if (buttonsObject.type === 'subscriber-field') {
            buttonsComponents.push({
              type: 'text',
              text: textValue,
            });
          }
        });
        components.push({
          type: 'BUTTON',
          parameters: buttonsComponents,
        });
      }

      await notificationService.sendMessage(
        orgId,
        subscriber.mobileNumber,
        template!.name,
        template!.language,
        {
          components,
        }
      );
      refresh();
      reset();

      setOpen(false);
    } catch (error) {
      console.error('Failed to submit form', error);
    }
  });

  return (
    <>
      <Popup
        title="Send Message"
        header="Choose a template to send to this subscriber."
        open={open}
        setOpen={setOpen}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
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
              />
            )}

            {template && <MessagePreview template={template} />}

            {/** File Upload * */}
            {template?.components?.some(
              (component: any) => component.type === 'HEADER' && component.format === 'DOCUMENT'
            ) && <RHFUploadFile name="file" fileType=" application/pdf, .csv" />}

            {/** On Campaign Creation Tags * */}
            {template && <RHFCapturedAtCreationTimeFields template={template} />}

            {/** Action Buttons * */}
            <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
              <CancelButton onClick={() => setOpen(false)} />
              <SubmitButton loading={isSubmitting} />
            </Stack>
          </Stack>
        </FormProvider>
      </Popup>
      <Button
        onClick={() => {
          setTemplate(undefined);
          setOpen(true);
          reset();
        }}
        variant="contained"
        color="primary"
      >
        Send Message
      </Button>
    </>
  );
};
