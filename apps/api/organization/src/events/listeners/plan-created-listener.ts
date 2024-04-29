import { NatsConnection, JsMsg } from 'nats';
import { Plan } from "@models/plan";
import {queueGroupPlanName} from "./queu-group-name";
import { BadRequestError, Listener, PlanCreatedEvent, Subjects } from "@channel360/core";

export class PlanCreatedListener extends Listener<PlanCreatedEvent> {

  readonly subject: Subjects.PlanCreated = Subjects.PlanCreated;

  stream = "PLAN";

  durableName = "plan-created-consumer";

  queueGroupName = queueGroupPlanName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: PlanCreatedEvent["data"], msg: JsMsg) {
    try {
      const plan = Plan.build({
        id: data.id,
        title: data.title,
        price: data.price,
        term: data.term,
        description: data.description,
        includes: data.includes,
      });
      await plan.save();
    } catch (error) {
      new BadRequestError("Plan already exists");
    }

    msg.ack();
  }
}
