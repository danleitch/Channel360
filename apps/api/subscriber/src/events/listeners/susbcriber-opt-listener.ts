import {
  SubscriberOptEvent,
  Listener,
  Subjects,
  BadRequestError,
} from "@channel360/core";
import { Subscriber } from "@models/subscriber";
import { subscriberOptQueueGroupName } from "./queueGroupName";
import { JsMsg, NatsConnection } from "nats";

export class SubscriberOptListener extends Listener<SubscriberOptEvent> {
  readonly subject: Subjects.SubscriberOpt = Subjects.SubscriberOpt;

  stream = "SUBSCRIBER-OPT";

  durableName = "subscriber-opt-consumer";

  queueGroupName = subscriberOptQueueGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: SubscriberOptEvent["data"], msg: JsMsg) {
    console.log("Subscriber Opt Listener Called: ", data);
    const { id, organization, optInStatus } = data;

    // Normalize the id to ensure it's in the correct format
    const normalizedId = id.startsWith("+") ? id.substring(1) : id; // Remove '+' if it exists

    // Create a regex to match both +27 and 27 formats
    const mobileNumberRegex = new RegExp(`^\\+?${normalizedId}$`);

    await Subscriber.findOneAndUpdate(
      {
        mobileNumber: { $regex: mobileNumberRegex },
        organization: organization,
      },
      {
        $set: {
          optInStatus: optInStatus,
        },
      }
    )
      .then((subscriber) => {
        console.log("Subscriber Opt Listener Updated: ", subscriber);
      })
      .catch((err) => {
        console.log("Subscriber Opt Listener Error: ", err);
        new BadRequestError("Error Updating Subscriber Opt Status");
      });
    msg.ack();
  }
}
