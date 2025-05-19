import type { BaseResponse } from "../../lib/types";
import { GET, PATCH, POST } from "../api";
import type {
  LoginFormValues,
  LoginResponse,
  MeResponse,
  RefreshResponse,
  SignupFormValues,
  SignupResponse,
  VerifyAccountFormValues,
} from "./types";

const BASE = "/auth";

export const login = async (
  values: LoginFormValues
): Promise<LoginResponse> => {
  const response = await POST(`${BASE}/login`, values);
  return response;
};

export const signup = async (
  values: SignupFormValues
): Promise<SignupResponse> => {
  const response = await POST(`${BASE}/signup`, values);
  return response;
};

export const logout = async (): Promise<BaseResponse> => {
  const response = await POST(`${BASE}/logout`);
  return response;
};

export const resendVerification = async (): Promise<BaseResponse> => {
  const response = await GET(`${BASE}/resend-verification`);
  return response;
};

export const verifyAccount = async (
  values: VerifyAccountFormValues
): Promise<BaseResponse> => {
  const response = await PATCH(`${BASE}/verify`, values);
  return response;
};

export const refresh = async (): Promise<RefreshResponse> => {
  const response = await POST(`${BASE}/refresh`);
  return response;
};

export const me = async (): Promise<MeResponse> => {
  const response = await GET(`${BASE}/me`);
  return response;
};
