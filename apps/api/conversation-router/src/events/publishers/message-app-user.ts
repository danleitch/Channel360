import {AppMessageEvent, Publisher, Subjects} from "@channel360/core";

export class MessageAppUserPublisher extends Publisher<AppMessageEvent> {
  subject: Subjects.MessageAppUser = Subjects.MessageAppUser;
}
