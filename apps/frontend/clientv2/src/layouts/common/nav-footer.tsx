import { Box, Stack } from '@mui/material';

export default function NavFooter() {
  return (
    <Stack
      spacing={3}
      sx={{
        px: 5,
        pb: 5,
        mt: 10,
        width: 1,
        display: 'block',
        textAlign: 'center',
      }}
    >
      <Box component="img" src="/assets/illustrations/illustration_docs.svg" />
      <Box
        component="img"
        src="/logo/logo_channelMobile.svg"
        sx={{ height: 50, cursor: 'pointer', minWidth: 160 }}
      />
    </Stack>
  );
}
