import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

const validateData = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error!.flatten().fieldErrors;
      res.status(400).json({ message: "Validation Error", errors });
    }

    req.body = result.data;

    next();
  };
};

export default validateData;
