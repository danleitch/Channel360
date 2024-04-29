import React, { useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

interface Props {
  children: React.ReactNode;
}

export default function GuestGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return loading ? <SplashScreen /> : <Container>{children}</Container>;
}

function Container({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authenticated, logout } = useAuthContext();

  // Rehydrate organizations from localStorage or context on page revisit of '/' if none logout
  const getOrganizations = useCallback(() => {
    const fetchedOrg = localStorage.getItem('organizations');
    try {
      return fetchedOrg ? JSON.parse(fetchedOrg) : [];
    } catch (e) {
      console.error('Failed to parse organizations from localStorage', e);
      return [];
    }
  }, []);

  const organizations = getOrganizations();

  const returnTo =
    searchParams.get('returnTo') || `${paths.dashboard.root}/${organizations[0]?.id}/dashboard`;

  const check = useCallback(() => {
    if (organizations.length === 0) {
      // If no organizations, logout and redirect
      logout();
      return;
    }
    if (authenticated) {
      router.replace(returnTo);
    }
  }, [authenticated, returnTo, router, logout, organizations]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
