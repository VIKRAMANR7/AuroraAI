import express from "express";
import { createChat, deleteChat, getChats } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const chatRouter = express.Router();

chatRouter.post("/create", protect, createChat);
chatRouter.get("/list", protect, getChats);
chatRouter.post("/delete", protect, deleteChat);

export default chatRouter;
