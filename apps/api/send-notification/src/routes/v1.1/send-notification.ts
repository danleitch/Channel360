import express, { Request, Response } from "express";
import { ModelFinder, validateRequest } from "@channel360/core";
import { natsWrapper } from "../../nats-wrapper";
import { Notification } from "@models/notification";
import { NotificationCreatedPublisher } from "@publishers/notification-publisher";
import validateMessageSchema from "../../validations/send-notification.validation";
import { Templates } from "@models/templates";

const router = express.Router({ mergeParams: true });

router.use(
  validateMessageSchema,
  validateRequest,
  async (req: Request, res: Response) => {
    const { destination, message } = req.body;

    const { orgId } = req.params;

    const template = await ModelFinder.findOneOrFail(
      Templates,
      {
        name: message.template.name,
      },
      "Could not find a valid template",
    );

    const notification = Notification.build({
      organization: orgId,
      category: template.category,
      status: "PENDING"
    });

    await notification.save();

    await new NotificationCreatedPublisher(natsWrapper.client).publish({
      id: notification._id,
      category: template.category,
      organizationId: orgId,
      destinationId: destination,
      message,
    });

    res.status(201).send({
      notification: {
        _id: notification._id,
      },
    });
  },
);

export { router as sendNotificationRouter };
