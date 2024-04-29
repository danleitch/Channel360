import { Subjects } from "./subjects";
export interface SubscriberDeletedEvent {
  subject: Subjects.SubscriberDeleted;
  data: {
    id: string;
    name: string;
    version: number;
  };
}

export interface SubscriberCreatedEvent {
  subject: Subjects.SubscriberCreated;
  data: {
    id: string;
    organization: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    optInStatus: boolean;
    version: number;
  };
}

export interface SubscriberUpdatedEvent {
  subject: Subjects.SubscriberUpdated;
  data: {
    id: string;
    organization: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    optInStatus: boolean;
    version: number;
  };
}
export interface SubscriberOptEvent {
  subject: Subjects.SubscriberOpt;
  data: {
    id: string;
    optInStatus: boolean;
    organization:string;
  };
}


export interface SubscriberImportEvent {
  subject: Subjects.SubscriberImported;
  data: {
    organizationId: string;
    groupId?: string;
    updatedCsv: string;
  }
}
