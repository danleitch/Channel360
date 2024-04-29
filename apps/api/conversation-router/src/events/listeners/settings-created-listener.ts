import {Listener, Subjects, SettingsCreatedEvent} from "@channel360/core";
import {NatsConnection, JsMsg} from 'nats';
import {Settings} from "@models/settings";
import {settingsQueueGroupName} from "./queuGroupName";

export class SettingsCreatedListener extends Listener<SettingsCreatedEvent> {

    readonly subject: Subjects.SettingsCreated = Subjects.SettingsCreated;

    stream = "SETTINGS";

    durableName = "settings-created-consumer";

    queueGroupName = settingsQueueGroupName;

    constructor(natsClient: NatsConnection) {
        super(natsClient);
    }

    async onMessage(data: SettingsCreatedEvent["data"], msg: JsMsg) {

        const settings = Settings.build(data);
        await settings.save().catch((err) => {
            console.log("Error Creating Settings", err);
            msg.ack();
        });

        msg.ack();
    }
}
