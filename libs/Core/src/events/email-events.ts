import { Subjects } from "./subjects";
import { EmailSubjects } from "../types/email";

export interface InviteCreatedEvent {
  subject: Subjects.InviteCreated;
  data: {
    toEmail: string;
    organizationId: string;
    organizationName: string;
  };
}

export interface OtpEmailCreatedEvent {
  subject: Subjects.OTPCreated;
  data: {
    toEmail: string;
    otp: string;
    name: string;
  };
}
export interface ResetPasswordEvent {
  subject: Subjects.ResetCreated;
  data: {
    toEmail: string;
    url: string;
  };
}

export interface AddUserToOrgEvent {
  subject: Subjects.UserAddedCreated;
  data: {
    toEmail: string;
    name: string;
    organizationId: string;
    organizationName: string;
  };
}

export interface EmailEvent {
  subject: Subjects.EmailCreated;
  data: {
    emailType: EmailSubjects;
    toEmail: string;
    name?: string;
    organizationId?: string;
    organizationName?: string;
    otp?: string;
    url?: string;
    userEmail?:string;
    adminName?:string;
  };
}
