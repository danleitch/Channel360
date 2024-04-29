import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DefaultValues } from 'react-hook-form/dist/types/form';
import { CancelButton, FormProvider, RHFTextField, SubmitButton } from '@channel360/ui-core';

import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';

import validationSchemas from 'src/utils/validations';

import { Group } from 'src/models/group';
import { groupService } from 'src/services/group.service';
import { useOrganizationContext } from 'src/context/organization.context';

type EditGroupFormProps = {
  setOpen: (open: boolean) => void;
  refresh: () => void;
  group: Group;
};

const EditGroupForm: FC<EditGroupFormProps> = ({ group, setOpen, refresh }) => {
  const orgId = useOrganizationContext();
  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues: DefaultValues<any> = {
    name: group.name,
    description: group.description,
  };

  const methods = useForm({
    resolver: yupResolver(validationSchemas.createGroup),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await groupService.update(orgId, group.id, data);
      reset();
      setOpen(false);
      refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ my: 3 }}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        <RHFTextField data-cy="popup--textfield__name" name="name" label="Group Name" />
        <RHFTextField
          data-cy="popup--textfield__description"
          name="description"
          label="Group Description"
        />
        <Stack spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
          <CancelButton onClick={() => setOpen(false)} />
          <SubmitButton loading={isSubmitting} />
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default EditGroupForm;
