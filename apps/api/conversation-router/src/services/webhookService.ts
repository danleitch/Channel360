import { BadRequestError, SmoochAPI } from "@channel360/core";

export class WebhooksService {
  constructor(
    private smoochApiClient: SmoochAPI,
    private readonly organizationId: string,
    private readonly baseUrl: string
  ) {
    this.smoochApiClient = smoochApiClient;
    this.organizationId = organizationId;
    this.baseUrl = baseUrl;
  }

  async addWebhooks(): Promise<void> {
    const notificationHookRequest = this.smoochApiClient.makePostRequest(
      "/webhooks",
      {
        target: `${this.baseUrl}/api/services/${this.organizationId}`,
        triggers: [
          "notification:delivery:channel",
          "notification:delivery:user",
          "notification:delivery:failure",
          "conversation:read",
          "message:appMaker",
          "message:appUser",
        ],
      }
    );

    const loggingHookRequest = this.smoochApiClient.makePostRequest(
      "/webhooks",
      {
        target: `${this.baseUrl}/api/logging/${this.organizationId}`,
        triggers: ["message:appMaker", "message:appUser"],
      }
    );

    try {
      await Promise.all([notificationHookRequest, loggingHookRequest]);
    } catch (error: any) {
      console.error(error);
      throw new BadRequestError(error?.message || "An Error Occurred");
    }
  }
}

export default WebhooksService;
