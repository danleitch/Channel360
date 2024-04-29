import express, { Request, Response } from "express";
import { Webhook } from "@models/webhook";

const router = express.Router({ mergeParams: true });

router.use(async (req: Request, res: Response) => {
  const { orgId } = req.params;

  const webhooks = await Webhook.find({ organization: orgId });

  res.status(200).send(webhooks);
});

export { router as showWebhooksRouter };
