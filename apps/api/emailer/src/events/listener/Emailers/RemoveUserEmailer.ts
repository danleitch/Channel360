import { Emailer, Options } from "@utilities/emailer";
import { EmailEvent } from "@channel360/core";

export class RemoveUserEmail extends Emailer {
  constructor(
    event: EmailEvent["data"],
    html: string
  ) {
    const { toEmail, organizationName } = event;

    super(html);

    this.options = {
      toAddress: toEmail,
      subject: `You have been remove from ${organizationName}`,
      text: `You have been removed from ${organizationName}. You no long have access to this organization.`,
    };

    this.replacements = {
      name: event.name,
      organizationName: organizationName,
    };
  }

  options: Options;
  replacements: any;
}
