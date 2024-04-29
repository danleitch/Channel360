import { Router, Request, Response } from "express";
import { GetSuccess } from "@channel360/core";
import { Subscriber } from "@models/subscriber";

const router = Router({ mergeParams: true });
router.use(async (req: Request, res: Response) => {
  const orgId = req.params.orgId;

  const subscribers = await Subscriber.countDocuments({ organization: orgId });

  return new GetSuccess(res).send({ title: "Subscribers", count: subscribers });
});

export { router as subscriberReportRouter };
