import {Listener, Subjects, SettingsUpdatedEvent} from "@channel360/core";
import {NatsConnection, JsMsg} from 'nats';
import {Settings} from "@models/settings";
import {settingsQueueGroupName} from "./queuGroupName";

export class SettingsUpdatedListener extends Listener<SettingsUpdatedEvent> {

    readonly subject: Subjects.SettingsUpdated = Subjects.SettingsUpdated;

    stream = "SETTINGS";

    durableName = "settings-updated-consumer";

    queueGroupName = settingsQueueGroupName;

    constructor(natsClient: NatsConnection) {
        super(natsClient);
    }

    async onMessage(data: SettingsUpdatedEvent["data"], msg: JsMsg) {
        console.log("Update Settings Listener Called", data)
        const settings = await Settings.findByEvent(data);

        if (!settings) {
            throw new Error("Settings not found");
        }
        // delete version from data.
        let newData = Object.assign({}, data);
        // @ts-ignore
        delete newData.version

        settings.set(newData);
        await settings.save().catch(err => {
            console.log("There was an error updating settings", err);
            msg.ack();
        });

        msg.ack();
    }
}
