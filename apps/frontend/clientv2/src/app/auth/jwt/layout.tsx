'use client';

import { GuestGuard } from 'src/auth/guard';
import Header from 'src/layouts/auth/auth-header';
import ClassicAuthLayout from 'src/layouts/auth/classic-auth-layout';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <Header />
      <ClassicAuthLayout>{children}</ClassicAuthLayout>
    </GuestGuard>
  );
}
