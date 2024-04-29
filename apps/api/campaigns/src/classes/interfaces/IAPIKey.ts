export interface APIKeyAttr {
  id: string;
  organization: string;
  apiKey: string;
  revoked?: boolean;
}
