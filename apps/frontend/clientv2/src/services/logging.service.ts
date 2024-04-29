import { AxiosResponse } from 'axios';
import { publicRuntimeConfig } from 'next.config';

import axios, { endpoints } from 'src/utils/axios';

import { orgIdType } from 'src/context/organization.context';

const BASE_URL: string = publicRuntimeConfig.apiUrl;

const getAll = (
  orgId: orgIdType,
  page: number,
  limit: number,
  search = ''
): Promise<AxiosResponse<any>> =>
  axios.get(
    `${BASE_URL}/org/${orgId}${endpoints.logs}?order=desc&page=${
      page + 1
    }&limit=${limit}&search=${search}`
  );

const exportLogs = async (orgId: orgIdType, startDate: Date, endDate: Date): Promise<any> =>
  axios.get(
    `${BASE_URL}/org/${orgId}${endpoints.logs}/export?startDate=${startDate}&endDate=${endDate}`
  );

export const loggingService = {
  getAll,
  exportLogs,
};
