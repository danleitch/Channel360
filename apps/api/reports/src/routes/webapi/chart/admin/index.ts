import { Router } from "express";
import { createChartRouter } from "@routes/webapi/chart/admin/new";
import { deleteChartRouter } from "@routes/webapi/chart/admin/delete";
import { updateChartRouter } from "@routes/webapi/chart/admin/update";

// webapi/admin/charts

const webApiAdminRouter = Router({ mergeParams: true });

webApiAdminRouter.post("", createChartRouter);
webApiAdminRouter.put("/:id", updateChartRouter);
webApiAdminRouter.delete("/:id", deleteChartRouter);

export default webApiAdminRouter