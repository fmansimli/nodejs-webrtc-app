import type { RequestHandler } from "express";
import { Jwt } from "../services/jwt";

export const createJwtKey: RequestHandler = async (req, res, next) => {
  const { lang, deviceType, deviceName } = req.body;
  try {
    const jwtKey = await Jwt.signKey({ lang, deviceType, deviceName });

    res.status(200).json({ jwt: jwtKey });
  } catch (error) {
    next(error);
  }
};

export const test: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({ test: true });
  } catch (error) {
    next(error);
  }
};
