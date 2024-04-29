export interface Recipient {
  _id: string;
  optInStatus: boolean;
  notificationId: {
    _id: string;
    status: string;
  };
  firstName: string;
  lastName: string;
  mobileNumber: string;
  status: string;
}
