import Chat from "../models/Chat.js";

//API Controller for creating a new chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      userName: req.user.name,
    };
    await Chat.create(chatData);
    res.json({ success: true, message: "Chat created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API Controller for getting all chats
export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    res.json({ success: true, chats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API Controller for deleting a chats
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    await Chat.deleteOne({ userId, _id: chatId });

    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
