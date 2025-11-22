export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isImage: boolean;
  isPublished?: boolean;
}

export interface ChatType {
  _id: string;
  userId: string;
  userName: string;
  name: string;
  messages: ChatMessage[];

  updatedAt: string;
  createdAt: string;
}
