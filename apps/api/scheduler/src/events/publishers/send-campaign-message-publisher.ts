import { Publisher, Subjects, CampaignSendEvent } from "@channel360/core";

export class CampaignSendPublisher extends Publisher<CampaignSendEvent> {
  subject: Subjects.CampaignSend = Subjects.CampaignSend;
}
