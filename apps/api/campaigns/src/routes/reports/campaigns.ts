import express, { Request, Response } from "express";
import { GetSuccess } from "@channel360/core";
import { Campaigns } from "@models/campaigns";

const router = express.Router({ mergeParams: true });
router.use(async (req: Request, res: Response) => {
  const orgId = req.params.orgId;

  const campaigns = await Campaigns.countDocuments({ organization: orgId });

  return new GetSuccess(res).send({ title: "Campaigns", count: campaigns });
});

export { router as campaignsReportRouter };
