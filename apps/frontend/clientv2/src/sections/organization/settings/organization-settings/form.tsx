import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import LoadingButton from '@mui/lab/LoadingButton';
import { Card, Stack, Typography } from '@mui/material';

import validationSchemas from 'src/utils/validations';

import { RootState, AppDispatch } from 'src/redux/store';
import { useOrganizationContext } from 'src/context/organization.context';
import { updateSettings } from 'src/redux/thunks/settings/fetch-organization-settings';
import { OrgSettingsState } from 'src/redux/slices/settings/organization-settings-slice';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export default function OrganizationSettingsForm() {
  const dispatch = useDispatch<AppDispatch>();
  const orgId = useOrganizationContext();
  const { orgSettings } = useSelector(
    (state: RootState) => state.organizationSettings as OrgSettingsState
  );
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<any>({
    resolver: yupResolver(validationSchemas.optInOptOut),
    defaultValues: {
      optInMessage: orgSettings.optInMessage,
      optOutMessage: orgSettings.optOutMessage,
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      await dispatch(updateSettings({ orgId, data }));
      enqueueSnackbar('Settings Updated!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong.', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <Typography component="h1" variant="h5">
          Opt In/Out Messages
        </Typography>
        <>
          <RHFTextField name="optInMessage" type="text" label="Opt In Message" />
          <RHFTextField name="optOutMessage" type="text" label="Opt Out Message" />
        </>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
