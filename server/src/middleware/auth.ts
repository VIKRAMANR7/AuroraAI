import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      res.status(401).json({ success: false, message: "Token expired. Please log in again." });
      return;
    }

    res.status(401).json({ success: false, message: "Invalid or malformed token." });
  }
};
