import express, { Request, Response } from "express";
import { BadRequestError } from "@channel360/core";
import { SmoochApp } from "@models/smoochApp";

const router = express.Router({ mergeParams: true });

router.use(async (req: Request, res: Response) => {
  const smoochApp = await SmoochApp.findOne({ appId: req.params.id });

  if (!smoochApp) {
    throw new BadRequestError("SmoochApp not found");
  }
  res.send(smoochApp);
});

export { router as showSmoochAppRouter };
