import { sendResponse } from "@lib/utils";
import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = err.status || 500;
  let message = err.message || "Internal server error. Try again later.";

  if (err.name === "ValidationError") {
    status = 400;
    message = "There were some validation errors.";
  }

  sendResponse({ res, status, message, success: false });
};

export default errorHandler;
