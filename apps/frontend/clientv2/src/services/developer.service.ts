import { AxiosResponse } from 'axios';
import { publicRuntimeConfig } from 'next.config';

import axios from 'src/utils/axios';

import { orgIdType } from 'src/context/organization.context';

const BASE_URL: string = publicRuntimeConfig.apiUrl;

const getApiKeys = (orgId: orgIdType): Promise<AxiosResponse<any>> =>
  axios.get(`${BASE_URL}/org/${orgId}/token`);

const requestApiKey = (orgId: orgIdType): Promise<AxiosResponse<any>> =>
  axios.post(`${BASE_URL}/org/${orgId}/token`);

const revokeApiKey = (orgId: orgIdType, keyId: string): Promise<AxiosResponse<any>> =>
  axios.delete(`${BASE_URL}/org/${orgId}/token/${keyId}`);

export const developerService = {
  getApiKeys,
  requestApiKey,
  revokeApiKey,
};
