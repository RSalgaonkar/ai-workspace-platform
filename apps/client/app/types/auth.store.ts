import { create } from "zustand";

import { User } from "../types/auth.types";

interface AuthState {
  user: User | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  setLoading: (
    loading: boolean
  ) => void;

  setAuth: (
    user: User,
    accessToken: string
  ) => void;

  updateUser: (
    user: Partial<User>
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,

    accessToken: null,

    isAuthenticated: false,

    isLoading: true,

    setLoading: (loading) =>
      set({
        isLoading: loading
      }),

    setAuth: (user, accessToken) => {
      localStorage.setItem(
        "accessToken",
        accessToken
      );

      set({
        user,
        accessToken,
        isAuthenticated: true
      });
    },

    updateUser: (user) =>
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              ...user
            }
          : state.user
      })),

    logout: () => {
      localStorage.removeItem(
        "accessToken"
      );

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false
      });
    }
  }));
