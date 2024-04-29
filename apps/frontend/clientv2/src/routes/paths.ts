// ----------------------------------------------------------------------

import { orgIdType } from 'src/context/organization.context';

export const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/organization',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    verify: `${ROOTS.AUTH}/verify/`,
    resetPassword: `${ROOTS.AUTH}/reset-password/`,
    jwt: {
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password/`,
      signin: `${ROOTS.AUTH}/jwt/sign-in/`,
      signup: `${ROOTS.AUTH}/jwt/sign-up/`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    templates: (orgId: orgIdType, tempName: string) =>
      `${ROOTS.DASHBOARD}/${orgId}/templates/${tempName}`,
    campaigns: `${ROOTS.DASHBOARD}/campaigns/`,
    calendar: (id: orgIdType) => `${ROOTS.DASHBOARD}/${id}/calendar`,

    subscribers: (orgId: orgIdType, id: string) => `${ROOTS.DASHBOARD}/${orgId}/subscribers/${id}`,
    groups: `${ROOTS.DASHBOARD}/groups/`,
    group: {
      root: `${ROOTS.DASHBOARD}/group/`,
      five: `${ROOTS.DASHBOARD}/group/five/`,
      six: `${ROOTS.DASHBOARD}/group/six/`,
    },
  },
};
