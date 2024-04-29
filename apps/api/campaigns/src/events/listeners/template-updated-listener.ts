import {
  Listener,
  Subjects,
  TemplateInternalUpdatedEvent,
} from "@channel360/core";
import { Templates } from "@models/templates";
import { queueTemplateGroupName } from "./queueGroupName";
import { JsMsg, NatsConnection } from "nats";

export class TemplateInternalUpdatedListener extends Listener<TemplateInternalUpdatedEvent> {
  readonly subject: Subjects.TemplateInternalUpdated =
    Subjects.TemplateInternalUpdated;

  stream = "TEMPLATE";

  durableName = "campaign-template-updated-consumer";

  queueGroupName = queueTemplateGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: TemplateInternalUpdatedEvent["data"], msg: JsMsg) {
    console.log(
      "Template Updated Listener Called: ",
      data.id + ": " + data.version
    );
    const template = await Templates.findByEvent(data);
    if (!template) {
      console.error(
        "Template Not Found with id: ",
        data.id + ": " + data.version
      );
      const checkTemplate = await Templates.findById(data.id);
      if (checkTemplate) {
        console.log("Attempting to resolve version conflict");

        if (checkTemplate!.version >= data.version) {
          console.log("Template version conflict resolved");
          return msg.ack();
        }
      }
      return console.log("Still trying to resolve version conflict");
    }

    const dataToInsert = {
      id: data.id,
      organization: data.organization,
      status: data.status,
      tags: data.tags,
      description: data.description,
      enabled: data.enabled,
      components: data.components,
      messageTemplateId: data.messageTemplateId,
    };

    template!.set(dataToInsert);
    await template!.save();
    msg.ack();
  }
}
