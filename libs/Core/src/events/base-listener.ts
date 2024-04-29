import {
  AckPolicy,
  DeliverPolicy,
  JetStreamClient,
  JsMsg,
  JSONCodec,
  NatsConnection,
  ReplayPolicy,
} from "nats";
import { Subjects } from "./subjects";
import { EmailSubjects } from "../types/email";

interface Event {
  subject: Subjects | EmailSubjects;
  data: any;
}

interface IOptions {
  max_deliver: number
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];

  abstract durableName: string;

  abstract stream: string;

  abstract onMessage(data: T["data"], msg: JsMsg): void;

  protected client: JetStreamClient;

  protected constructor(natsClient: NatsConnection, protected options?: IOptions) {
    this.client = natsClient.jetstream();
  }

  async listen(): Promise<void> {
    const jsm = await this.client.jetstreamManager();

    await jsm.consumers
      .add(this.stream, {
        durable_name: this.durableName,
        deliver_policy: DeliverPolicy.All,
        ack_policy: AckPolicy.Explicit,
        replay_policy: ReplayPolicy.Instant,
        max_deliver: this.options?.max_deliver || 1,
        max_ack_pending: 100000,
        ack_wait: 30 * 60 * 1000 * 1000000,
        max_waiting: 1000,
        name: this.durableName,
        filter_subject: this.subject
      })
      .catch((err) => {
        if (err.code === "404") {
          console.log(`stream not found: ${this.stream}`);
        } else {
          throw err;
        }
      });

    // find the consumer
    const c = await this.client.consumers.get(this.stream, this.durableName);

    (async () => {
      const messages = await c.consume();
      for await (const m of messages) {
        console.log(
          `Received a message: ${m.info.stream}, ${m.info.consumer}, ${m.seq}, ${m.subject}, ${m.data}`
        );
        this.onMessage(JSONCodec().decode(m.data), m);
      }
    })().catch((err) => {
      console.log(
        `subscription for ${this.subject} exited with error ${err.message}`
      );
    });
  }
}
