import { CustomerResponsePublisher } from "@publishers/customer-response-publisher";
import { natsWrapper } from "../nats-wrapper";
import { DeliveryData } from "@interfaces/DeliveryData";
import { Notification } from "@models/notification";

export class QuickReplyProcessor {
  conversation: any;
  messages: any;

  constructor(protected data: DeliveryData, protected orgId: string) {
    this.conversation = data.conversation;
    this.messages = data.messages;
  }

  async message() {
    try {
      const notification = await Notification.findOne({
        organization: this.orgId,
        conversationId: this.conversation._id,
      }).sort({createdAt: -1});

      if (!notification || !notification.campaign) {
        return;
      }
      
      for (const message of this.messages) {
        
        console.log(
          "Customer Response Publisher Event:",
          this.conversation._id,
        );
        
        if (!message.text) continue;
        
        await new CustomerResponsePublisher(natsWrapper.client).publish({
          text: message.text,
          organizationId: this.orgId,
          notificationId: notification.id,
        });
        
      }
    } catch (error) {
      console.error("Error in QuickReplyProcessor.message:", error);
      throw error; // Or handle the error as appropriate
    }
  }

}
