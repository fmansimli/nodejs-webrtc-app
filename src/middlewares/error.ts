import type { ErrorRequestHandler, RequestHandler } from "express";
import { CustomError } from "../errors/custom-error";

export const catch404: RequestHandler = (req, res, next) => {
  try {
    res.status(404).sendFile("/index.html");
  } catch (error) {
    next(error);
  }
};

export const catchError: ErrorRequestHandler = (err, req, res, _next) => {
  try {
    if (err instanceof CustomError) {
      return res.status(err.httpCode).json(err.serialize());
    }
    res.status(500).json({
      httpCode: 500,
      message: "something went wrong",
      errors: err
    });
  } catch (error) {
    res.status(500).json({
      httpCode: 500,
      message: "unknown error"
    });
  } finally {
    console.log(err);
  }
};
