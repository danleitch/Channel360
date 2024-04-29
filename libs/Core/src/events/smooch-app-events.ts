import { Subjects } from "./subjects";

export interface SmoochAppCreatedEvent {
  subject: Subjects.SmoochAppCreated;
  data: {
    id: string;
    appId: string;
    name: string;
    organization?: string;
    integrationId?: string;
  };
}

export interface SmoochAppDeletedEvent {
  subject: Subjects.SmoochAppDeleted;
  data: {
    appId: string;
    organization: string;
  };
}

export interface SmoochAppUpdatedEvent {
  subject: Subjects.SmoochAppUpdated;
  data: {
    id: string;
    appId: string;
    name: string;
    organization: string;
    appToken: string;
    settings: Object;
    metadata: Object;
    version: number;
  };
}

