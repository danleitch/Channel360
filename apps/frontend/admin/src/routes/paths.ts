// ----------------------------------------------------------------------

export const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
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
    one: `${ROOTS.DASHBOARD}/one/`,
    two: `${ROOTS.DASHBOARD}/two/`,
    three: `${ROOTS.DASHBOARD}/three/`,
    groups: `${ROOTS.DASHBOARD}/groups/`,
    group: {
      root: `${ROOTS.DASHBOARD}/group/`,
      five: `${ROOTS.DASHBOARD}/group/five/`,
      six: `${ROOTS.DASHBOARD}/group/six/`,
    },
  },
};
