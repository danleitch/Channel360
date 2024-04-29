import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  isDesktop?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, isDesktop, ...other }, ref) => {
    
    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    const logoMini = (
      <Box
        ref={ref}
        component="div"
        sx={{
          maxWidth: 55,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <Box component="img" src="/admin/logo/logo_channel360Mini_green.svg" />
      </Box>
    );

    const logoDesktop = (
      <Box
        component="img"
        src="/admin/logo/logo_channel360Desktop_green.svg"
        sx={{ height: 40, cursor: 'pointer', minWidth: 160 }}
      />
    );

    if (disabledLink) {
      return isDesktop ? logoDesktop : logoMini;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {isDesktop ? logoDesktop : logoMini}
      </Link>
    );
  }
);

export default Logo;
