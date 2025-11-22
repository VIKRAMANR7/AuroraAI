import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { sendError } from "../utils/sendError.js";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "30d" });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.json({ success: false, message: "User already exists" });
      return;
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id.toString());

    res.json({ success: true, token });
  } catch (error) {
    sendError(res, error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.json({ success: false, message: "Invalid credentials" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    sendError(res, error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    sendError(res, error);
  }
};

export const getPublishedImages = async (_req: Request, res: Response) => {
  try {
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
  } catch (error) {
    sendError(res, error);
  }
};
