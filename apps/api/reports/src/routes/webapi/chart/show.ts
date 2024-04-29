import express from "express";
import { ChartController } from "@controllers/ChartController";
import { GET_CHART_VALIDATION } from "@validations/chart-validations";
import { validateRequest } from "@channel360/core";

const router = express.Router({ mergeParams: true });

router.use(GET_CHART_VALIDATION, validateRequest, new ChartController().get);

export { router as showChartRouter };
