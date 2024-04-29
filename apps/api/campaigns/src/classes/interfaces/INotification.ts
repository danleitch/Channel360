export interface INotification {
  category: string;
  organization: string;
  conversationId?: string;
  notification_id?: string;
  reference?: string;
  firstName?: string;
  lastName?: string;
  optInStatus?: boolean;
  mobileNumber?: string;
  subscriber?: string;
  campaign?: string;
  status?: string;
  _id?: string;
}
