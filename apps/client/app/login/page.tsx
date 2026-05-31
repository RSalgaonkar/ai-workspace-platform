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
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-slate-100 p-4 text-slate-950"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        noValidate
        aria-labelledby="login-title"
      >
        <h1
          id="login-title"
          className="text-2xl font-bold"
        >
          Login
        </h1>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-900"
            aria-invalid={
              Boolean(errors.email)
            }
            aria-describedby={
              errors.email
                ? "email-error"
                : undefined
            }
          />

          {errors.email && (
            <p
              id="email-error"
              className="mt-2 text-sm text-red-600"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-900"
            aria-invalid={
              Boolean(errors.password)
            }
            aria-describedby={
              errors.password
                ? "password-error"
                : undefined
            }
          />

          {errors.password && (
            <p
              id="password-error"
              className="mt-2 text-sm text-red-600"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-950 p-3 font-medium text-white transition hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50"
          aria-busy={isSubmitting}
        >
          {isSubmitting
            ? "Loading..."
            : "Login"}
        </button>
      </form>
    </main>
  );
}
