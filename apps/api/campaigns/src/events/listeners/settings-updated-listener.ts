import { Listener, SettingsUpdatedEvent, Subjects } from "@channel360/core";
import { Settings } from "@models/settings";
import { queueSettingsGroupName } from "./queueGroupName";
import { JsMsg, NatsConnection } from "nats";

export class SettingsUpdatedListener extends Listener<SettingsUpdatedEvent> {
  readonly subject: Subjects.SettingsUpdated = Subjects.SettingsUpdated;

  stream = "SETTINGS";

  durableName = "campaign-settings-updated-consumer";

  queueGroupName = queueSettingsGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: SettingsUpdatedEvent["data"], msg: JsMsg) {
    console.log("Update Settings Listener Called", data);

    const settings = await Settings.findByEvent(data).catch((err) => {
      console.log("There was an error finding settings", err);
      msg.ack();
    });

    if (!settings) {
      return new Error("Settings not found");
    }

    // delete version from data.
    const newData = Object.assign({}, data);
    //@ts-expect-error  remove version from data: this will cause type errors in the codebase
    delete newData.version;

    settings.set(newData);
    await settings.save().catch((err) => {
      console.log("There was an error updating settings", err);
      msg.ack();
    });

    msg.ack();
  }
}
