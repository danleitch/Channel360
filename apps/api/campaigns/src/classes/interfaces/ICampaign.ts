import { Tag } from "@channel360/core";

export interface ICampaign {
  organization: string;
  reference: string;
  template: string;
  status: string;
  creator?: string;
  scheduled: Date;
  started?: Date;
  completed?: Date;
  subscriberGroup: string;

  color?: string;
  tags?: Tag;
}
