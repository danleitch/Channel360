import { Emailer, Options } from "@utilities/emailer";
import { EmailEvent } from "@channel360/core";

export class InviteEmail extends Emailer {
  constructor(event: EmailEvent["data"], html: string) {
    const { toEmail, organizationId, organizationName } = event;

    super(html);

    this.options = {
      toAddress: toEmail,
      subject: `You have been invited to join ${organizationName}`,
      text: `You have been invited to join ${organizationName}. Please click on the following link to accept the invitation: ${process.env.SITE_URL}/invitation/${organizationId}`,
    };

    this.replacements = {
      channelName: organizationName,
      url: `${process.env.API_URL}/api/organization/${organizationId}/invite`,
    };
  }

  options: Options;
  replacements: any;
}
