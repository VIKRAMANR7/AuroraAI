import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { api, setAuthToken } from "../api/api";
import { handleError } from "../utils/handleError";

import { AppContext } from "./AppContextValue";

import type { AppContextType } from "../types/context";
import type { UserType } from "../types/user";
import type { ChatType } from "../types/chat";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserType | null>(null);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      setAuthToken(null);
      return;
    }

    setAuthToken(token);

    async function fetchUserData() {
      try {
        const { data } = await api.get("/api/user/data");
        if (data.success) {
          setUser(data.user);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUserData();
  }, [token]);

  useEffect(() => {
    if (!user) {
      setChats([]);
      setSelectedChat(null);
      return;
    }

    async function fetchChats() {
      try {
        const { data } = await api.get("/api/chat/list");

        if (!data.success) {
          toast.error(data.message);
          return;
        }

        if (data.chats.length === 0) {
          navigate("/");
          await api.post("/api/chat/create");
          const { data: newData } = await api.get("/api/chat/list");
          if (newData.success) {
            setChats(newData.chats);
          }
        } else {
          setChats(data.chats);
        }
      } catch (err) {
        handleError(err);
      }
    }

    fetchChats();
  }, [user, navigate]);

  async function createNewChat() {
    try {
      if (!user) {
        toast("Login to create a new chat");
        return;
      }

      navigate("/");
      await api.post("/api/chat/create");

      const { data } = await api.get("/api/chat/list");
      if (data.success) {
        setChats(data.chats);
      }
    } catch (err) {
      handleError(err);
    }
  }

  async function fetchUsersChats() {
    try {
      const { data } = await api.get("/api/chat/list");
      if (data.success) {
        setChats(data.chats);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      handleError(err);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await api.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      handleError(err);
    }
  }

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
}
