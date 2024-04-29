import { Dayjs } from 'dayjs';
import { publicRuntimeConfig } from 'next.config';

import axios, { endpoints } from 'src/utils/axios';

import { orgIdType } from 'src/context/organization.context';


const BASE_URL: string = publicRuntimeConfig.apiUrl;

const getMessages = async (orgId: orgIdType, status: any, campaignId: any) =>
  axios.post(`${BASE_URL}/${endpoints.campaigns(orgId)}/reports/notifications`, {
    status,
    campaignId,
  });

const getAllReports = async (orgId: orgIdType, startDate: Dayjs, endDate: Dayjs) =>
  axios.post(`${BASE_URL}/org/${orgId}/reports`, {
    startDate,
    endDate,
  });

const getSubscriberReports = async (orgId: orgIdType, startDate: Dayjs, endDate: Dayjs) =>
  axios.post(`${BASE_URL}/org/${orgId}/subscribers/reports`, {
    startDate,
    endDate,
  });

const getTemplateReports = async (orgId: orgIdType, startDate: Dayjs, endDate: Dayjs) =>
  axios.post(`${BASE_URL}/org/${orgId}/templates/reports`, {
    startDate,
    endDate,
  });

export const metricService = {
  getMessages,
  getAllReports,
  getSubscriberReports,
  getTemplateReports,
};
