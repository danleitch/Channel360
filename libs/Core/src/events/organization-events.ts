import { Subjects } from "./subjects";
export interface OrganizationCreatedEvent {
  subject: Subjects.OrganizationCreated;
  data: {
    id: string;
    name: string;
    users?: string[];
    settings?: string;
    version: number;
  };
}
export interface OrganizationUpdatedEvent {
  subject: Subjects.OrganizationUpdated;
  data: {
    id: string;
    name: string;
    users?: string[];
    settings?: string;
    version: number;
  };
}
