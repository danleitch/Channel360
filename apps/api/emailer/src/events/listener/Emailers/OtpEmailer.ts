import { Emailer, Options } from "@utilities/emailer";
import { EmailEvent } from "@channel360/core";

export class OtpEmail extends Emailer {
  constructor(event: EmailEvent["data"], html: string) {
    super(html);

    this.options = {
      toAddress: event.toEmail,
      subject: `Your OTP is ${event.otp}`,
      text: `Your OTP is ${event.otp}`,
    };

    this.replacements = {
      otp: event.otp,
      name: event.name,
    };
  }

  options: Options;
  replacements: any;
}
