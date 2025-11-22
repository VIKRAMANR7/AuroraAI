import { Request, Response } from "express";
import Chat from "../models/Chat.js";
import { sendError } from "../utils/sendError.js";

export const createChat = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    await Chat.create({
      userId: user._id,
      userName: user.name,
      name: "New Chat",
      messages: [],
    });

    res.json({ success: true, message: "Chat created successfully" });
  } catch (error) {
    sendError(res, error);
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const chats = await Chat.find({ userId: user._id }).sort({ updatedAt: -1 });

    res.json({ success: true, chats });
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { chatId } = req.body;

    await Chat.deleteOne({ userId: user._id, _id: chatId });

    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    sendError(res, error);
  }
};
