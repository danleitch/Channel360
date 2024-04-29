export interface IAPIKey {
  organization: string;
  apiKey: string;
  revoked?: boolean;
}