'use client';

import NextLink from 'next/link';

import { Box, Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function LandingView() {
  return (
    <Stack spacing={3}>
      <Box
        component="img"
        src="/logo/logo_channel360Desktop_blue.svg"
        sx={{ height: 75, cursor: 'pointer', minWidth: 160 }}
      />

      <Button
        href={paths.auth.jwt.signup}
        component={NextLink}
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        data-cy="landing-sign-up-button"
      >
        Get Started
      </Button>

      <Button
        href={paths.auth.jwt.signin}
        component={NextLink}
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="outlined"
        data-cy="landing-sign-in-button"
      >
        Sign In
      </Button>
    </Stack>
  );
}
