import {
  Listener,
  Subjects,
  ReplyEvent,
  BadRequestError
} from "@channel360/core";
import { NatsConnection, JsMsg } from "nats";
import { Organization } from "@models/organization";
import { SmoochApp } from "@models/smoochApp";
import axios from "axios";
import { replyQueueGroupName } from "./queuGroupName";

export class ReplyListener extends Listener<ReplyEvent> {
  readonly subject: Subjects.ReplyCreated = Subjects.ReplyCreated;

  stream = "REPLY";

  durableName = "reply-consumer";

  queueGroupName = replyQueueGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: ReplyEvent["data"], msg: JsMsg) {
    console.log("Reply Created Listener called", data);

    const { organizationId, text, authorId } = data;
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      throw new BadRequestError("Organization not found");
    }

    const smoochApp: any = await SmoochApp.findOne({
      organization: organization.id
    });
    if (!smoochApp || !smoochApp.integrationId) {
      throw new BadRequestError("Not valid smooch details");
    }

    const appId = smoochApp.appId;

    const httpData = JSON.stringify({
      role: "appMaker",
      text,
      type: "text"
    });

    
    await axios({
      method: "post",
      url: `https://api.smooch.io/v1.1/apps/${appId}/appusers/${authorId}/messages`,
      headers: {
        Authorization: `Basic ${new Buffer(
          process.env.SMOOCH_USERNAME + ":" + process.env.SMOOCH_PASSWORD
        ).toString("base64")}`,
        "Content-Type": "application/json"
      },
      data: httpData
    })
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch(() => msg.ack());

    msg.ack();
  }
}
