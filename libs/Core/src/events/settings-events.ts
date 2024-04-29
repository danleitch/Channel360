import { Subjects } from "./subjects";

export interface SettingsCreatedEvent {
  subject: Subjects.SettingsCreated;
  data: {
    id: string;
    optOutMessage:string;
    optInMessage:string;
    version: number;
  };
}
export interface SettingsUpdatedEvent {
  subject: Subjects.SettingsUpdated;
  data: {
    id: string;
    optOutMessage:string;
    optInMessage:string;
    version: number;
  };
}
