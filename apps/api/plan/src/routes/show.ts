import express, { Request, Response } from "express";
import { Plan } from "@models/plan";

const router = express.Router({mergeParams: true});

router.use(async (req: Request, res: Response) => {
  const plan = await Plan.findById(req.params.id);

  res.send(plan);
});

export { router as showPlanRouter };
