import { Publisher, CampaignUpdatedEvent, Subjects } from "@channel360/core";

export class CampaignUpdatedPublisher extends Publisher<CampaignUpdatedEvent> {
  subject: Subjects.CampaignUpdated = Subjects.CampaignUpdated;
}
