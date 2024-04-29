import { Publisher, SubscriberOptEvent, Subjects } from "@channel360/core";

export class SubscriberOptPublisher extends Publisher<SubscriberOptEvent> {
  subject: Subjects.SubscriberOpt = Subjects.SubscriberOpt;
}
