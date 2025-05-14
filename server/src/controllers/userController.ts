import UserModel from "@db/models/User";
import { sendResponse } from "@lib/utils";
import { Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find();
  sendResponse({ res, data: users });
};
