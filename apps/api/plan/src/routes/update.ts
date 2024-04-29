import express, { Request, Response } from "express";
import {
  NotFoundError,
  validateRequest,
} from "@channel360/core";
import { body } from "express-validator";
import { Plan } from "@models/plan";
import { natsWrapper } from "../nats-wrapper";
import { PlanUpdatedPublisher } from "@publishers/plan-update-publisher";
const router = express.Router({mergeParams: true});

// Update Ticket
router.use(
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat().withMessage("Price must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { title, price, description, includes, term } = req.body;

    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      throw new NotFoundError();
    }

    plan.set({ title, price, description, includes, term });

    await plan.save();

    await new PlanUpdatedPublisher(natsWrapper.client).publish({
      id: plan.id,
      title: plan.title,
      price: plan.price,
      description: plan.description,
      includes: plan.includes,
      term: plan.term,
      version: plan.version,
    });

    res.send(plan);
  }
);

export { router as updatePlanRouter };
