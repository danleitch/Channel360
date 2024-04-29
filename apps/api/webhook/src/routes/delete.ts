import express, { Request, Response } from "express";
import { Webhook } from "@models/webhook";

const router = express.Router({ mergeParams: true });

router.use(async (req: Request, res: Response) => {
  const { webhookId } = req.params;

  await Webhook.findByIdAndDelete(webhookId);

  res.status(200).send({ message: "Webhook deleted successfully" });
});

export { router as deleteWebhookRouter };
