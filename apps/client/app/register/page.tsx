"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { registerSchema } from "@/features/auth/utils/auth.schema";

import { registerUser } from "@/features/auth/api/auth.api";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/types/auth.store";

type FormData = z.infer<
  typeof registerSchema
>;

export default function RegisterPage() {
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
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (
    data: FormData
  ) => {
    try {
      const response =
        await registerUser(data);

      setAuth(
        response.data.user,
        response.data.accessToken
      );

      toast.success(
        "Account created successfully"
      );

      router.push("/dashboard");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 border p-6 rounded-xl"
      >
        <h1 className="text-2xl font-bold">
          Register
        </h1>

        <div>
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="w-full border p-3 rounded-lg"
          />

          {errors.name && (
            <p className="text-red-500 text-sm">
              {errors.name.message}
            </p>
          )}
        </div>

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
            : "Create Account"}
        </button>
      </form>
    </main>
  );
}
