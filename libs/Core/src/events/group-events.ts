import { Subjects } from "./subjects";

export interface SubscriberGroupAssignToEvent {
  subject: Subjects.SubscriberGroupAssign;
  data: {
    id: string;
    organization: string;
    group: string;
    subscriber: string;
    version: number;
  };
}
export interface SubscriberGroupUnAssignToEvent {
  subject: Subjects.SubscriberGroupUnassign;
  data: {
    id: string;
    organization: string;
    group: string;
    subscriber: string;
  };
}

export interface GroupCreatedEvent {
  subject: Subjects.GroupCreated;
  data: {
    id: string;
    organization: string;
    name: string;
    description: string;
    createdBy: string;
    enabled: boolean;
    version: number;
  };
}
export interface GroupUpdatedEvent {
  subject: Subjects.GroupUpdated;
  data: {
    id: string;
    organization: string;
    name: string;
    description: string;
    createdBy: string;
    enabled: boolean;
    version: number;
  };
}
export interface GroupDeletedEvent {
  subject: Subjects.GroupDeleted;
  data: {
    id: string;
    name: string;
    version: number;
  };
}
