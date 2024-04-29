import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Popup,
  CancelButton,
  FormProvider,
  SubmitButton,
  RHFUploadFile,
} from '@channel360/ui-core';

import { Stack, Alert, Button } from '@mui/material';

import { Template } from 'src/models';
import { templateService } from 'src/services';
import { useOrganizationContext } from 'src/context/organization.context';

interface AddFileProps {
  refresh: () => void;
  template: Template;
}

export const UploadImageForm: React.FC<AddFileProps> = ({ template, refresh }) => {
  const orgId = useOrganizationContext();
  const [open, setOpen] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const methods = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const fileLocation = await templateService.handleUpload(orgId, data.file[0]);
      const tag = {
        ...template.tags,
        head: [
          {
            type: 'image',
            url: fileLocation,
          },
        ],
      };

      await templateService.updateTemplate(orgId, template.id, { tags: tag });

      reset();
      refresh();
      setOpen(false);
    } catch (error) {
      console.error('Error updating template:', error);
      setErrorMsg(typeof error === 'string' ? error : error.error);
    }
  });
  return (
    <>
      <Popup
        width="400px"
        open={open}
        setOpen={setOpen}
        title="Upload Image"
        header="Upload the image you want to use in your message header! JPEG is the only supported format."
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <RHFUploadFile fileType="image/jpeg" name="file" />
            <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
              <CancelButton onClick={() => setOpen(false)} />
              <SubmitButton loading={isSubmitting} />
            </Stack>
          </Stack>
        </FormProvider>
      </Popup>
      <Button
        size="medium"
        variant="contained"
        color="warning"
        onClick={() => {
          setOpen(true);
          reset();
        }}
      >
        Upload Image
      </Button>
    </>
  );
};
