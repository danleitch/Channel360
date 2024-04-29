import { Router } from "express";
import SettingsController  from "@controllers/SettingsController";

const router = Router({ mergeParams: true });
router.use(SettingsController.get);

export { router as getSettingsRouter };
