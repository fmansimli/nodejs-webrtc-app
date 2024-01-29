import { Router } from "express";
import * as admin from "../controllers/admin.controller";

const router = Router();

router.post("/sign-jwt", admin.createJwtKey);

export default router;
