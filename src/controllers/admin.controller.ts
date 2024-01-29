import type { RequestHandler } from "express";
import { Jwt } from "../services/jwt";

export const createJwtKey: RequestHandler = async (req, res, next) => {
  const { username, lang } = req.body;
  try {
    const jwtKey = await Jwt.signAsync({ username, lang });
    res.status(200).json({ jwt: jwtKey });
  } catch (error) {
    next(error);
  }
};
