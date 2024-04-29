import {NatsConnection, JsMsg} from 'nats';
import {Plan} from "@models/plan";
import {queueGroupPlanName} from "./queu-group-name";
import { Listener, NotFoundError, PlanUpdatedEvent, Subjects } from "@channel360/core";

export class PlanUpdatedListener extends Listener<PlanUpdatedEvent> {

    readonly subject: Subjects.PlanUpdated = Subjects.PlanUpdated;

    stream = "PLAN";

    durableName = "plan-updated-consumer";

    queueGroupName = queueGroupPlanName;

    constructor(natsClient: NatsConnection) {
        super(natsClient);
    }

    async onMessage(data: PlanUpdatedEvent["data"], msg: JsMsg) {
        const plan = await Plan.findByEvent(data);

        if (!plan) {
            throw new NotFoundError();
        }

        plan.set({
            title: data.title,
            price: data.price,
            includes: data.includes,
            description: data.description,
            term: data.term,
            version: data.version,
        });

        await plan.save();

        msg.ack();
    }
}
