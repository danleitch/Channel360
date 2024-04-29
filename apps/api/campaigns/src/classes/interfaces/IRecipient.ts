export interface IRecipient {
  organization: string;
  campaign: string;
  subscriber: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  status?: string;
  optInStatus: boolean;
  notificationId?: string;
}
