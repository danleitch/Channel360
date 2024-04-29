export interface ISmoochApp {
  id: string;
  appId: string;
  organization: string;
  name: string;
  appToken: string;
  settings: object;
  metadata?: object;
  integrationId?: string;
}
