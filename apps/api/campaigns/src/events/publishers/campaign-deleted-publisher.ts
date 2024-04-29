import { Publisher, CampaignDeletedEvent, Subjects } from "@channel360/core";

export class CampaignDeletedPublisher extends Publisher<CampaignDeletedEvent> {
  subject: Subjects.CampaignDeleted = Subjects.CampaignDeleted;
}
