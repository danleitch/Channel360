import { NatsConnection, JSONCodec, JetStreamClient } from "nats";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  protected client: JetStreamClient;

  constructor(natsClient: NatsConnection) {
    this.client = natsClient.jetstream();
  }

  async publish(data: T["data"]): Promise<void> {
    const msg = JSONCodec().encode(data);
    await this.client
      .publish(this.subject, msg)
      .then((pubAck) => {
        console.log(
          `Event published: ${this.subject}, Stream Name: ${pubAck.stream}, Seqno: ${pubAck.seq}`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
