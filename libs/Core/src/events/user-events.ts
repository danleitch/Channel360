import { Subjects } from "./subjects";

export interface UserCreatedEvent {
  subject: Subjects.UserCreated;
  data: {
    id: string;
    cognitoId: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
  };
}
export interface UserUpdatedEvent {
  subject: Subjects.UserUpdated;
  data: {
    id: string;
    cognitoId: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    version: number;
  };
}
