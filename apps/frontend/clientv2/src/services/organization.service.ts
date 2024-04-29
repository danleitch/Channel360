import { AxiosResponse } from 'axios';
import { publicRuntimeConfig } from 'next.config';

import axios from 'src/utils/axios';

import { orgIdType } from 'src/context/organization.context';

const BASE_URL: string = publicRuntimeConfig.apiUrl;

const getSettings = (orgId: orgIdType): Promise<AxiosResponse<any>> =>
  axios.get(`${BASE_URL}/org/${orgId}/settings`);

const updateSettings = (orgId: orgIdType, data: any): Promise<AxiosResponse<any>> =>
  axios.put(`${BASE_URL}/org/${orgId}/settings`, data);

export const organizationService = {
  getSettings,
  updateSettings,
};
