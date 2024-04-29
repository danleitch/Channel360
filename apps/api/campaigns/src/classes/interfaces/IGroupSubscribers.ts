import { SubscriberDoc } from "@models/subscriber";

export interface IGroupSubscriber {
  _id: string;
  organization: string;
  group: string;
  subscriber: SubscriberDoc;
}
