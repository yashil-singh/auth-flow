import {
  login,
  logout,
  me,
  refresh,
  resendVerification,
  signup,
  verifyAccount,
} from "@controllers/authController";
import { loginSchema, signupSchema } from "@lib/schemas/authSchemas";
import express from "express";
import authenticate from "middlewares/authenticate";
import validateData from "middlewares/validateData";

const router = express.Router();

router.post("/signup", validateData(signupSchema), signup);
router.post("/login", validateData(loginSchema), login);
router.post("/logout", logout);

router.get("/me", authenticate, me);
router.get("/refresh", refresh);
router.get("/resend-verification", authenticate, resendVerification);

router.patch("/verify", authenticate, verifyAccount);

export default router;
