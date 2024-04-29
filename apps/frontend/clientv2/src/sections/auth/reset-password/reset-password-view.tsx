'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFTextField, FormProvider } from '@channel360/ui-core';

import LoadingButton from '@mui/lab/LoadingButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Box, Stack, Alert, Button, Typography, IconButton, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import validationSchemas from 'src/utils/validations';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';

export const ResetPasswordView = (): JSX.Element => {
  const { resetPassword } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  const searchParams = useSearchParams();

  const emailFromUrl = searchParams.get('email');

  const password = useBoolean();

  const confirmPassword = useBoolean();

  const passwordAdornment = (currentValue: boolean, toggleVisibility: () => void) => (
    <InputAdornment position="end">
      <IconButton onClick={toggleVisibility} edge="end">
        <Iconify icon={currentValue ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
      </IconButton>
    </InputAdornment>
  );

  const methods = useForm({
    resolver: yupResolver(validationSchemas.resetPassword),
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await resetPassword?.(emailFromUrl!, data.newPassword, data.code);
      const redirectUrl = `${paths.auth.jwt.signin}`;
      router.push(redirectUrl);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.errors?.[0]?.message);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
        <Box component="img" src="/assets/icons/auth/ic_email_sent.svg" />
        <Typography variant="h3">Reset Your Password!</Typography>
        <Typography color="textSecondary">Check your email and use the code below!</Typography>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        <Box sx={{ width: '100%', textAlign: 'left' }}>
          <RHFTextField
            sx={{ width: '50%' }}
            variant="standard"
            name="code"
            label="Code"
            data-cy="reset-password__code-field"
          />
        </Box>
        <RHFTextField
          fullWidth
          name="newPassword"
          label="New Password"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: passwordAdornment(password.value, password.onToggle),
          }}
          data-cy="reset-password__new-password-field"
        />
        <RHFTextField
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type={confirmPassword.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: passwordAdornment(confirmPassword.value, confirmPassword.onToggle),
          }}
          data-cy="reset-password__confirm-password-field"
        />

        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          loading={isSubmitting}
          data-cy="reset-password__submit-button"
        >
          Update Password
        </LoadingButton>
        <Button component={NextLink} href={paths.auth.jwt.signin} startIcon={<ChevronLeftIcon />}>
          Return to Sign In
        </Button>
      </Stack>
    </FormProvider>
  );
};
