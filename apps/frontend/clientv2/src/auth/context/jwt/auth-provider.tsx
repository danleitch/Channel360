'use client';

import { publicRuntimeConfig } from 'next.config';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints, setSession } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { jwtDecode, isValidToken } from './utils';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

interface Organization {
  id: string;
  name: string;
}

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';
const BASE_URL = publicRuntimeConfig.apiUrl;

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Authenticated Persistance
  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);
      const userString = localStorage.getItem('user');

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const user = JSON.parse(userString!);

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const data = {
      email,
      password,
    };

    const res = await axios.post(BASE_URL + endpoints.auth.login, data);

    const { userId, IdToken, AccessToken, RefreshToken, cognitoId } = res.data;

    const user = jwtDecode(IdToken);
    localStorage.setItem('refreshToken', RefreshToken);
    localStorage.setItem('cognitoId', cognitoId);
    localStorage.setItem('user', user ? JSON.stringify({ ...user, userId }) : '');
    setSession(AccessToken);

    const orgRes = await axios.get(`${BASE_URL}/users/${userId}/organization`);

    const organizations = orgRes.data.map((org: Organization) => ({
      id: org.id,
      name: org.name,
    }));
    localStorage.setItem('organizations', JSON.stringify(organizations));

    dispatch({
      type: Types.LOGIN,
      payload: {
        user: {
          ...user,
          AccessToken,
        },
      },
    });
  }, []);

  // VERIFY-OTP
  const verify = useCallback(async (otp: string, email: string) => {
    const data = {
      otp,
      email,
    };

    await axios.post(BASE_URL + endpoints.auth.verify, data);
  }, []);

  // RESEND-OTP
  const resendOtp = useCallback(async (email: string) => {
    const data = {
      email,
    };

    await axios.post(BASE_URL + endpoints.auth.resendOtp, data);
  }, []);

  // REGISTER
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      mobileNumber: string
    ) => {
      const data = {
        email,
        password,
        firstName,
        lastName,
        mobileNumber,
      };

      await axios.post(BASE_URL + endpoints.auth.register, data);
    },

    []
  );

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email: string) => {
    const data = { email };
    await axios.post(BASE_URL + endpoints.auth.forgotPassword, data);
  }, []);

  // RESET PASSWORD
  const resetPassword = useCallback(async (email: string, newPassword: string, code: string) => {
    const data = { email, newPassword, code };
    await axios.post(BASE_URL + endpoints.auth.resetPassword, data);
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      verify,
      resendOtp,
    }),
    [login, logout, register, verify, state.user, status, resendOtp, forgotPassword, resetPassword]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
