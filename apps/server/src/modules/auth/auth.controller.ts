import { Request, Response } from "express";

import {
  loginSchema,
  registerSchema
} from "./auth.validation";

import {
  loginUser,
  registerUser
} from "./auth.service";

import {
  refreshAccessToken,
  logoutUser,
  getCurrentUser
} from "./auth.service";

import {
  AuthRequest
} from "../../middleware/auth.middleware";
import {
  refreshTokenCookieOptions
} from "../../utils/cookie";

const {
  maxAge: _maxAge,
  ...clearRefreshTokenCookieOptions
} = refreshTokenCookieOptions;

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(
      req.body
    );

    const result = await registerUser(validatedData);

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshTokenCookieOptions
    );

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(
      req.body
    );

    const result = await loginUser(validatedData);

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshTokenCookieOptions
    );

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    });
  }
};

export const refresh = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken =
      req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false
      });

      return;
    }

    const result =
      await refreshAccessToken(
        refreshToken
      );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshTokenCookieOptions
    );

    res.status(200).json({
      success: true,
      data: {
        accessToken:
          result.accessToken
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message:
        "Invalid refresh token"
    });
  }
};

export const currentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await getCurrentUser(
      req.user!.userId
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    await logoutUser(
      req.user!.userId
    );

    res.clearCookie(
      "refreshToken",
      clearRefreshTokenCookieOptions
    );

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
};
