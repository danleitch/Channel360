import { Subjects } from "./subjects";
import { Tag } from "../utilities/TemplateTagValidator"
export interface CampaignSendEvent {
  subject: Subjects.CampaignSend;
  data: {
    id: string;
    reference: string;
    version: number;
  };
}

export interface CampaignDeletedEvent {
  subject: Subjects.CampaignDeleted;
  data: {
    id: string;
    reference: string;
    version: number;
  };
}

export interface CampaignCreatedEvent {
  subject: Subjects.CampaignCreated;
  data: {
    id: string;
    organization: string;
    reference: string;
    template: string;
    status: string;
    creator?: string;
    scheduled: Date;
    subscriberGroup: string;
    tags?: Tag;
    recipients?: {
      subscriber: string;
      created: Date;
      submitted: Date | null;
      completed: Date | null;
      status: string;
    }[];
    version: number;
  };
}

export interface CampaignUpdatedEvent {
  subject: Subjects.CampaignUpdated;
  data: {
    id: string;
    organization: string;
    reference: string;
    status: string;
    scheduled: Date;
    started?: Date;
    completed?: Date;
    template: string;
    subscriberGroup: string;
    tags?: Tag;
    recipients?: {
      subscriber: string;
      created: Date;
      submitted: Date | null;
      completed: Date | null;
      status: string;
    }[];
    version: number;
  };
}
