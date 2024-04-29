// submitHelper.js

import { Campaign } from 'src/models';
import { Template } from 'src/models/template';
import { orgIdType } from 'src/context/organization.context';
import { handleUpload, handleCsvUpload } from 'src/services';

interface SubmitParams {
  data: any;
  template: Template;
  orgId: orgIdType;
}

export const formatCampaign = async ({
  data,
  template,
  orgId,
}: SubmitParams): Promise<Campaign> => {
  let fileLocation;
  let fileName;
  let fileKey: string;
  let onCreationTagIndex = 0;
  let onCsvTagIndex = 0;

  if (data?.file?.[0]) {
    fileLocation = await handleUpload(orgId, data.file[0]);
    fileName = data.file[0].name;
  }
  if (data?.csvFile?.[0]) {
    fileKey = await handleCsvUpload(orgId, data.csvFile[0]);
  }

  const updatedTags = {
    ...template.tags,
    head:
      template.components[0].format === 'DOCUMENT'
        ? [
            {
              document: {
                filename: fileName,
                link: fileLocation,
              },
              type: 'document',
            },
          ]
        : template.tags.head.map(
            (
              obj: {
                type: string;
              },
              index: number
            ) => {
              if (obj.type === 'on-campaign-creation') {
                return { ...obj, value: data.onCreationTag[index].text };
              }
              if (obj.type === 'csv') {
                return { ...obj, fields: data.csvTags[index].text };
              }
              return obj;
            }
          ),

    body: template.tags.body.map((obj: { type: string }) => {
      if (obj.type === 'on-campaign-creation') {
        const value = data.onCreationTag[onCreationTagIndex].text;
        onCreationTagIndex += 1;

        return { ...obj, value };
      }

      if (obj.type === 'csv') {
        const fields = data.csvTags[onCsvTagIndex].text;
        onCsvTagIndex += 1;
        return { ...obj, fields, url: fileKey };
      }

      return obj;
    }),

    buttons: template.tags.buttons.map((obj: { type: string }) => {
      if (obj.type === 'on-campaign-creation') {
        const value = data.onCreationTag[onCreationTagIndex].text;
        onCreationTagIndex += 1;

        return { ...obj, value };
      }

      if (obj.type === 'csv') {
        const fields = data.csvTags[onCsvTagIndex].text;
        onCsvTagIndex += 1;
        return { ...obj, fields, url: fileKey };
      }

      return obj;
    }),
  };

  const formattedCampaignData: any = {
    color: data?.color,
    reference: data?.reference,
    scheduled: new Date(data.scheduled).toISOString(),
    tags: updatedTags,
    template: data?.template,
    subscriberGroup: data.subscriberGroup,
  };

  return formattedCampaignData;
};
