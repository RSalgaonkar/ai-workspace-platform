"use client";

import { useEffect } from "react";

import {
  getCurrentUser
} from "../api/auth.api";

import {
  useAuthStore
} from "@/types/auth.store";

const isTokenExpired = (
  token: string
) => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    ) as {
      exp?: number;
    };

    if (!payload.exp) {
      return true;
    }

    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const useAuthInit =
  () => {
    const setAuth =
      useAuthStore(
        (state) => state.setAuth
      );

    const setLoading =
      useAuthStore(
        (state) =>
          state.setLoading
      );

    const logout =
      useAuthStore(
        (state) => state.logout
      );

    useEffect(() => {
      const initializeAuth =
        async () => {
          try {
            const token =
              localStorage.getItem(
                "accessToken"
              );

            if (!token) {
              setLoading(false);

              return;
            }

            if (isTokenExpired(token)) {
              logout();
              setLoading(false);

              return;
            }

            const response =
              await getCurrentUser();

            setAuth(
              response.data,
              token
            );
          } catch {
            logout();
          } finally {
            setLoading(false);
          }
        };

      initializeAuth();
    }, [logout, setAuth, setLoading]);
  };
