'use client';

import { GuestGuard } from 'src/auth/guard';
import Header from 'src/layouts/auth/auth-header';
import CardLayout from 'src/layouts/auth/card-layout';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <Header />
      <CardLayout>{children}</CardLayout>
    </GuestGuard>
  );
}
