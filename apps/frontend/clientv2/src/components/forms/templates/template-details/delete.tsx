import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Popup, CancelButton, DeleteButton, FormProvider } from '@channel360/ui-core';

import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';

import { templateService } from 'src/services';
import { Tag, Template, SelectedTag } from 'src/models';
import { useOrganizationContext } from 'src/context/organization.context';

type CreateTagFormProps = {
  refresh: () => void;
  template: Template;
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedTag: SelectedTag;
};

export const DeleteTagForm: FC<CreateTagFormProps> = ({
  template,
  refresh,
  open,
  setOpen,
  selectedTag,
}) => {
  const orgId = useOrganizationContext();
  const [errorMsg, setErrorMsg] = useState('');
  const methods = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async () => {
    try {
      const tags: any = {
        ...template.tags,
      };

      const tagArray = tags[selectedTag.contentType.toLowerCase()]; // 'head' or 'body'
      const tagIndex = tagArray.findIndex((tag: Tag) => tag.index === selectedTag.index);
      if (tagIndex > -1) {
        tagArray.splice(tagIndex, 1);
      } else {
        setErrorMsg('Error while updating template');
      }

      await templateService.updateTemplate(orgId, template.id, { tags });
      refresh();
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
      title="Delete Tag"
      header="Are you sure you want to delete this tag?"
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
            <CancelButton onClick={() => setOpen(false)} />
            <DeleteButton loading={isSubmitting} />
          </Stack>
        </Stack>
      </FormProvider>
    </Popup>
  );
};
