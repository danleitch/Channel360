import {Subjects} from "./subjects";

export interface CustomerResponseEvent {
  subject: Subjects.CustomerResponseCreated;
  data: {
    text: string;
    notificationId: string;
    organizationId: string;
  };
}
