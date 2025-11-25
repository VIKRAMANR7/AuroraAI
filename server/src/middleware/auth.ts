import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

interface JwtPayload {
  id: string;
}

export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header) {
    throw new Error("No token provided");
  }

  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    throw new Error("Invalid or expired token.");
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw new Error("User not found");
  }

  req.user = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    credits: user.credits,
  };

  next();
});
