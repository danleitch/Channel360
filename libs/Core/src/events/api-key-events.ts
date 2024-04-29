import { Subjects } from "./subjects";

export interface APIKeyCreatedEvent {
  subject: Subjects.APIKeyCreated;
  data: {
    id: string;
    apiKey: string;
    organization: string;
    revoked: boolean;
  };
}
export interface APIKeyUpdatedEvent {
  subject: Subjects.APIKeyUpdated;
  data: {
    id: string;
    apiKey: string;
    organization: string;
    revoked: boolean;
    version: number;
  };
}
