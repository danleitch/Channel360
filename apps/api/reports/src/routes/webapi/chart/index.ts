import { Router } from "express";
import { listChartRouter } from "@routes/webapi/chart/list";
import { showChartRouter } from "@routes/webapi/chart/show";

// webapi/orgs/:orgId/charts

const webApiRouter = Router({ mergeParams: true });

webApiRouter.get("", listChartRouter);
webApiRouter.get("/:id", showChartRouter);

export default webApiRouter