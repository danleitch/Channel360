import { toast } from 'react-toastify';
import { orgIdType } from '@channel360/ui-core';
import axios, { AxiosRequestConfig } from 'axios';
import { publicRuntimeConfig } from 'next.config';

import { HOST_API } from 'src/config-global';
import { tokenExpired } from 'src/auth/context/jwt/utils';

const BASE_URL: string = publicRuntimeConfig.apiUrl;

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status >= 201 && response.status <= 210) {
      const message = response.data.message || 'Success';
      toast.success(message);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return await axiosInstance(originalRequest);
      } catch (refreshError) {
        toast.error('Session expired, please login again');
        tokenExpired();
        return Promise.reject(refreshError);
      }
    } else {
      const errorMessage = error.response
        ? `Error: ${error.response.status} - ${
            error.response.data.errors[0]?.message || 'Something went wrong'
          }`
        : 'Network error';
      toast.error(errorMessage);
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------
export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);

    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.clear();

    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/user/refresh-token`, {
      refreshToken: localStorage.getItem('refreshToken'),
      cognitoId: localStorage.getItem('cognitoId'),
    });

    const { AccessToken } = response.data;
    setSession(AccessToken);
    return AccessToken;
  } catch (error) {
    console.error('Refresh token failed', error);
    throw new Error('Failed to refresh access token');
  }
};
export const endpoints = {
  calendar: '/api/calendar',
  auth: {
    login: '/user/signin',
    register: '/user/signup',
    forgotPassword: '/user/forgot-password',
    resetPassword: '/user/reset-password',
    verify: '/user/verify-account',
    resendOtp: '/user/resend-otp',
  },
  subscribers: '/subscribers',
  group: '/groups',
  campaigns: (orgId: orgIdType) => `org/${orgId}/campaigns`,
  templates: '/templates',
  logs: '/logging',
};
