import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  header?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title, header }: Props) {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        my: 'auto',
        maxWidth: 600,
        px: { xs: 5, sm: 10, md: 12 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        {' '}
        <Typography variant="h3">{title || ''}</Typography>
        <Typography variant="h4">{header || ''}</Typography>
        <Box
          component="img"
          alt="auth"
          src={image || '/assets/illustrations/360background.png'}
          sx={{
            maxWidth: {
              xs: 450,
              lg: 550,
              xl: 650,
            },
          }}
        />
      </Box>
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      {mdUp && renderSection}
      {renderContent}
    </Stack>
  );
}
