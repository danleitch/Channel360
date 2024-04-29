import { Publisher, ReplyEvent, Subjects } from "@channel360/core";

export class ReplyPublisher extends Publisher<ReplyEvent> {
  subject: Subjects.ReplyCreated = Subjects.ReplyCreated;
}
