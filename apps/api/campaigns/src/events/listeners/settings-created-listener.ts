import { Listener, SettingsCreatedEvent, Subjects } from "@channel360/core";
import { Settings } from "@models/settings";
import { queueSettingsGroupName } from "./queueGroupName";
import { JsMsg, NatsConnection } from "nats";

export class SettingsCreatedListener extends Listener<SettingsCreatedEvent> {
  readonly subject: Subjects.SettingsCreated = Subjects.SettingsCreated;

  stream = "SETTINGS";

  durableName = "campaign-settings-created-consumer";

  queueGroupName = queueSettingsGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: SettingsCreatedEvent["data"], msg: JsMsg) {
    const settings = Settings.build(data);
    await settings.save();

    msg.ack();
  }
}
