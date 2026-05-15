import api from "@/lib/axios";

import {
  AuthResponse
} from "@/types/auth.types";

export const registerUser = async (
  data: {
    name: string;
    email: string;
    password: string;
  }
) => {
  const response =
    await api.post<AuthResponse>(
      "/auth/register",
      data
    );

  return response.data;
};

export const loginUser = async (
  data: {
    email: string;
    password: string;
  }
) => {
  const response =
    await api.post<AuthResponse>(
      "/auth/login",
      data
    );

  return response.data;
};

export const refreshToken =
  async () => {
    const response =
      await api.post(
        "/auth/refresh"
      );

    return response.data;
  };

export const getCurrentUser =
  async () => {
    const response =
      await api.get("/auth/me");

    return response.data;
  };

export const logoutUser =
  async () => {
    const response =
      await api.post(
        "/auth/logout"
      );

    return response.data;
  };
