import express, { Request, Response } from "express";
import { validateRequest } from "@channel360/core";
import { body } from "express-validator";
import { Plan } from "@models/plan";
import { natsWrapper } from "../nats-wrapper";
import { PlanCreatedPublisher } from "@publishers/plan-create-publisher";

const router = express.Router({mergeParams: true});

router.use(
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat()
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, term, description, includes } = req.body;
    // create a plan
    const plan = Plan.build({
      title,
      term,
      description,
      includes,
      price,
    });
    await plan.save();
    await new PlanCreatedPublisher(natsWrapper.client).publish({
      id: plan.id,
      title: plan.title,
      price: plan.price,
      description: plan.description,
      includes: plan.includes,
      term: plan.term,
      version: plan.version,
    });
    res.status(201).send(plan);
  }
);

export { router as createPlanRouter };
