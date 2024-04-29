import React, { ReactNode } from 'react';

import { Box, Card, Stack } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

interface CardLayoutProps {
  children: ReactNode;
}

const CardLayout: React.FC<CardLayoutProps> = ({ children }) => {
  const mdUp = useResponsive('up', 'md');

  const commonStyles = {
    width: 1,
    mx: 'auto',
    my: 'auto',
    maxWidth: 550,
    px: { xs: 5, sm: 10 },
    py: 3,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        position: 'relative',
        backgroundImage: mdUp ? 'url("/assets/illustrations/cloud.jpg")' : 'none',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {mdUp ? (
        <Card sx={commonStyles}>{children}</Card>
      ) : (
        <Stack sx={commonStyles}>{children}</Stack>
      )}
    </Box>
  );
};

export default CardLayout;
