import { Emailer, Options } from "@utilities/emailer";
import { EmailEvent} from "@channel360/core";

export class ResetEmail extends Emailer {
  constructor(
    event: EmailEvent["data"],
    html: string
  ) {
    super(html);

    this.options = {
      toAddress: event.toEmail,
      subject: `You have requested to reset your password`,
      text: `You have requested to reset your password, please follow the link below to reset your password`,
    };

    this.replacements = {
      url: event.url,
    };
  }

  options: Options;
  replacements: any;
}