import { AxiosResponse } from 'axios';
import { publicRuntimeConfig } from 'next.config';

import axios, { endpoints } from 'src/utils/axios';

import { Template } from 'src/models';
import { orgIdType as organizationId } from 'src/context/organization.context';

interface UploadResponse {
  uploadedFiles: any[];
}

const BASE_URL: string = publicRuntimeConfig.apiUrl;

const getMetrics = (orgId: organizationId): Promise<AxiosResponse<any>> =>
  axios.get(`${BASE_URL}/org/${orgId}${endpoints.templates}/report`);

const getAll = async (
  orgId: organizationId,
  status: string | undefined
): Promise<AxiosResponse<Template[]>> =>
  axios.get(`${BASE_URL}/org/${orgId}${endpoints.templates}/list?enabled=${status}`);

const getTemplate = async (
  orgId: organizationId,
  templateName: string
): Promise<AxiosResponse<Template>> =>
  axios.get(`${BASE_URL}/org/${orgId}${endpoints.templates}/${templateName}`);

const newTemplate = (orgId: organizationId, data: any) =>
  axios.post(`${BASE_URL}/org/${orgId}/whatsapp/templates`, {
    ...data,
  });

const updateTemplate = (orgId: organizationId, templateId: string, data: any) =>
  axios.put(`${BASE_URL}/org/${orgId}/templates/${templateId}`, {
    ...data,
  });

const ingest = async (orgId: organizationId): Promise<AxiosResponse<Template[]>> =>
  axios.post(`${BASE_URL}/org/${orgId}/whatsapp/templates/refresh`);

const getConfigured = async (orgId: organizationId): Promise<AxiosResponse<Template[]>> =>
  axios.get(`${BASE_URL}/org/${orgId}${endpoints.templates}/list?enabled=true&filter=configured`);

async function uploadFile(orgId: organizationId, file: any) {
  const formData = new FormData();

  formData.append('file', file);

  return axios.post<UploadResponse>(
    `${BASE_URL}/org/${orgId}${endpoints.templates}/upload`,
    formData
  );
}

export const handleUpload = async (orgId: organizationId, file: any) => {
  const files = await uploadFile(orgId, file);
  return files.data.uploadedFiles[0].location;
};

export const handleCsvUpload = async (orgId: organizationId, file: any) => {
  const files = await uploadFile(orgId, file);
  return files.data.uploadedFiles[0].key;
};

export const buildComponents = (template: any): any => {
  const components: any[] = [];
  const MAX_PARAMETER_LIMIT = 9;

  if (
    template.header === 'TEXT' ||
    template.header === 'IMAGE' ||
    template.header === 'DOCUMENT' ||
    template.header === 'VIDEO'
  ) {
    const isImage = template.header === 'IMAGE';
    const isDocument = template.header === 'DOCUMENT';
    const isVideo = template.header === 'VIDEO';
    const isImageOrDocumentOrVideo = isImage || isDocument || isVideo;
    components.push({
      type: 'HEADER',
      format: template.header,
      [isImageOrDocumentOrVideo ? 'example' : 'text']: isImageOrDocumentOrVideo
        ? {
            header_url: [template.fileLocation],
          }
        : template.header_text,
    });
  }

  if (template.body) {
    const values = [];
    for (let i = 1; i <= MAX_PARAMETER_LIMIT; i += 1) {
      const property = `parameter{{${i}}}`;
      const value = template[property];
      if (value !== undefined) {
        values.push(value);
      }
    }

    const obj: any = {
      type: 'BODY',
      text: template.body,
    };

    if (values.length > 0) {
      obj.example = {
        body_text: [values],
      };
    }

    components.push(obj);
  }

  if (template.footer) {
    components.push({
      type: 'FOOTER',
      text: template.footer,
    });
  }

  if (template.buttons.length > 0) {
    components.push({
      type: 'BUTTONS',
      buttons: template.buttons,
    });
  }

  return components;
};

export const templateService = {
  getAll,
  getTemplate,
  updateTemplate,
  getConfigured,
  ingest,
  newTemplate,
  buildComponents,
  handleUpload,
  getMetrics,
};
