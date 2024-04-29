import { NotificationCreatedPublisher } from "@publishers/notification-publisher";
import { natsWrapper } from "../nats-wrapper";
import { ParameterComponent } from "@channel360/core";

interface PublishParams {
  id: string;
  category: string;
  organizationId: string;
  campaignId: string;
  destinationId: string;
  scheduled: Date;
  message: {
    type: string;
    template: {
      name: string;
      language: {
        policy: string;
        code: string;
      };
      components: any[]; // Adjust the type according to your actual component structure
    };
  };
}

export async function publishNotification(
  recipient: any,
  template: any,
  campaign: any,
  destinationId: string,
  components: ParameterComponent[],
) {
  const params: PublishParams = {
    id: recipient.notificationId!,
    category: template.category,
    organizationId: campaign.organization,
    campaignId: campaign.id,
    destinationId: addPrefix(destinationId),
    scheduled: campaign.scheduled,
    message: {
      type: "template",
      template: {
        name: template.name,
        language: {
          policy: "deterministic",
          code: template.language,
        },
        components,
      },
    },
  };

  await new NotificationCreatedPublisher(natsWrapper.client).publish(params);
}

const addPrefix = (mobileNumber: string) => {
  return mobileNumber.startsWith("+") ? mobileNumber : `+${mobileNumber}`;
};
