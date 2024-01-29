import { Router } from "express";

import apiv1 from "./apiv1";
import admin from "./admin";

const router = Router();

router.use("/", apiv1);
router.use("/admin", admin);

export default router;
