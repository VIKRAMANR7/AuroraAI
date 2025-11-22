import { UserType } from "./user";
import { ChatType } from "./chat";
import type { AxiosInstance } from "axios";
import type { NavigateFunction } from "react-router-dom";
import type { SetStateAction, Dispatch } from "react";

export interface AppContextType {
  user: UserType | null;
  chats: ChatType[];
  selectedChat: ChatType | null;
  token: string | null;
  theme: string;
  loadingUser: boolean;

  createNewChat: () => Promise<void>;
  fetchUsersChats: () => Promise<void>;
  fetchUser: () => Promise<void>;

  setUser: Dispatch<SetStateAction<UserType | null>>;
  setToken: (t: string | null) => void;
  setChats: Dispatch<SetStateAction<ChatType[]>>;
  setSelectedChat: (chat: ChatType | null) => void;
  setTheme: (t: string) => void;

  axios: AxiosInstance;
  navigate: NavigateFunction;
}
