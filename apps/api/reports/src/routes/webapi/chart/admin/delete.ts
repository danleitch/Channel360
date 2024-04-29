import express from "express";
import { ChartController } from "@controllers/ChartController";

const router = express.Router({ mergeParams: true });

router.use(new ChartController().delete);

export { router as deleteChartRouter };
