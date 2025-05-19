import UserModel from "@db/models/User";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_COOKIE_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_NAME,
  VERIFICATION_TOKEN_EXPIRY,
} from "@lib/constants";
import { AuthenticatedRequest, JWTPayload } from "@lib/types";
import {
  comparePassword,
  createJwtToken,
  createVerificationToken,
  hashPassword,
  removeCookieToken,
  sendResponse,
  setCookieToken,
  throwError,
  verifyJwtToken,
} from "@lib/utils";
import { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existing = await UserModel.findOne({ email });
  if (existing)
    return throwError(`An account assocciated with '${email}' already exits.`);

  const hashedPassword = await hashPassword(password);

  const verificationToken = createVerificationToken();
  const verificationTokenExpiry = new Date(
    Date.now() + VERIFICATION_TOKEN_EXPIRY
  );

  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpiry: verificationTokenExpiry,
  });

  // TODO: Send verification email

  const payload = {
    sub: user._id.toString(),
    email: user.email,
    isVerified: false,
  };

  const accessToken = await createJwtToken(payload, ACCESS_TOKEN_EXPIRY);
  const refreshToken = await createJwtToken(payload, REFRESH_TOKEN_EXPIRY);

  user.refreshTokens.push(refreshToken);
  await user.save();

  setCookieToken(
    res,
    REFRESH_TOKEN_NAME,
    refreshToken,
    REFRESH_TOKEN_COOKIE_EXPIRY
  );

  const loggedInUser = await UserModel.findById(user._id);

  sendResponse({
    res,
    message: "Account created.",
    status: 201,
    data: { accessToken, user: loggedInUser },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).select(
    "+password +refreshTokens"
  );
  if (!user) return throwError("Account not found.");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return throwError("Invalid email or password");

  const payload = {
    sub: user._id.toString(),
    email: user.email,
    isVerified: user.isVerified,
  };

  const accessToken = await createJwtToken(payload, ACCESS_TOKEN_EXPIRY);
  const refreshToken = await createJwtToken(payload, REFRESH_TOKEN_EXPIRY);

  user.refreshTokens.push(refreshToken);
  await user.save();

  setCookieToken(
    res,
    REFRESH_TOKEN_NAME,
    refreshToken,
    REFRESH_TOKEN_COOKIE_EXPIRY
  );

  const loggedInUser = await UserModel.findById(user._id);

  sendResponse({
    res,
    message: "Logged in.",
    data: { accessToken, user: loggedInUser },
  });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await UserModel.updateOne(
      { refreshTokens: refreshToken },
      { $pull: { refreshTokens: refreshToken } }
    );
  }

  removeCookieToken(res, ACCESS_TOKEN_NAME);
  removeCookieToken(res, REFRESH_TOKEN_NAME);

  sendResponse({ res, message: "Logged out." });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_NAME];

  if (!refreshToken)
    return throwError("Access denied. No token provided.", 401);

  const decoded = await verifyJwtToken(refreshToken);

  if (!decoded)
    return throwError("Access denied. Invalid or expired token provided.", 403);

  const user = await UserModel.findById(decoded.sub).select("+refreshTokens");
  if (!user) {
    removeCookieToken(res, REFRESH_TOKEN_NAME);

    return throwError("Access denied. Invalid token provided.", 403);
  }

  const payload: JWTPayload = {
    sub: user._id.toString(),
    email: user.email,
  };

  const accessToken = await createJwtToken(payload, ACCESS_TOKEN_EXPIRY);
  const newRefreshToken = await createJwtToken(payload, REFRESH_TOKEN_EXPIRY);

  const newRefreshTokens = [...user.refreshTokens, newRefreshToken].filter(
    (token) => token !== refreshToken
  );

  user.refreshTokens = newRefreshTokens;
  await user.save();

  setCookieToken(
    res,
    REFRESH_TOKEN_NAME,
    newRefreshToken,
    REFRESH_TOKEN_COOKIE_EXPIRY
  );

  sendResponse({ res, data: { accessToken } });
};

export const me = async (req: Request, res: Response) => {
  const userPayload = (req as AuthenticatedRequest).user;

  const user = await UserModel.findById(userPayload.sub);

  sendResponse({ res, data: user });
};

export const resendVerification = async (req: Request, res: Response) => {
  const payloadUser = (req as AuthenticatedRequest).user;
  const userId = payloadUser.sub;

  const user = await UserModel.findById(userId);
  if (!user) return throwError("User not found.", 404);

  if (user.isVerified) return throwError("Account already verified.");

  const newVerificationToken = createVerificationToken();
  const newVerificationTokenExpiry = Date.now() + VERIFICATION_TOKEN_EXPIRY;

  user.verificationToken = newVerificationToken;
  user.verificationTokenExpiry = new Date(newVerificationTokenExpiry);

  await user.save();

  // TODO: send email

  sendResponse({ res, message: `Verification email sent to '${user.email}'.` });
};

export const verifyAccount = async (req: Request, res: Response) => {
  const userPayload = (req as AuthenticatedRequest).user;
  const userId = userPayload.sub;

  const { token: requestToken } = req.body;

  if (!requestToken) return throwError("Verification token is required.");

  const user = await UserModel.findById(userId).select(
    "+verificationToken +verificationTokenExpiry"
  );
  if (!user) return throwError("User not found.", 404);

  const { isVerified, verificationToken, verificationTokenExpiry } = user;

  if (isVerified) return throwError("Account is already verified.", 409);

  if (!verificationToken || !verificationTokenExpiry)
    return throwError("Please request account verfication again.");

  const expiryDate = new Date(verificationTokenExpiry);
  const now = new Date();

  if (now > expiryDate)
    return throwError("Verification token expired. Please request a new one.");

  if (requestToken !== verificationToken)
    return throwError("Invalid verification token.");

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;

  await user.save();

  sendResponse({ res, message: "Account verified." });
};
