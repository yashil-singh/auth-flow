import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(1, "Name is required.")
    .max(50, "Maximun 50 characters for name."),
  email: z
    .string({ required_error: "Email address is required." })
    .min(1, "Email address is required.")
    .email("Invalid email address."),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be atleast 8 characters long.")
    .max(100, "Maximum 100 characters for password.")
    .regex(/[a-z]/, "Password must contain atleast one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain atleast one uppercase letter.")
    .regex(/\d/, "Password must contain atleast one number.")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain atleast one special character."
    ),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email address is required." })
    .min(1, "Email address is required.")
    .email("Invalid email address."),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be atleast 8 characters long.")
    .max(100, "Maximum 100 characters for password.")
    .regex(/[a-z]/, "Password must contain atleast one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain atleast one uppercase letter.")
    .regex(/\d/, "Password must contain atleast one number.")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain atleast one special character."
    ),
});
