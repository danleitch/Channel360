import { memo } from 'react';

import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function TemplateIllustration({ ...other }: BoxProps) {
  const theme = useTheme();

   const PRIMARY_LIGHTER = theme.palette.primary.lighter;

   const PRIMARY_LIGHT = theme.palette.primary.light;

   const PRIMARY_DARK = theme.palette.primary.dark;

   const PRIMARY_DARKER = theme.palette.primary.darker;
  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <svg viewBox="0 0 75 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          opacity="0.60"
          d="M0.640137 27.5302C0.640137 24.3159 3.24584 21.7102 6.46014 21.7102H68.5401C71.7544 21.7102 74.3601 24.3159 74.3601 27.5302V50.8102C74.3601 54.0245 71.7544 56.6302 68.5401 56.6302H6.46014C3.24584 56.6302 0.640137 54.0245 0.640137 50.8102V27.5302Z"
          fill={PRIMARY_LIGHT}
        />
        <rect
          x="8.3999"
          y="32.3801"
          width="15.52"
          height="4.85"
          rx="2.425"
          fill={PRIMARY_LIGHTER}
        />
        <rect x="8.3999" y="41.1101" width="31.04" height="4.85" rx="2.425" fill={PRIMARY_DARKER} />
        <path
          opacity="0.60"
          d="M14.2202 4.25012C14.2202 2.10725 15.9574 0.370117 18.1002 0.370117H56.9002C59.0431 0.370117 60.7802 2.10725 60.7802 4.25012V13.9501C60.7802 16.093 59.0431 17.8301 56.9002 17.8301H18.1002C15.9573 17.8301 14.2202 16.093 14.2202 13.9501V4.25012Z"
          fill={PRIMARY_LIGHT}
        />
        <rect x="25.8604" y="6.19019" width="23.28" height="5.82" rx="2.91" fill={PRIMARY_DARK} />
      </svg>
    </Box>
  );
}

export default memo(TemplateIllustration);
