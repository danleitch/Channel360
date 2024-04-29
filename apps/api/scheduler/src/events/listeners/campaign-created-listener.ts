import {
  Listener,
  CampaignCreatedEvent,
  Subjects,
} from "@channel360/core";
import {campaignQueueGroupName} from "./queueGroupName";
import {JsMsg, NatsConnection} from "nats";
import agenda from "@jobs/index";

export class CampaignCreatedListener extends Listener<CampaignCreatedEvent> {

  readonly subject: Subjects.CampaignCreated = Subjects.CampaignCreated;

  stream = "CAMPAIGN";

  durableName = "scheduler-campaign-created-consumer";

  queueGroupName = campaignQueueGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }
  async onMessage(data: CampaignCreatedEvent["data"], msg: JsMsg) {
    //send campaign job (data = data)
    const scheduled = data.scheduled; //"10 seconds";

    if (data.status === "enabled") {
      const job = agenda.create("send campaign", data);
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
