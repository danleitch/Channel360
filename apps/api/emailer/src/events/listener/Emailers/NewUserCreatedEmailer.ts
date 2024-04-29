import { Emailer, Options } from "@utilities/emailer";
import { EmailEvent } from "@channel360/core";

export class NewUserCreatedEmailer extends Emailer {
  constructor(event: EmailEvent["data"], html: string) {
    const { toEmail,userEmail,adminName,name } = event;

    super(html);

    this.options = {
      toAddress: toEmail,
      subject: `A new user has joined Channel360`,
      text: `${name} has joined Channel360. Please assign the user to an organization`
    };

    this.replacements = {
      name,
      adminName,
      userEmail,
      url: `${process.env.SITE_URL}/admin/organization`,
    };
  }

  options: Options;
  replacements: any;
}
