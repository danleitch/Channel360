import express from "express";
import { ChartController } from "@controllers/ChartController";
import { validateRequest } from "@channel360/core";
import { CREATE_CHART_VALIDATION } from "@validations/chart-validations";

const router = express.Router({ mergeParams: true });

router.use(
  CREATE_CHART_VALIDATION,
  validateRequest,
  new ChartController().create,
);

export { router as createChartRouter };