'use client';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';
import { OrganizationProvider } from 'src/context/organization.context';

export default function Layout({ children, params }: any) {
  return (
    <AuthGuard>
      <OrganizationProvider orgId={params!.id}>
        <DashboardLayout>{children}</DashboardLayout>
      </OrganizationProvider>
    </AuthGuard>
  );
}
