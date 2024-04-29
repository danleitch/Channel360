import { FC } from 'react';

import { Box, Card, Stack, CardHeader, LinearProgress } from '@mui/material';


interface ProgressBarProps {
  total: number;
  percentage: number;
  label: string;
  [key: string]: any;
}

export const ProgressBar: FC<ProgressBarProps> = ({ total, percentage, label, ...other }) => {
  const completionPercentage = (percentage / total) * 100;

  return (
    <Card {...other}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <CardHeader title={label} />
        <CardHeader title={`${Math.round(completionPercentage)}% Complete`} />
      </Stack>
      <Stack spacing={1} sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress
              sx={{ height: '15px' }}
              variant="determinate"
              value={completionPercentage}
              color={completionPercentage === 100 ? 'success' : 'warning'}
            />
          </Box>
        </Box>
      </Stack>
    </Card>
  );
};
