import express from "express";
import { ChartController } from "@controllers/ChartController";
import { validateRequest } from "@channel360/core";
import { UPDATE_CHART_VALIDATION } from "@validations/chart-validations";

const router = express.Router({ mergeParams: true });

router.use(
  UPDATE_CHART_VALIDATION,
  validateRequest,
  new ChartController().update,
);

export { router as updateChartRouter };
