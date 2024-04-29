'use client';

import { ReactNode, useContext, createContext } from 'react';

export interface orgIdType {
  organization: string;
}

export const OrganizationContext = createContext<orgIdType>(undefined!);

export function OrganizationProvider({ orgId, children }: { orgId: orgIdType; children: ReactNode }) {
  return <OrganizationContext.Provider value={orgId}>{children}</OrganizationContext.Provider>;
}

export function useOrganizationContext() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within a OrganizationProvider');
  }
  return context;
}
