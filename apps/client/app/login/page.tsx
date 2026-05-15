"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { loginSchema } from "@/features/auth/utils/auth.schema";

import { loginUser } from "@/features/auth/api/auth.api";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/types/auth.store";

type FormData = z.infer<
  typeof loginSchema
>;

export default function LoginPage() {
  const router = useRouter();

  const setAuth =
    useAuthStore(
      (state) => state.setAuth
    );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (
    data: FormData
  ) => {
    try {
      const response =
        await loginUser(data);

      setAuth(
        response.data.user,
        response.data.accessToken
      );

      toast.success("Login successful");

      router.push("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 border p-6 rounded-xl"
      >
        <h1 className="text-2xl font-bold">
          Login
        </h1>

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full border p-3 rounded-lg"
          />

          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full border p-3 rounded-lg"
          />

          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white p-3 rounded-lg"
        >
          {isSubmitting
            ? "Loading..."
            : "Login"}
        </button>
      </form>
    </main>
  );
}
