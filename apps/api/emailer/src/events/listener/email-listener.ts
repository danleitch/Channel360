import {
  EmailEvent,
  EmailSubjects,
  Listener,
  Subjects,
} from "@channel360/core";
import { queuGroupName } from "./queuGroupName";
import { JsMsg, NatsConnection } from "nats";
import { readHTMLFile } from "@utilities/file-reader";
import { join } from "path";
import { AddUserEmail } from "@listeners/Emailers/AddUserEmailer";
import { OtpEmail } from "@listeners/Emailers/OtpEmailer";
import { InviteEmail } from "@listeners/Emailers/InviteUserEmailer";
import { ResetEmail } from "@listeners/Emailers/ResetPasswordEmailer";
import { RemoveUserEmail } from "@listeners/Emailers/RemoveUserEmailer";
import { NewUserCreatedEmailer } from "@listeners/Emailers/NewUserCreatedEmailer";

const ADD_USER_TEMPLATE_PATH = join(__dirname, "/emails/add-user.html");
const REMOVE_USER_TEMPLATE_PATH = join(__dirname, "/emails/remove-user.html");
const OTP_TEMPLATE_PATH = join(__dirname, "/emails/otp.html");
const INVITE_TEMPLATE_PATH = join(__dirname, "/emails/invite.html");
const RESET_TEMPLATE_PATH = join(__dirname, "/emails/reset-password.html");
const NEW_USER_TEMPLATE_PATH = join(__dirname, "/emails/new-user.html");

export class EmailListener extends Listener<EmailEvent> {
  subject: Subjects.EmailCreated = Subjects.EmailCreated;

  stream = "EMAILS";

  durableName = "emails-consumer";

  queueGroupName = queuGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(event: EmailEvent["data"], msg: JsMsg) {
    try {
      switch (event.emailType) {
        case EmailSubjects.UserAdded:
          await new AddUserEmail(
            event,
            await readHTMLFile(ADD_USER_TEMPLATE_PATH)
          ).send();

          break;

        case EmailSubjects.UserRemoved:
          await new RemoveUserEmail(
            event,
            await readHTMLFile(REMOVE_USER_TEMPLATE_PATH)
          ).send();

          break;

        case EmailSubjects.OtpCreated:
          await new OtpEmail(
            event,
            await readHTMLFile(OTP_TEMPLATE_PATH)
          ).send();

          break;

        case EmailSubjects.Invite:
          await new InviteEmail(
            event,
            await readHTMLFile(INVITE_TEMPLATE_PATH)
          ).send();

          break;

        case EmailSubjects.PasswordReset:
          await new ResetEmail(
            event,
            await readHTMLFile(RESET_TEMPLATE_PATH)
          ).send();

          break;

        case EmailSubjects.NewUserCreated:
          await new NewUserCreatedEmailer(
            event,
            await readHTMLFile(NEW_USER_TEMPLATE_PATH)
          ).send();

          break;

        default:
          break;
      }
    } catch (err) {
      console.error("Error sending invite email:", err);
    }
    msg.ack();
  }
}
