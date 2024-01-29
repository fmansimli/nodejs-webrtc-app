import { Router } from "express";
import * as admin from "../controllers/admin.controller";

const router = Router();

router.post("/sign-jwt", admin.createJwtKey);
router.get("/test", admin.test);

export default router;
