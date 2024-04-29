import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Popup,
  CancelButton,
  FormProvider,
  SubmitButton,
  RHFUploadFile,
} from '@channel360/ui-core';

import { Box, Stack, Alert, Button, Typography } from '@mui/material';

import validationSchemas from 'src/utils/validations';

import { Template } from 'src/models';
import { templateService } from 'src/services';
import { useOrganizationContext } from 'src/context/organization.context';

interface AddFileProps {
  refresh: () => void;
  template: Template;
}

export const UploadVideoForm: React.FC<AddFileProps> = ({ template, refresh }) => {
  const orgId = useOrganizationContext();
  const [open, setOpen] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const methods = useForm({ resolver: yupResolver(validationSchemas.videoFile), mode: 'onBlur' });
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
            type: 'video',
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
        title="Upload Video"
        header="Upload the video you want to use in your message header!"
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <RHFUploadFile name="file" fileType="video/mp4" />
              <Typography color="textSecondary" variant="caption" display="block" gutterBottom>
                (MP4 is the only supported format)
              </Typography>
            </Box>
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
        Upload Video
      </Button>
    </>
  );
};
