import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "30d" });
};

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });

  if (existing) {
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id.toString());

  res.json({ success: true, token });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id.toString());

  res.json({ success: true, token });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, user: req.user });
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

  res.json({ success: true, images: images.reverse() });
});
