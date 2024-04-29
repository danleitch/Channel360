import { Subjects } from "./subjects";

export interface AdminCreatedEvent {
  subject: Subjects.AdminCreated;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    version: number;
  };
}
export interface AdminUpdatedEvent {
  subject: Subjects.AdminUpdated;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    version: number;
  };
}
