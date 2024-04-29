import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Popup,
  RHFSelect,
  RHFTextField,
  FormProvider,
  CancelButton,
  SubmitButton,
  RHFUploadFile,
  TemplateButtons,
} from '@channel360/ui-core';

import { Box, Stack, Button, Typography } from '@mui/material';

import validationSchemas from 'src/utils/validations';
import { languages, templateCategories } from 'src/utils/constants';

import { handleUpload } from 'src/services';
import { templateService } from 'src/services/template.service';
import { useOrganizationContext } from 'src/context/organization.context';

interface CreateTemplateFormProps {
  refresh: (enabled: string) => void;
  enabled: string;
}

export const CreateTemplateForm: React.FC<CreateTemplateFormProps> = ({ refresh, enabled }) => {
  const [header, setHeader] = useState<string | null>(null);

  const [params, setParams] = useState<string[]>([]);

  const [open, setOpen] = useState(false);

  const headers: string[] = ['None', 'TEXT', 'IMAGE', 'DOCUMENT', 'VIDEO'];

  const orgId = useOrganizationContext();

  const MAX_PARAMETER_LIMIT = 9;
  // note this is for adding dynamic validation based on the body
  for (let i = 0; i <= MAX_PARAMETER_LIMIT; i += 1) {
    Object.entries(validationSchemas.template).forEach(() => {
      validationSchemas.template[`parameter{{${i}}}`] = yup
        .string()
        .when('body', (body, schema) => {
          if (body && body.includes(`{{${i}}}`)) {
            return schema.required('Field is required');
          }
          return schema;
        });
    });
  }

  const templateSchema = yup.object().shape({
    ...validationSchemas.template,
  });

  const methods = useForm({
    resolver: yupResolver(templateSchema),
    mode: 'onBlur',
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const body: string = useWatch({ control, name: 'body' });

  useEffect(() => {
    const paramRegex = /{{([1-9])}}/g;

    if (body) {
      const matches = body.match(paramRegex);
      if (matches) {
        setParams(matches);
      } else {
        params.forEach((param: any) => {
          control.unregister(`parameter${param}`);
        });
        setParams([]);
      }
    }
    // eslint-disable-next-line
  }, [body]);

  type FormData = {
    [key: string]: any;
  };

  const onSubmit = handleSubmit(async (data: FormData) => {
    try {
      if (data.header_image) {
        const file = data.header_image[0];
        data.fileLocation = await handleUpload(orgId, file);
      } else if (data.header_document) {
        const file = data.header_document[0];
        data.fileLocation = await handleUpload(orgId, file);
      } else if (data.header_video) {
        const file = data.header_video[0];
        data.fileLocation = await handleUpload(orgId, file);
      }

      const content = {
        ...data,
        components: templateService.buildComponents(data),
        namespace: 'default',
        enabled: true,
      };

      await templateService.newTemplate(orgId, content);

      setOpen(false);
      refresh(enabled);
      reset();
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  });

  return (
    <>
      <Popup
        open={open}
        setOpen={setOpen}
        title="Create Template"
        header="Complete the form below to apply for a template"
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            <RHFSelect
              options={templateCategories}
              valueKey="value"
              labelKey="label"
              name="category"
              label="Category"
            />
            <RHFTextField name="name" label="Template Name" />
            <RHFTextField name="description" label="Description" />
            <RHFSelect
              name="language"
              label="Language"
              valueKey="value"
              labelKey="label"
              options={languages}
            />
            <RHFSelect
              label="Header"
              name="header"
              options={headers}
              onSelection={(e) => {
                setHeader(e.target.value);
              }}
            />
            {header === 'TEXT' && <RHFTextField label="Header Text" name="header_text" />}
            {header === 'IMAGE' && (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <RHFUploadFile name="header_image" fileType=".jpeg" />
                <Typography color="textSecondary" variant="caption" display="block" gutterBottom>
                  (JPEG is the only supported format)
                </Typography>
              </Box>
            )}
            {header === 'DOCUMENT' && <RHFUploadFile name="header_document" fileType=".pdf" />}
            {header === 'VIDEO' && (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <RHFUploadFile name="header_video" fileType="video/mp4" />
                <Typography color="textSecondary" variant="caption" display="block" gutterBottom>
                  (MP4 is the only supported format)
                </Typography>
              </Box>
            )}
            <RHFTextField label="Body" name="body" multiline rows={6} />
            {params.map((param, index) => (
              <RHFTextField
                key={`parameter${param}`}
                name={`parameter${param}`}
                label={`Parameter ${index + 1}`}
              />
            ))}
            <RHFTextField name="footer" label="Footer" />
            <TemplateButtons />

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
          setOpen(true);
          reset();
        }}
      >
        Create
      </Button>
    </>
  );
};
