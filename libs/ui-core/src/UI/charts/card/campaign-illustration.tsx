import React, { memo } from 'react';

import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function CampaignIllustration({ ...other }: BoxProps) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  return (
    <Box
      component="svg"
      width="80%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <svg viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          opacity="0.24"
          d="M40.1745 48.6685C48.1745 48.6685 54.6598 42.8985 54.6598 35.7809V13.2277C54.6598 6.1101 48.1745 0.340155 40.1745 0.340155H14.8252C6.82515 0.340155 0.339844 6.1101 0.339844 13.2277V35.7809C0.339844 42.8985 6.82515 48.6685 14.8252 48.6685H18.4465L26.3687 54.3071C27.0153 54.7674 27.928 54.7776 28.5865 54.3378L28.631 54.3071L36.5532 48.6685H40.1745Z"
          fill={PRIMARY_MAIN}
        />
        <rect x="10.04" y="16.345" width="23.28" height="4.85" rx="2.425" fill={PRIMARY_DARK} />
        <rect
          opacity="0.24"
          x="10.04"
          y="33.8052"
          width="23.28"
          height="4.85"
          rx="2.425"
          fill={PRIMARY_DARK}
        />
        <rect
          opacity="0.48"
          x="10.04"
          y="25.0752"
          width="34.92"
          height="4.85"
          rx="2.425"
          fill={PRIMARY_DARK}
        />
      </svg>
    </Box>
  );
}

export default memo(CampaignIllustration);
