import { Request, Response } from "express";
import axios from "axios";
import imageKit from "../configs/imageKit.js";
import openai from "../configs/openai.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const textMessageController = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const { chatId, prompt } = req.body;

  if (user.credits < 1) {
    throw new Error("You don't have enough credits to use this feature");
  }

  const chat = await Chat.findOne({ userId: user._id, _id: chatId });

  if (!chat) {
    throw new Error("Chat not found");
  }

  chat.messages.push({
    role: "user",
    content: prompt,
    timestamp: Date.now(),
    isImage: false,
  });

  const { choices } = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [{ role: "user", content: prompt }],
  });

  const reply = {
    ...choices[0].message,
    timestamp: Date.now(),
    isImage: false,
  };

  chat.messages.push(reply);

  await chat.save();
  await User.updateOne({ _id: user._id }, { $inc: { credits: -1 } });

  res.json({ success: true, reply });
});

export const imageMessageController = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const { prompt, chatId, isPublished } = req.body;

  if (user.credits < 2) {
    throw new Error("You don't have enough credits to use this feature");
  }

  const chat = await Chat.findOne({ userId: user._id, _id: chatId });

  if (!chat) {
    throw new Error("Chat not found");
  }

  chat.messages.push({
    role: "user",
    content: prompt,
    timestamp: Date.now(),
    isImage: false,
  });

  const encodedPrompt = encodeURIComponent(prompt);
  const imageKitUrl = process.env.IMAGEKIT_URL_ENDPOINT;

  const generatedImageUrl = `${imageKitUrl}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

  const aiImageResponse = await axios.get(generatedImageUrl, {
    responseType: "arraybuffer",
  });

  const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString(
    "base64"
  )}`;

  const upload = await imageKit.upload({
    file: base64Image,
    fileName: `${Date.now()}.png`,
    folder: "auroraai",
  });

  const reply = {
    role: "assistant",
    content: upload.url,
    timestamp: Date.now(),
    isImage: true,
    isPublished,
  };

  chat.messages.push(reply);

  await chat.save();
  await User.updateOne({ _id: user._id }, { $inc: { credits: -2 } });

  res.json({ success: true, reply });
});
