import UserModel from "@db/models/User";
import { REFRESH_TOKEN_NAME } from "@lib/constants";
import { AuthenticatedRequest } from "@lib/types";
import { removeCookieToken, throwError, verifyJwtToken } from "@lib/utils";
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

  const validRefreshToken = await UserModel.findOne({
    _id: decoded.sub,
    refreshTokens: { $elemMatch: { $eq: refreshToken } },
  }).select("+refreshTokens");

  if (!validRefreshToken) {
    removeCookieToken(res, REFRESH_TOKEN_NAME);
    return throwError("Access denied. Invalid token provided.", 403);
  }

  (req as AuthenticatedRequest).user = decoded;

  next();
};

export default authenticate;
