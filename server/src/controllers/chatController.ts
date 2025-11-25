import { Request, Response } from "express";
import Chat from "../models/Chat.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createChat = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;

  await Chat.create({
    userId: user._id,
    userName: user.name,
    name: "New Chat",
    messages: [],
  });

  res.json({ success: true, message: "Chat created successfully" });
});

export const getChats = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const chats = await Chat.find({ userId: user._id }).sort({ updatedAt: -1 });

  res.json({ success: true, chats });
});

export const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const { chatId } = req.body;

  await Chat.deleteOne({ userId: user._id, _id: chatId });

  res.json({ success: true, message: "Chat deleted successfully" });
});
