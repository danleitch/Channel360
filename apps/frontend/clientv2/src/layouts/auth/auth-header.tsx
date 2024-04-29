import NextLink from 'next/link';

import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Link, Stack, AppBar, Button, Toolbar, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive'; //

import { bgBlur } from 'src/theme/css';

import { useSettingsContext } from 'src/components/settings';

import { NAV, HEADER } from '../config-layout';

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  const pathname = usePathname();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');
  const mdUp = useResponsive('up', 'md');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  let buttonText: string | undefined;
  let buttonLink: string | undefined;

  if (pathname === '/') {
    buttonText = 'Need Help?';
    buttonLink = 'https://docs.channel360.co.za/';
  } else if (pathname === paths.auth.jwt.signin) {
    buttonText = 'SIGN UP';
    buttonLink = paths.auth.jwt.signup;
  } else if (pathname === paths.auth.jwt.signup) {
    buttonText = 'SIGN IN';
    buttonLink = paths.auth.jwt.signin;
  } else if (pathname === paths.auth.jwt.forgotPassword || pathname === paths.auth.resetPassword) {
    buttonText = 'SIGN UP';
    buttonLink = paths.auth.jwt.signup;
  } else if (pathname === paths.auth.verify) {
    buttonText = 'SIGN IN';
    buttonLink = paths.auth.jwt.signin;
  } else {
    console.error('Unhandled pathname:', pathname);
  }

  const renderContent = (
    <>
      {pathname === '/'
        ? mdUp && (
            <Box
              component="img"
              src="/logo/logo_channel360Mini_blue.svg"
              sx={{ height: 40, cursor: 'pointer', minWidth: 160, ml: 6 }}
            />
          )
        : mdUp && (
            <Box
              component="img"
              src="/logo/logo_channel360Desktop_blue.svg"
              sx={{ height: 40, cursor: 'pointer', minWidth: 160, ml: 6 }}
            />
          )}

      {pathname === '/' ? (
        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0.5, sm: 2.5 }}
        >
          <Link
            href={buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Typography variant="h6" color="textPrimary">
              {buttonText}
            </Typography>
          </Link>
        </Stack>
      ) : (
        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0.5, sm: 4 }}
          sx={{ mx: 4 }}
        >
          <Typography variant="h6" color="textPrimary">
            ChannelMobile
          </Typography>
          <Typography variant="h6" color="textPrimary">
            Agent Chat
          </Typography>
          <Link
            href="https://docs.channel360.co.za/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Typography variant="h6" color="textPrimary">
              Documentation
            </Typography>
          </Link>

          {buttonText && buttonLink && (
            <Button
              href={buttonLink}
              component={NextLink}
              color="primary"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
            >
              {buttonText}
            </Button>
          )}
        </Stack>
      )}
    </>
  );

  return (
    mdUp && (
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 3,
          zIndex: theme.zIndex.appBar + 1,
          ...bgBlur({
            color: theme.palette.background.default,
          }),
          transition: theme.transitions.create(['height'], {
            duration: theme.transitions.duration.shorter,
          }),
          ...(lgUp && {
            width: `100%`,
            height: HEADER.H_DESKTOP,
            ...(offsetTop && {
              height: HEADER.H_DESKTOP_OFFSET,
            }),
            ...(isNavHorizontal && {
              width: 1,
              bgcolor: 'background.default',
              height: HEADER.H_DESKTOP_OFFSET,
              borderBottom: `dashed 1px ${theme.palette.divider}`,
            }),
            ...(isNavMini && {
              width: `calc(100% - ${NAV.W_MINI + 1}px)`,
            }),
          }),
        }}
      >
        <Toolbar
          sx={{
            height: 1,
            px: { lg: 5 },
          }}
        >
          {renderContent}
        </Toolbar>
      </AppBar>
    )
  );
}
