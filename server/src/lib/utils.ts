import bcrypt from "bcryptjs";
import { SALT, SECRET } from "./constants";
import { JWTPayload, ResponsePayload } from "./types";
import { jwtVerify, SignJWT } from "jose";
import { Response } from "express";
import crypto from "crypto";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const createJwtToken = async (payload: JWTPayload, expiry: string) => {
  const accessToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(SECRET);

  return accessToken;
};

export const verifyJwtToken = async (
  token: string
): Promise<JWTPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
};

export const setCookieToken = (
  res: Response,
  name: string,
  token: string,
  maxAge: number
) => {
  res.cookie(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
  });
};

export const removeCookieToken = (res: Response, name: string) => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const throwError = (message: string, status: number = 400): never => {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;

  throw error;
};

export const sendResponse = ({
  res,
  message = "Request successful.",
  status = 200,
  data = null,
}: ResponsePayload) => {
  res.status(status).send({ message, data });
};

export const createVerificationToken = (len: number = 24) => {
  const token = crypto.randomBytes(len).toString("hex");
  return token;
};
