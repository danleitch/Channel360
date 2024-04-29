import { JsMsg, NatsConnection } from 'nats';
import { User } from "@models/user";
import { queueGroupName } from "./queu-group-name";
import { BadRequestError, Listener, Subjects, UserUpdatedEvent } from "@channel360/core";

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {

  subject: Subjects.UserUpdated = Subjects.UserUpdated;

  stream = "USER";

  durableName = "user-updated-consumer";

  queueGroupName = queueGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: UserUpdatedEvent["data"], msg: JsMsg) {
    console.log("User Updated Event Listener Called: ", data);
    // update user
    const user = await User.findByEvent(data);
    if (!user) {
      let checkUser = await User.findById(data.id);
      if (checkUser) {
        if (checkUser.version >= data.version) {
          return msg.ack();
        }
      }
      return new BadRequestError("User not found");
    }
    user.set({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      mobileNumber: data.mobileNumber,
      email: data.email,
      cognitoId: data.cognitoId,
      version: data.version,
    });
    await user.save();
    msg.ack();
  }


}
