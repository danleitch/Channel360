import { AxiosResponse } from 'axios';
import { publicRuntimeConfig } from 'next.config';

import axios from 'src/utils/axios';

const BASE_URL: string = publicRuntimeConfig.apiUrl;

const getAll = (): Promise<AxiosResponse<any>> => axios.get(`${BASE_URL}/admin/organization/all`);

const getOrganizationById = (orgId: string): Promise<AxiosResponse<any>> =>
  axios.get(`${BASE_URL}/admin/organization/${orgId}`);

const create = async (data: any) =>
  axios.post(`${BASE_URL}/admin/organization`, {
    ...data,
  });

const getAllPlans = (): Promise<AxiosResponse<any>> => axios.get(`${BASE_URL}/plans`);

const getAllUsers = (): Promise<AxiosResponse<any>> => axios.get(`${BASE_URL}/admin/users`);

const assignUserToOrganization = (orgId: string, userId: string): Promise<AxiosResponse<any>> =>
  axios.post(`${BASE_URL}/admin/organization/${orgId}/users/${userId}`);

const removeUserFromOrganization = (orgId: string, userId: string): Promise<AxiosResponse<any>> =>
  axios.delete(`${BASE_URL}/admin/organization/${orgId}/users/${userId}`);

const assignSmoochIdToOrganization = (orgId: string, appId: string): Promise<AxiosResponse<any>> =>
  axios.post(`${BASE_URL}/org/${orgId}/whatsapp/smooch/${appId}`);

const removeSmoochIdFromOrganization = (
  orgId: string,
  appId: string
): Promise<AxiosResponse<any>> => axios.delete(`${BASE_URL}/org/${orgId}/whatsapp/smooch/${appId}`);

const getSmoochByOrgId = (orgId: string): Promise<AxiosResponse<any>> =>
  axios.get(`${BASE_URL}/org/${orgId}/whatsapp/smooch`);

export const adminService = {
  getAll,
  create,
  getOrganizationById,
  getAllUsers,
  assignUserToOrganization,
  getAllPlans,
  removeUserFromOrganization,
  assignSmoochIdToOrganization,
  getSmoochByOrgId,
  removeSmoochIdFromOrganization,
};
