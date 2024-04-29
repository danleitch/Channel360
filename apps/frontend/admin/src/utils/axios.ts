import { toast } from 'react-toastify';
import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log(error.response);
    const errorMessage = error.response
      ? `Error: ${error.response.status} - ${error.response.data.errors[0].message}`
      : 'Network error or something went wrong';
    toast.error(errorMessage);
    return Promise.reject(error);
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

export const endpoints = {
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
  campaigns: '/campaigns',
  templates: '/templates',
  logs: '/logging',
};
