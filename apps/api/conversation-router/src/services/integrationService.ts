import { SmoochAPI } from "@channel360/core";

export class IntegrationService {
  constructor(private smoochApiClient: SmoochAPI) {}

  async refreshIntegrations(): Promise<any[]> {
    const { data } = await this.smoochApiClient.makeGetRequest<{
      data: any;
    }>("/integrations");

    const { integrations } = data;

    if (!integrations || integrations.length < 1) {
      throw new Error("Error fetching integrations");
    }

    return integrations;
  }
}
