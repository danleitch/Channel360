import NextLink from 'next/link';

import { Box, Link } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

interface BroadcastCardProps {
  cardStyle?: 'desktop' | 'mini' | 'horizontal';
}

const StyledDesktop = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.8, 1),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha('#3A9CC4', 0.12),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

const StyledHorizontal = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.8, 1),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
  border: `2px solid ${theme.palette.grey[400]}`,
}));

export default function BroadcastCard({ cardStyle }: BroadcastCardProps) {
  const logoMini = (
    <Box
      component="div"
      sx={{
        maxWidth: 55,
        display: 'inline-flex',
        mx: 'auto',
        my: 2,
        borderRadius: '12px',
        backgroundColor: alpha('#00b8d9', 0.12),
      }}
    >
      <Box component="img" src="/admin/logo/logo_360BroadcastMini.svg" />
    </Box>
  );

  const logoDesktop = (
    <Box
      component="img"
      src="/admin/logo/logo_360Broadcast.svg"
      sx={{ height: 40, cursor: 'pointer', minWidth: 160 }}
    />
  );

  if (cardStyle === 'desktop') {
    return (
      <Link component={NextLink} href="/" underline="none" color="inherit">
        <StyledDesktop>
          <Box sx={{ ml: 2, minWidth: 0 }}>{logoDesktop}</Box>
        </StyledDesktop>
      </Link>
    );
  }
  if (cardStyle === 'mini') {
    return (
      <Link component={NextLink} href="/" sx={{ display: 'contents' }}>
        {logoMini}
      </Link>
    );
  }
  if (cardStyle === 'horizontal') {
    return (
      <StyledHorizontal>
        <Box sx={{ ml: 2, minWidth: 0 }}>{logoDesktop}</Box>
      </StyledHorizontal>
    );
  }
  return (
    <Link component={NextLink} href="/" underline="none" color="inherit">
      <Box sx={{ ml: 2, minWidth: 0 }}>{logoMini}</Box>
    </Link>
  );
}
