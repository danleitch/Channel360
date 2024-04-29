import { JsMsg, NatsConnection } from 'nats';
import { User } from "@models/user";
import { queueGroupName } from "./queu-group-name";
import { BadRequestError, Listener, Subjects, UserCreatedEvent } from "@channel360/core";

export class UserCreatedListener extends Listener<UserCreatedEvent> {

  subject: Subjects.UserCreated = Subjects.UserCreated;

  stream = "USER";

  durableName = "user-created-consumer";

  queueGroupName = queueGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: UserCreatedEvent["data"], msg: JsMsg) {
    console.log("User Created Event Listener Called: ", data);
    try {
      const user = User.build({
        id: data.id,
        firstName: data.firstName,
        cognitoId: data.cognitoId,
        lastName: data.lastName,
        mobileNumber: data.lastName,
        email: data.email,
      });
      await user.save();
    } catch (error) {
      new BadRequestError("User already exists");
    }

    msg.ack();
  }
}
