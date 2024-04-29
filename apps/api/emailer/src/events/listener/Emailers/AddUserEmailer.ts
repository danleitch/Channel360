import { Emailer, Options } from "@utilities/emailer";
import { EmailEvent } from "@channel360/core";

export class AddUserEmail extends Emailer {
  constructor(event: EmailEvent["data"], html: string) {
    const { toEmail, organizationId, organizationName } = event;

    super(html);

    this.options = {
      toAddress: toEmail,
      subject: `You have been added to ${organizationName}`,
      text: `You have been added to ${organizationName}. Please click on the following link to view your organization: ${process.env.SITE_URL}/organization/${organizationId}`,
    };

    this.replacements = {
      name: event.name,
      url: `${process.env.SITE_URL}/organization/${organizationId}`,
      organizationName: organizationName,
    };
  }

  options: Options;
  replacements: any;
}
