import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { api, setAuthToken } from "../api/api";
import { handleError } from "../utils/handleError";

import { AppContext } from "./AppContextValue";
import type { AppContextType } from "../types/context";
import type { UserType } from "../types/user";
import type { ChatType } from "../types/chat";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserType | null>(null);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get("/api/user/data");
      if (data.success) setUser(data.user);
      else toast.error(data.message);
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const fetchUsersChats = useCallback(async () => {
    try {
      const { data } = await api.get("/api/chat/list");
      if (data.success) {
        setChats(data.chats);
        if (data.chats.length === 0) {
          navigate("/");
          await api.post("/api/chat/create");
          const { data: newData } = await api.get("/api/chat/list");
          if (newData.success) setChats(newData.chats);
        }
      } else toast.error(data.message);
    } catch (err) {
      handleError(err);
    }
  }, [navigate]);

  const createNewChat = useCallback(async () => {
    try {
      if (!user) {
        toast("Login to create a new chat");
        return;
      }
      navigate("/");

      await api.post("/api/chat/create");
      await fetchUsersChats();
    } catch (err) {
      handleError(err);
    }
  }, [user, navigate, fetchUsersChats]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) fetchUsersChats();
    else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user, fetchUsersChats]);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchUser();
    } else {
      setUser(null);
      setLoadingUser(false);
      setAuthToken(null);
    }
  }, [token, fetchUser]);

  const value: AppContextType = {
    user,
    chats,
    selectedChat,
    token,
    loadingUser,

    setUser,
    setToken,
    setChats,
    setSelectedChat,

    createNewChat,
    fetchUsersChats,
    fetchUser,

    theme,
    setTheme,
    navigate,
    axios: api,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
