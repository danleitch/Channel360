/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// ----------------------------------------------------------------------

import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';

import { LocalizationProvider } from 'src/locales';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';
import { ReduxProvider } from 'src/redux/provider';
import type { Viewport } from 'next';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import WebchatScript from '../components/webchat';

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  themeColor: '#000000',
};

export const metadata = {
  title: 'Channel360',
  manifest: '/manifest.json',
  icons: [
    {
      rel: 'icon',
      url: '/favicon/c360favicon-chrome-512x512.png',
    },
    // { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon/favicon-16x16.png' },
    // { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon/favicon-32x32.png' },
    // { rel: 'apple-touch-icon', sizes: '180x180', url: '/favicon/apple-touch-icon.png' },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <ReduxProvider>
          <AuthProvider>
            <LocalizationProvider>
              <SettingsProvider
                defaultSettings={{
                  themeMode: 'light', // 'light' | 'dark'
                  themeDirection: 'ltr', //  'rtl' | 'ltr'
                  themeContrast: 'default', // 'default' | 'bold'
                  themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                  themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                  themeStretch: false,
                }}
              >
                <ThemeProvider>
                  <MotionLazy>
                    <SnackbarProvider>
                      <SettingsDrawer />
                      <ProgressBar />
                      {children}
                    </SnackbarProvider>
                  </MotionLazy>
                </ThemeProvider>
                <WebchatScript />
              </SettingsProvider>
            </LocalizationProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
