import { Job } from "agenda";
import { natsWrapper } from "../../nats-wrapper";
import { CampaignSendPublisher } from "@publishers/send-campaign-message-publisher";
import { SyncTemplatesPublisher } from "@publishers/sync-templates-publisher";

export const JobHandlers = {
  sendCampaign: async (job: Job, done: () => void) => {
    const { data } = job.attrs;
    const id = data?.id;
    const reference = data?.reference;
    const version = data?.version;

    console.log(id, reference, version);
    console.log(data);

    await new CampaignSendPublisher(natsWrapper.client).publish({
      id,
      reference,
      version,
    });

    done();
  },
  syncTemplates: async (job: Job, done: () => void) => {
    await new SyncTemplatesPublisher(natsWrapper.client).publish({});
    done();
  },
};
