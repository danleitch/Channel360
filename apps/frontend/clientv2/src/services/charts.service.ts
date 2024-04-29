import { AxiosResponse } from 'axios';
import { publicRuntimeConfig } from 'next.config';

import axios from 'src/utils/axios';

import { orgIdType } from 'src/context/organization.context';

const BASE_URL: string = publicRuntimeConfig.apiUrl;

const listCharts = (orgId: orgIdType): Promise<AxiosResponse<any>> =>
  axios.get(`${BASE_URL}/org/${orgId}/charts`);

const getChart = async (
  orgId: orgIdType,
  chartId: string,
  startDate: string,
  endDate: string
): Promise<AxiosResponse<any>> =>
  axios.get(`${BASE_URL}/org/${orgId}/charts/${chartId}?startDate=${startDate}&endDate=${endDate}`);

export const chartService = {
  listCharts,
  getChart,
};
