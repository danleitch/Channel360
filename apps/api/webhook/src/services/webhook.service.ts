import { Webhook } from "@models/webhook";
import { DeliveryData } from "@interfaces/DeliveryData";
import axios from "axios";

export class WebhookService {
  static async post(data: DeliveryData, orgId: string) {
    console.log(`WebhookService.post ${JSON.stringify(data)}`);

    const webhooks = await Webhook.find({ organization: orgId });

    if (webhooks.length === 0 ) {
      return;
    }

    webhooks.forEach((webhook) => {
      if (!webhook.triggers.includes(data.trigger)) {
        return;
      }
      axios.post(webhook.target, data);
    });
  }
}
