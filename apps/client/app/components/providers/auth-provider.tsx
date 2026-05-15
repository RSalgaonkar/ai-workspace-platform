"use client";

import { ReactNode } from "react";

import {
  useAuthInit
} from "@/features/auth/hooks/use-auth-init";

type Props = {
  children: ReactNode;
};

export default function AuthProvider({
  children
}: Props) {
  useAuthInit();

  return <>{children}</>;
}