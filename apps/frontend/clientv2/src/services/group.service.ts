import { AxiosResponse } from 'axios';
import { publicRuntimeConfig } from 'next.config';

import axios, { endpoints } from 'src/utils/axios';

import { Groups } from 'src/models/group';
import { orgIdType, orgIdType as organizationId } from 'src/context/organization.context';

const BASE_URL: string = publicRuntimeConfig.apiUrl;

const getAll = async (
  orgId: orgIdType,
  page?: number,
  limit?: number,
  search = '',
  withMemberCount?: boolean
): Promise<AxiosResponse<Groups>> =>
  axios.get(
    `${BASE_URL}/org/${orgId}${endpoints.group}?page=${page}&limit=${limit}&search=${search}&withMemberCount=${withMemberCount}`
  );

const newGroup = async (orgId: organizationId, data: any): Promise<AxiosResponse> =>
  axios.post(`${BASE_URL}/org/${orgId}${endpoints.group}`, data);

const update = (orgId: organizationId, groupId: string, data: any): Promise<AxiosResponse> =>
  axios.put(`${BASE_URL}/org/${orgId}${endpoints.group}/${groupId}`, data);

const deleteGroup = (orgId: organizationId, groupId: string): Promise<AxiosResponse> =>
  axios.delete(`${BASE_URL}/org/${orgId}/groups/${groupId}`);

const getGroupSubscribers = (
  orgId: organizationId,
  page: number,
  limit: number,
  search: string,
  groupId: string
): Promise<AxiosResponse> =>
  axios.get(
    `${BASE_URL}/org/${orgId}${endpoints.group}/${groupId}/subscribers?page=${page}&limit=${limit}&search=${search}`
  );

const getGroup = (orgId: organizationId, groupId: string): Promise<AxiosResponse> =>
  axios.get(`${BASE_URL}/org/${orgId}${endpoints.group}/${groupId}`);

const assignSubscriberToGroup = (
  orgId: organizationId,
  groupId: string,
  subscriberIds: string[]
): Promise<AxiosResponse> =>
  axios.post(`${BASE_URL}/org/${orgId}${endpoints.group}/assign`, {
    subscriberIds,
    groupId,
  });

const unAssignSubscriberFromGroup = (
  orgId: organizationId,
  groupId: string,
  subscriberIds: string[] | string
): Promise<AxiosResponse> =>
  axios.post(`${BASE_URL}/org/${orgId}${endpoints.group}/unassign`, {
    subscriberIds,
    groupId,
  });

export const groupService = {
  getAll,
  newGroup,
  update,
  deleteGroup,
  getGroupSubscribers,
  getGroup,
  assignSubscriberToGroup,
  unAssignSubscriberFromGroup,
};
