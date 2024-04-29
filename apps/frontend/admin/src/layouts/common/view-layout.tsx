import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ViewLayout({ children }: Props) {
  const settings = useSettingsContext();
  return (
    <Container sx={{ mt: 8 }} maxWidth={settings.themeStretch ? false : 'xl'}>
      {children}
    </Container>
  );
}
