import {
  Listener,
  Subjects,
  CampaignDeletedEvent,
} from "@channel360/core";
import {campaignQueueGroupName} from "./queueGroupName";
import {JsMsg, NatsConnection} from "nats";
import agenda from "@jobs/index";

export class CampaignDeletedListener extends Listener<CampaignDeletedEvent> {

  readonly subject: Subjects.CampaignDeleted = Subjects.CampaignDeleted;

  stream = "CAMPAIGN";

  durableName = "scheduler-campaign-deleted-consumer";

  queueGroupName = campaignQueueGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: CampaignDeletedEvent["data"], msg: JsMsg) {
    //send campaign job (data = data)

    await agenda.cancel({ id: data.id, reference: data.reference });

    msg.ack();
  }
}
