import { memo } from 'react';

import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function SubscriberIllustration({ ...other }: BoxProps) {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_DARKER = theme.palette.primary.darker;
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
          opacity="0.60"
          d="M27.4998 54.6601C42.4999 54.6601 54.6598 42.5001 54.6598 27.5001C54.6598 12.5 42.4999 0.340088 27.4998 0.340088C12.4998 0.340088 0.339844 12.5 0.339844 27.5001C0.339844 42.5001 12.4998 54.6601 27.4998 54.6601Z"
          fill={PRIMARY_LIGHT}
        />
        <path
          d="M27.4996 27.7064C30.4025 27.7064 32.7558 25.4888 32.7558 22.7532C32.7558 20.0177 30.4025 17.8 27.4996 17.8C24.5967 17.8 22.2435 20.0177 22.2435 22.7532C22.2435 25.4888 24.5967 27.7064 27.4996 27.7064ZM23.8839 29.2479C26.2361 28.5136 28.7632 28.5136 31.1154 29.2479C33.4274 29.9696 35.3441 31.5747 36.4311 33.6992L37.0246 34.8592C37.433 35.6575 37.1032 36.6288 36.288 37.0288C36.0585 37.1414 35.8053 37.2001 35.5485 37.2001H19.4507C18.5389 37.2001 17.7998 36.4762 17.7998 35.5834C17.7998 35.332 17.8597 35.084 17.9747 34.8592L18.5682 33.6992C19.6552 31.5747 21.5719 29.9696 23.8839 29.2479Z"
          fill={PRIMARY_DARKER}
        />
      </svg>
    </Box>
  );
}

export default memo(SubscriberIllustration);
