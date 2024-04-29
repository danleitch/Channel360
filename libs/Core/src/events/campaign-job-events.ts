import { Subjects } from "./subjects";

export interface CampaignJobDeletedEvent {
  subject: Subjects.CampaignDeleted;
  data: {
    id: string;
    reference: string;
    version: number;
  };
}

export interface CampaignJobCreatedEvent {
  subject: Subjects.CampaignCreated;
  data: {
    id: string;
    organization: string;
    reference: string;
    template: string;
    status: string;
    creator: string;
    scheduled: Date;
    started: Date;
    completed: Date;
    recipients: [
      {
        subscriber: string;
        created: Date;
        submitted: Date;
        completed: Date;
        status: string;
      }
    ];
    version: number;
  };
}

export interface CampaignJobUpdatedEvent {
  subject: Subjects.CampaignUpdated;
  data: {
    id: string;
    organization: string;
    reference: string;
    status: string;
    scheduled: Date;
    started: Date;
    completed: Date;
    recipients: [
      {
        subscriber: string;
        created: Date;
        submitted: Date;
        completed: Date;
        status: string;
      }
    ];
    version: number;
  };
}
