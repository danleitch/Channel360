import { orgIdType as organizationId } from 'src/context/organization.context';

export type SubscriberType = {
  optInStatus: boolean;
  organization: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  id: string;
};

export interface Group {
  enabled: boolean;
  memberCount: number;
  organization?: organizationId;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  id: string;
}

export interface Groups {
  total: number;
  totalPages: number;
  data: Group[];
}
