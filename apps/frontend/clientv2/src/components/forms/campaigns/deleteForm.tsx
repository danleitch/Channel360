import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { CancelButton, DeleteButton, FormProvider } from '@channel360/ui-core';

import { Stack } from '@mui/material';

import { campaignService } from '../../../services';
import { useOrganizationContext } from '../../../context/organization.context';

interface DeleteFormProp {
  id: string;
  handleClose: () => void
  setReload: (reload: boolean) => void
}

const DeleteForm: FC<DeleteFormProp> = ({ id, handleClose, setReload}: any) => {
  const orgId = useOrganizationContext();

  const methods = useForm();

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async () => {
    await campaignService.deleteCampaign(orgId, id);
    reset();
    handleClose();
    setReload(true);
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
          <CancelButton onClick={handleClose} />
          <DeleteButton loading={isSubmitting} />
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default DeleteForm;
