interface ICampaign {
  reference: string;
  // other properties
}

interface IRecipient {
  mobileNumber: string;
  // other properties
}

export interface ICampaignResponse {
  text: string;
  campaign: ICampaign;
  recipient: IRecipient;
}

export interface IResponse {
  organization: string;
  campaign: string;
  recipient: string;
  text: string;
}
