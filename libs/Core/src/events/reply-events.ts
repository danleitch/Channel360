import {Subjects} from "./subjects";

export interface ReplyEvent {
    subject: Subjects.ReplyCreated;
    data: {
        authorId: string;
        text: string;
        organizationId: string;
    };
}
