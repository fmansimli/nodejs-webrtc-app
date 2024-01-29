import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

const router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
  try {
    res.status(200).json({
      env: process.env.NODE_ENV,
      url: req.originalUrl,
      ip: req.ip
    });
  } catch (error) {
    _next(error);
  }
});

export default router;
