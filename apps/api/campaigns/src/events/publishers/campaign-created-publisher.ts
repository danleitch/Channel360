import { Publisher, CampaignCreatedEvent, Subjects } from "@channel360/core";

export class CampaignCreatedPublisher extends Publisher<CampaignCreatedEvent> {
  subject: Subjects.CampaignCreated = Subjects.CampaignCreated;
}
