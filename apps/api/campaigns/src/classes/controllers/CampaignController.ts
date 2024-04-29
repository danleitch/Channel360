import {
  BadRequestError,
  CreateSuccess,
  DeleteSuccess,
  GetSuccess,
  TemplateTagValidator,
  UpdateSuccess,
} from "@channel360/core";
import { Request, Response } from "express";
import { Recipient } from "@models/reciepient";
import { Templates } from "@models/templates";
import { natsWrapper } from "../../nats-wrapper";
import { ICampaign } from "@interfaces/ICampaign";
import { Notification } from "@models/notification";
import { ISubscriber } from "@interfaces/ISubscriber";
import { IController } from "@interfaces/IController";
import { INotification } from "@interfaces/INotification";
import { subscriberService } from "../../subscriber-service";
import CampaignRepository from "@repositories/CampaignRepository";
import { checkAllTagsArePresent } from "@helpers/checkAllTagsArePresent";
import { CampaignCreatedPublisher } from "@publishers/campaign-created-publisher";
import { CampaignUpdatedPublisher } from "@publishers/campaign-updated-publisher";

export class CampaignController implements IController<ICampaign> {
  async create(req: Request, res: Response) {
    const {
      reference,
      status,
      subscriberGroup,
      tags: campaignTags,
      scheduled,
      template: templateId,
      color,
    } = req.body;

    const organizationId = req.params.orgId;

    const scheduled_gmt_2 = new Date(scheduled);

    const template = await Templates.findById(templateId);

    if (!template) {
      throw new BadRequestError("Could not find a template");
    }

    /**
     * Validate that the campaign tags match with the template tags
     */
    checkAllTagsArePresent(template.tags, campaignTags);

    /**
     * Validating Template Tags 🔎📜
     */
    if (
      campaignTags &&
      (campaignTags.head.length > 0 || campaignTags.body.length > 0)
    ) {
      const templateValidator = new TemplateTagValidator();

      const { validTemplate, errors } =
        templateValidator.validateTemplateTags(campaignTags);

      if (!validTemplate) {
        throw new BadRequestError(errors.join(","));
      }
    }

    const subscribers = await subscriberService(
      req,
      subscriberGroup,
      organizationId
    );

    if (!subscribers) {
      throw new BadRequestError("Subscribers not found");
    }

    const campaignData: ICampaign = {
      reference,
      status,
      subscriberGroup,
      tags: campaignTags,
      template: templateId,
      scheduled: scheduled_gmt_2,
      organization: organizationId,
      color,
    };

    const campaign = await CampaignRepository.create(campaignData);

    const pendingStatus = "PENDING";

    const obj = subscribers.map((subscriber: ISubscriber) => ({
      reference,
      status: pendingStatus,
      campaign: campaign.id,
      subscriber: subscriber.id,
      lastName: subscriber.lastName,
      firstName: subscriber.firstName,
      optInStatus: subscriber.optInStatus,
      mobileNumber: subscriber.mobileNumber,
      category: template.category,
      organization: organizationId,
      scheduled: scheduled_gmt_2,
    }));

    const notificationObj = (await Notification.insertMany(
      obj
    )) as INotification[];

    const recipients = notificationObj.map((notification: INotification) => ({
      status: pendingStatus,
      lastName: notification.lastName,
      campaign: notification.campaign,
      notificationId: notification._id,
      firstName: notification.firstName,
      reference: notification.reference,
      subscriber: notification.subscriber,
      optInStatus: notification.optInStatus,
      organization: notification.organization,
      mobileNumber: notification.mobileNumber,
      scheduled: scheduled_gmt_2,
    }));

    await Recipient.insertMany(recipients);

    await new CampaignCreatedPublisher(natsWrapper.client).publish({
      status,
      reference,
      subscriberGroup,
      id: campaign.id,
      tags: campaignTags,
      template: templateId,
      version: campaign.version,
      scheduled: scheduled_gmt_2,
      organization: organizationId,
    });

    return new CreateSuccess(res).send(
      "Campaign created successfully",
      campaign
    );
  }

  async list(req: Request, res: Response) {
    const orgId = req.params.orgId;

    const pagination = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: (req.query.search as string) || "",
    };

    const { data, totalDocuments, totalPages } = await CampaignRepository.list(
      orgId,
      pagination
    );
    const response = {
      data,
      totalDocuments,
      totalPages,
      currentPage: pagination.page,
    };

    return new GetSuccess(res).send(response);
  }

  async get(req: Request, res: Response) {
    const { orgId, campaignId } = req.params;

    //get campaign
    const campaign = await CampaignRepository.get(campaignId, orgId);

    if (!campaign) {
      throw new BadRequestError("Cannot find Campaign");
    }

    return new GetSuccess(res).send(campaign);
  }

  async delete(req: Request, res: Response) {
    const { campaignId } = req.params;

    await CampaignRepository.delete(campaignId);

    return new DeleteSuccess(res).send();
  }

  async update(req: Request, res: Response) {
    const campaignId = req.params.campaignId;
    const updateFields = req.body;

    const acceptedFields: string[] = [
      "template",
      "status",
      "scheduled",
      "started",
      "completed",
      "subscriberGroup",
      "tags",
      "recipients",
      "color",
    ];

    // Filter the fields based on the accepted fields array
    const filteredUpdateFields: Partial<ICampaign> = {};
    for (const field of acceptedFields) {
      if (updateFields[field] !== undefined) {
        filteredUpdateFields[field as keyof ICampaign] = updateFields[field];
      }
    }

    const updatedCampaign = await CampaignRepository.update(
      campaignId,
      filteredUpdateFields
    );

    await new CampaignUpdatedPublisher(natsWrapper.client).publish({
      id: updatedCampaign._id,
      organization: updatedCampaign.organization,
      reference: updatedCampaign.reference,
      status: updatedCampaign.status,
      scheduled: updatedCampaign.scheduled,
      template: updatedCampaign.template,
      subscriberGroup: updatedCampaign.subscriberGroup,
      tags: updatedCampaign.tags,
      version: updatedCampaign.version,
    });

    return new UpdateSuccess(res).send(
      "Campaign Updated Successfully",
      updatedCampaign
    );
  }
}
