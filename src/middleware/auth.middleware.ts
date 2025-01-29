import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../interfaces/auth.interface";
import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token: string | undefined = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }

  try {
    const user: IUser | null = await userService.profile(token);
    if (!user?.data) {
      return res.status(401).json({ message: "UNAUTHORIZED" });
    }
    (req as RequestWithUser).user = { ...user.data, token };
    next();
  } catch (error) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }
};
