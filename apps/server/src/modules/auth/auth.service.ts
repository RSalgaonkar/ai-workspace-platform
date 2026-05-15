import bcrypt from "bcrypt";
import prisma from "../../lib/prisma";
import {
  generateAccessToken,
  generateRefreshToken
} from "../../utils/jwt";

import {
  LoginInput,
  RegisterInput
} from "./auth.validation";
import { verifyToken } from "../../utils/jwt";

export const registerUser = async (
  data: RegisterInput
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    10
  );

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword
    }
  });

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    role: user.role
  });

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      refreshToken
    }
  });

  return {
    user,
    accessToken,
    refreshToken
  };
};

export const loginUser = async (
  data: LoginInput
) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    role: user.role
  });

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      refreshToken
    }
  });

  return {
    user,
    accessToken,
    refreshToken
  };
};

export const getCurrentUser = async (
  userId: string
) => {
  return prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });
};

export const refreshAccessToken =
  async (refreshToken: string) => {
    const decoded = verifyToken(
      refreshToken
    ) as {
      userId: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      }
    });

    if (
      !user ||
      user.refreshToken !== refreshToken
    ) {
      throw new Error(
        "Invalid refresh token"
      );
    }

    const newAccessToken =
      generateAccessToken({
        userId: user.id,
        role: user.role
      });

    const newRefreshToken =
      generateRefreshToken({
        userId: user.id,
        role: user.role
      });

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        refreshToken: newRefreshToken
      }
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  };

export const logoutUser = async (
  userId: string
) => {
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      refreshToken: null
    }
  });
};