import {
  CampaignSendEvent,
  Listener,
  ModelFinder,
  ParameterComponent,
  Subjects,
} from "@channel360/core";
import { JsMsg, NatsConnection } from "nats";
import { Campaigns } from "@models/campaigns";
import { Templates } from "@models/templates";
import { Recipient } from "@models/reciepient";
import { processCSVTags } from "@helpers/csv-helpers";
import { publishNotification } from "@helpers/publishNotification";
import { generateComponentForRecipient } from "@helpers/generateComponentsForRecipient";
import { queueCampaignGroupName } from "./queueGroupName";

export class CampaignSendListener extends Listener<CampaignSendEvent> {
  readonly subject: Subjects.CampaignSend = Subjects.CampaignSend;

  stream = "SCHEDULER-CAMPAIGN";

  durableName = "campaign-send-consumer";

  queueGroupName = queueCampaignGroupName;

  constructor(natsClient: NatsConnection) {
    super(natsClient);
  }

  async onMessage(data: CampaignSendEvent["data"], msg: JsMsg) {
    const { id } = data;

    const campaign = await ModelFinder.findByIdOrFail(
      Campaigns,
      id,
      "Campaign not found",
    );

    const template = await ModelFinder.findByIdOrFail(
      Templates,
      campaign.template,
      "Template not found",
    );

    const recipients = await Recipient.find({
      campaign: id,
      organization: campaign.organization,
    }).lean();

    /**
     * Fetching and Processing CSV Tags
     */

    let headerCSVRows: { index: number; data: any }[];
    let bodyCSVRows: { index: number; data: any }[];
    let buttonsCSVRows: { index: number; data: any }[];

    const tagFilter = (tag: any) => tag.type === "csv";

    if (!campaign.tags) return;

    const headCSVTags = campaign.tags.head?.filter(tagFilter) ?? [];

    const bodyCSVTags = campaign.tags.body?.filter(tagFilter) ?? [];

    const buttonsCSVTags = campaign.tags.buttons?.filter(tagFilter) ?? [];

    headerCSVRows = await processCSVTags(headCSVTags);
    bodyCSVRows = await processCSVTags(bodyCSVTags);
    buttonsCSVRows = await processCSVTags(buttonsCSVTags);

    /**
     * End Processing CSV Tags
     */

    // 15 per second 1000/15 = 66
    const delay = 66;

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];

      if (!recipient.optInStatus) {
        continue;
      }

      const destinationId = removePrefix(recipient.mobileNumber);

      const recipientHeadComponent = await generateComponentForRecipient(
        campaign.tags.head || [],
        "HEADER",
        destinationId,
        headerCSVRows,
        recipient,
      );

      const recipientBodyComponent = await generateComponentForRecipient(
        campaign.tags.body || [],
        "BODY",
        destinationId,
        bodyCSVRows,
        recipient,
      );

      const recipientButtonsComponent = await generateComponentForRecipient(
        campaign.tags.buttons || [],
        "BUTTON",
        destinationId,
        buttonsCSVRows,
        recipient,
      );

      const components: ParameterComponent[] = []
      if(recipientHeadComponent.parameters.length > 0 ) {
        components.push(recipientHeadComponent)
      }
      if(recipientBodyComponent.parameters.length > 0 ) {
        components.push(recipientBodyComponent)
      }
      if(recipientButtonsComponent.parameters.length > 0 ) {
        components.push(recipientButtonsComponent)
      }

      await publishNotification(
        recipient,
        template,
        campaign,
        destinationId,
        components,
      );

      // Introduce a delay between each message
      if (i < recipients.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    msg.ack();
  }
}

const removePrefix = (mobileNumber: string) => {
  return mobileNumber.replace("+", "");
};
