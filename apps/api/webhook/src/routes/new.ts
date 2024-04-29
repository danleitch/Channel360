import express, { Request, Response } from "express";
import { validateRequest } from "@channel360/core";
import { body } from "express-validator";
import { Webhook } from "@models/webhook";

const router = express.Router({ mergeParams: true });

router.use(
  [
    body("target").not().isEmpty().withMessage("target is required"),
    body("triggers").not().isEmpty().withMessage("triggers is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { target, triggers } = req.body;

    const webhook = Webhook.build({
      organization: req.params.orgId,
      target,
      triggers,
    });

    await webhook.save();

    res.status(201).send({ message: "Webhook created successfully" });
  }
);

export { router as createWebhookRouter };
