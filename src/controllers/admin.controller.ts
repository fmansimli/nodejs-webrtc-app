import type { RequestHandler } from "express";
import { Jwt } from "../services/jwt";

export const createJwtKey: RequestHandler = async (req, res, next) => {
  const { username, lang } = req.body;
  try {
    const jwtKey = await Jwt.signKey({ username, lang });

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
