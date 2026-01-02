import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function generateToken(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "30d" });
}

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });

  if (existing) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id.toString());

  return res.json({ success: true, token });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = generateToken(user._id.toString());

  return res.json({ success: true, token });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  return res.json({ success: true, user: req.user });
});

export const getPublishedImages = asyncHandler(async (_req: Request, res: Response) => {
  const images = await Chat.aggregate([
    { $unwind: "$messages" },
    {
      $match: {
        "messages.isImage": true,
        "messages.isPublished": true,
      },
    },
    {
      $project: {
        _id: 0,
        imageUrl: "$messages.content",
        userName: "$userName",
      },
    },
  ]);

  return res.json({ success: true, images: images.reverse() });
});
