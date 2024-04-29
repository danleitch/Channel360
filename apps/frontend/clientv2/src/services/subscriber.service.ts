import { publicRuntimeConfig } from 'next.config';

import axios, { endpoints } from 'src/utils/axios';

import { orgIdType } from 'src/context/organization.context';

const BASE_URL: string = publicRuntimeConfig.apiUrl;

const getMetrics = (orgId: orgIdType): Promise<any> =>
  axios.get(`${BASE_URL}/org/${orgId}/${endpoints.subscribers}/report`);

const getAll = (orgId: orgIdType, page: number, limit?: number, search = ''): Promise<any> =>
  axios.get(
    `${BASE_URL}/org/${orgId}/${endpoints.subscribers}?page=${
      page + 1
    }&limit=${limit}&search=${search}`
  );

const create = (orgId: orgIdType, data: any): Promise<any> =>
  axios.post(`${BASE_URL}/org/${orgId}${endpoints.subscribers}`, data);

const deleteSubscriber = (orgId: orgIdType, subId: string): Promise<any> =>
  axios.delete(`${BASE_URL}/org/${orgId}/subscribers/${subId}`);

const update = (orgId: orgIdType, subId: string, data: any): Promise<any> =>
  axios.put(`${BASE_URL}/org/${orgId}/subscribers/${subId}`, data);

const importSubscribers = (orgId: orgIdType, data: any, groupId?: string): Promise<any> =>
  axios.post(`${BASE_URL}/org/${orgId}/subscribers/import/${groupId || ''}`, data);

const getSubscriber = (subId: string, orgId: orgIdType): Promise<any> =>
  axios.get(`${BASE_URL}/org/${orgId}/subscribers/${subId}`);

const bulkDeleteSubscribers = (orgId: orgIdType, subscribers: string[]): Promise<any> =>
  axios.delete(`${BASE_URL}/org/${orgId}/subscribers`, { data: { subscriberIds: subscribers } });

const exportSubscribers = (orgId: orgIdType, startDate: Date, endDate: Date): Promise<any> =>
  axios.get(
    `${BASE_URL}/org/${orgId}/subscribers/export?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
  );

const getSubscriberHistory = (orgId: orgIdType, destinationId: string): Promise<any> =>
  axios.get(`${BASE_URL}/org/${orgId}/whatsapp/subscriber/${destinationId}/conversation/history`);

export const subscriberService = {
  getAll,
  deleteSubscriber,
  create,
  update,
  importSubscribers,
  getSubscriberHistory,
  getSubscriber,
  bulkDeleteSubscribers,
  exportSubscribers,
  getMetrics,
};
