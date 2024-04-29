import {
  Listener,
  CampaignUpdatedEvent,
  Subjects,
} from "@channel360/core";
import {JsMsg, NatsConnection} from "nats";
import {campaignQueueGroupName} from "./queueGroupName";
import agenda from "@jobs/index";

export class CampaignUpdatedListener extends Listener<CampaignUpdatedEvent> {

  readonly subject: Subjects.CampaignUpdated = Subjects.CampaignUpdated;

  stream = "CAMPAIGN";

  durableName = "scheduler-campaign-updated-consumer";

  queueGroupName = campaignQueueGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: CampaignUpdatedEvent["data"], msg: JsMsg) {
    const {
      scheduled,
    } = data;

    await agenda.cancel({ id: data.id, reference: data.reference });

    if (data.status === "enabled") {
      const job = await agenda.create("send campaign", data);
      job.schedule(scheduled);
      job.unique({
        "data.id": data.id,
        "data.reference": data.reference,
      });
      await job.save();
    }

    msg.ack();
  }
}
