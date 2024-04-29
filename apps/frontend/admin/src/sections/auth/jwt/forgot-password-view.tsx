'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFTextField } from '@channel360/ui-core';

import LoadingButton from '@mui/lab/LoadingButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Box, Stack, Alert, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import validationSchemas from 'src/utils/validations';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const ForgotPasswordView = () => {
  const { forgotPassword } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  const methods = useForm({
    resolver: yupResolver(validationSchemas.email),
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await forgotPassword?.(data.email);
      const redirectUrl = `${paths.auth.resetPassword}?email=${encodeURIComponent(data.email)}`;
      router.push(redirectUrl);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.errors?.[0]?.message);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
        <Box component="img" src="/admin/assets/icons/auth/ic_password.svg" />
        <Typography variant="h4">Forgot Your Password? </Typography>

        <Typography color="textSecondary">
          Please enter the email address associated with your account, and we&apos;ll email you a
          link to reset your password.
        </Typography>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <RHFTextField name="email" label="Email address" data-cy="forgot-password__email-field" />

        <LoadingButton
          fullWidth
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          data-cy="forgot-password__submit-button"
        >
          Reset Password
        </LoadingButton>
        <Button component={NextLink} href={paths.auth.jwt.signin} startIcon={<ChevronLeftIcon />}>
          Return to Sign In
        </Button>
      </Stack>
    </FormProvider>
  );
};
