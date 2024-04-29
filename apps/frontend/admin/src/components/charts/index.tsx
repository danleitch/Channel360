import React from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Stack, Theme, SxProps, Typography } from '@mui/material';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

interface CardMetricProps {
  title: string;
  total: number;
  icon: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'; 
  sx?: SxProps<Theme>;
}

export const CardMetric: React.FC<CardMetricProps> = ({
  title,
  total,
  icon,
  color = 'primary',
  sx,
  ...other
}) => {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        color: 'common.white',
        bgcolor: `${color}.dark`,
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ ml: 3, width: '200px' }}>
        <Typography variant="h4">{fNumber(total)}</Typography>

        <Typography variant="body2" sx={{ opacity: 0.72 }}>
          {title}
        </Typography>
      </Box>

      <Iconify
        icon={icon}
        sx={{
          width: 120,
          height: 150,
          opacity: 0.12,
          position: 'absolute',
          right: theme.spacing(-3),
        }}
      />
    </Stack>
  );
};
