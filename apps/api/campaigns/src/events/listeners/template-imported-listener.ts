import { Listener, TemplateImportedEvent, Subjects } from "@channel360/core";
import { Templates } from "@models/templates";
import { queueTemplateGroupName } from "./queueGroupName";
import { JsMsg, NatsConnection } from "nats";

export class TemplateImportedListener extends Listener<TemplateImportedEvent> {
  readonly subject: Subjects.TemplateImported = Subjects.TemplateImported;

  stream = "TEMPLATE";

  durableName = "campaign-template-imported-consumer";

  queueGroupName = queueTemplateGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: TemplateImportedEvent["data"], msg: JsMsg) {
    const {
      id,
      status,
      enabled,
      organization,
      language,
      tags,
      components,
      description,
      category,
      name,
      namespace,
      messageTemplateId,
      version,
    } = data;

    /**
     * Find Template insert or update
     */

    await Templates.findOneAndUpdate(
      {
        _id: id,
        organization: organization,
      },
      {
        status,
        enabled,
        language,
        tags,
        components,
        name,
        description,
        category,
        namespace,
        messageTemplateId,
        version,
      },
      {
        upsert: true,
        new: true,
      }
    );

    msg.ack();
  }
}
