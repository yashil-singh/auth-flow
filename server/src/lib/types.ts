import { Request, Response } from "express";

export type JWTPayload = {
  sub: string;
  email: string;
};

export type ResponsePayload = {
  res: Response;
  status?: number;
  message?: string;
  data?: any;
};

export interface AuthenticatedRequest extends Request {
  user: JWTPayload;
}
