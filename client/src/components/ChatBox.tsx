import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContextValue";
import Message from "./Message";
import type { ChatMessage } from "../types/chat";
import { handleError } from "../utils/handleError";

export default function ChatBox() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const theme = localStorage.getItem("theme") || "light";

  const { selectedChat, user, token, setUser, axios } = useAppContext();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"text" | "image">("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Login to send a message");
      return;
    }

    setLoading(true);

    const promptCopy = prompt;
    setPrompt("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: promptCopy,
        timestamp: Date.now(),
        isImage: false,
      },
    ]);

    try {
      const { data } = await axios.post(
        `/api/message/${mode}`,
        {
          chatId: selectedChat?._id,
          prompt: promptCopy,
          isPublished,
        },
        { headers: { Authorization: token ?? "" } }
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);

        setUser((prev) =>
          prev
            ? {
                ...prev,
                credits: prev.credits - (mode === "image" ? 2 : 1),
              }
            : prev
        );
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (err) {
      handleError(err);
      setPrompt(promptCopy);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt=""
              className="w-full max-w-56 sm:max-w-68"
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask me anything.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <Message key={i} message={m} />
        ))}

        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="size-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="size-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Generated Image to Community</p>
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}

      <form
        onSubmit={onSubmit}
        className="bg-primary/20 dark:bg-[#583c79]/30 border border-primary dark:border-[#80609f]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <select
          onChange={(e) => setMode(e.target.value as "text" | "image")}
          value={mode}
          className="text-sm pl-3 pr-2 outline-none"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
          className="flex-1 w-full text-sm outline-none"
          required
        />

        <button disabled={loading}>
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt=""
            className="w-8 cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
}
