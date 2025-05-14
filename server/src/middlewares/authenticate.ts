import { REFRESH_TOKEN_NAME } from "@lib/constants";
import { AuthenticatedRequest } from "@lib/types";
import { throwError, verifyJwtToken } from "@lib/utils";
import { NextFunction, Request, Response } from "express";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  const refreshToken = req.cookies[REFRESH_TOKEN_NAME];
  if (!refreshToken)
    return throwError("Access denied. No token provided.", 401);

  const accessToken = authHeader?.split(" ")[1];
  if (!accessToken) return throwError("Access denied. No token provided.", 403);

  let decoded = await verifyJwtToken(accessToken);

  if (!decoded)
    return throwError("Access denied. Invalid or expired token provided.", 403);

  (req as AuthenticatedRequest).user = decoded;

  next();
};

export default authenticate;
