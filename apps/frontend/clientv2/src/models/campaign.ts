import { Tag } from './template';

/**
 * @Todo Update Tag,Template,Recipient,SubscriberGroup,Organization with appropriate types
 */
export interface Campaign {
  organization?: any;
  reference: string;
  template: any;
  status: string;
  creator: string;
  scheduled: Date;
  subscriberGroup: any;
  recipients: any[];
  createdAt: Date;
  updatedAt: Date;
  id: string;
  color: string;
  tags: {
    head: Tag[];
    body: Tag[];
  };
}

export interface CampaignObject {
  data: Campaign[];
  totalDocuments: number;
  totalPages: number;
  currentPage: number;
}
