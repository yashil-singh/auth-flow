import type { z } from "zod";
import type { BaseResponse, Timestamps } from "../../lib/types";
import type {
  loginFormSchema,
  signupFormSchema,
  verifyAccountSchema,
} from "../../lib/schemas/authSchemas";

export interface User extends Timestamps {
  _id: string;
  name: string;
  email: string;
  isVerified: string;
}

// Form Value Types
export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type VerifyAccountFormValues = z.infer<typeof verifyAccountSchema>;

// Response Types
export interface LoginResponse extends BaseResponse {
  data: { user: User; accessToken: string };
}

export interface SignupResponse extends BaseResponse {
  data: { user: User; accessToken: string };
}

export interface RefreshResponse extends BaseResponse {
  data: { accessToken: string };
}

export interface MeResponse extends BaseResponse {
  data: User;
}
