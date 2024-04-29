import { orgIdType } from '@channel360/ui-core';
import { publicRuntimeConfig } from 'next.config';

import axios from 'src/utils/axios';

const baseUrl = `${publicRuntimeConfig.apiUrl}/org`;

const sendMessage = (
  orgId: orgIdType,
  destination: string,
  templateName: string,
  language: string,
  data: any
) =>
  axios.post(`${baseUrl}/${orgId}/notification`, {
    destination,
    message: {
      type: 'template',
      template: {
        name: templateName,
        language: {
          policy: 'deterministic',
          code: language,
        },
        ...data,
      },
    },
  });
export const notificationService = {
  sendMessage,
};
