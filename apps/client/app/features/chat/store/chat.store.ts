import { create } from "zustand";

import { Message } from "../types/chat.types";

interface ChatState {
  messages: Message[];

  typingUsers: string[];

  addMessage: (
    message: Message
  ) => void;

  setMessages: (
    messages: Message[]
  ) => void;

  setTypingUsers: (
    users: string[]
  ) => void;
}

export const useChatStore =
  create<ChatState>((set) => ({
    messages: [],

    typingUsers: [],

    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages,
          message
        ]
      })),

    setMessages: (messages) =>
      set({
        messages
      }),

    setTypingUsers: (users) =>
      set({
        typingUsers: users
      })
  }));