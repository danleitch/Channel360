import { APIKey } from "@models/api-key";
import { JsMsg, NatsConnection } from "nats";
import { apiKeyQueueGroupName } from "./queuGroupName";
import {
  APIKeyCreatedEvent,
  APIKeyUpdatedEvent,
  Listener,
  Subjects,
} from "@channel360/core";

/**
 * @class APIKeyCreatedListener
 * @description Listen to APIKeyCreatedEvent and create a new APIKey
 */
export class APIKeyCreatedListener extends Listener<APIKeyCreatedEvent> {
  readonly subject: Subjects.APIKeyCreated = Subjects.APIKeyCreated;

  stream = "APIKEY";

  durableName = "campaign-api-key-created-consumer";

  queueGroupName = apiKeyQueueGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: APIKeyCreatedEvent["data"], msg: JsMsg) {
    const apiKeyObj = APIKey.build(data);
    await apiKeyObj.save();
    msg.ack();
  }
}

/**
 * @class APIKeyUpdatedListener
 * @description Listen to APIKeyUpdatedEvent and update a APIKey
 */
export class APIKeyUpdatedListener extends Listener<APIKeyUpdatedEvent> {
  readonly subject: Subjects.APIKeyUpdated = Subjects.APIKeyUpdated;

  stream = "APIKEY";

  durableName = "campaign-api-key-updated-consumer";

  queueGroupName = apiKeyQueueGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: APIKeyUpdatedEvent["data"], msg: JsMsg) {
    const apiKeyObj = await APIKey.findByEvent(data);
    apiKeyObj?.set(data);
    await apiKeyObj?.save();
    msg.ack();
  }
}
