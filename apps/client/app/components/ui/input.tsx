import { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export default function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-900",
        className
      )}
      {...props}
    />
  );
}
