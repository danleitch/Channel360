'use client';

import NextLink from 'next/link';
import { OtpInput } from '@channel360/ui-core';
import React, { useState, FormEvent } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Box, Link, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_TO_LOGIN } from 'src/config-global';

export const VerifyOtpView: React.FC = () => {
  const [otpValue, setOtpValue] = useState<string>('');
  const [codeResent, setCodeResent] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const { verify, resendOtp } = useAuthContext();

  const router = useRouter();

  const searchParams = useSearchParams();

  const emailFromUrl = searchParams.get('email');

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      setLoading(true);
      await verify?.(otpValue, emailFromUrl!);
      router.push(PATH_TO_LOGIN);
    } catch (error: any) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resendOtpHandler = async () => {
    try {
      await resendOtp?.(emailFromUrl!);
      setCodeResent(true);

      setTimeout(() => {
        setCodeResent(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error:', error);
    }
  };

  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
        <Box component="img" src="/assets/icons/auth/ic_email_inbox.svg" />
        <Typography variant="h3">Please check your email!</Typography>

        <Typography color="textSecondary">
          We&apos;ve emailed a 6-character confirmation code to acb@domain. Enter the code to
          continue and be redirected.
        </Typography>

        <OtpInput
          onChange={(value) => {
            setOtpValue(value);
            setDisabled(value.length !== 6);
          }}
        />
        <LoadingButton
          fullWidth
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
          disabled={disabled}
          data-cy="verify__submit-button"
        >
          Verify
        </LoadingButton>
        <Typography color="textSecondary">
          Didn&apos;t receive a code?{' '}
          <Link onClick={resendOtpHandler}>{codeResent ? 'Check Your Email!' : 'Resend code'}</Link>
        </Typography>
        <Button component={NextLink} href={paths.auth.jwt.signup} startIcon={<ChevronLeftIcon />}>
          Return to Sign Up
        </Button>
      </Stack>
    </form>
  );
};
