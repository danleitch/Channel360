import { AxiosResponse } from 'axios';
import { publicRuntimeConfig } from 'next.config';

import axios, { endpoints } from 'src/utils/axios';

import { Campaign, CampaignObject } from 'src/models';
import { orgIdType as organizationId } from 'src/context/organization.context';

const BASE_URL: string = publicRuntimeConfig.apiUrl;

const getMetrics = (orgId: organizationId): Promise<AxiosResponse<any>> =>
  axios.get(`${BASE_URL}/${endpoints.campaigns(orgId)}/report`);

const getAll = async (
  orgId: organizationId,
  page: number,
  limit?: number,
  search = ''
): Promise<AxiosResponse<CampaignObject>> =>
  axios.get(
    `${BASE_URL}/${endpoints.campaigns(orgId)}?page=${page + 1}&limit=${limit}&search=${search}`
  );

const getCampaign = async (
  orgId: organizationId,
  campaignId: string
): Promise<AxiosResponse<Campaign>> =>
  axios.get(`${BASE_URL}/${endpoints.campaigns(orgId)}/${campaignId}`);

const create = async (orgId: organizationId, data: any) =>
  axios.post(`${BASE_URL}/${endpoints.campaigns(orgId)}`, {
    ...data,
    status: 'enabled',
  });

const update = (orgId: organizationId, campaignId: string, data: any) =>
  axios.put(`${BASE_URL}/${endpoints.campaigns(orgId)}/${campaignId}`, {
    ...data,
  });

const deleteCampaign = (orgId: organizationId, campaignId: string) =>
  axios.delete(`${BASE_URL}/${endpoints.campaigns(orgId)}/${campaignId}`);

const getRecipients = async (
  orgId: organizationId,
  page: number,
  limit: number,
  search: string,
  campaignId: string
) =>
  axios.get(
    `${BASE_URL}/${endpoints.campaigns(
      orgId
    )}/${campaignId}/recipients?page=${page}&limit=${limit}&search=${search}`
  );

const exportRecipients = async (orgId: organizationId, campaignId: string) =>
  axios.get(`${BASE_URL}/${endpoints.campaigns(orgId)}/${campaignId}/recipients/export`);

const listCampaignResponses = async (
  orgId: organizationId,
  page: number,
  limit: number,
  search: string,
  campaignId: string
) =>
  axios.get(
    `${BASE_URL}/${endpoints.campaigns(
      orgId
    )}/${campaignId}/recipients/replies?page=${page}&limit=${limit}&search=${search}`
  );

const exportCampaignResponses = async (orgId: organizationId, campaignId: string) =>
  axios.get(`${BASE_URL}/${endpoints.campaigns(orgId)}/${campaignId}/recipients/replies/export`);

export const campaignService = {
  getAll,
  create,
  update,
  deleteCampaign,
  getCampaign,
  getRecipients,
  exportRecipients,
  listCampaignResponses,
  exportCampaignResponses,
  getMetrics,
};
