import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export default function Button({
  children,
  className,
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:pointer-events-none disabled:opacity-50",

        variant === "default" &&
          "bg-slate-950 text-white hover:bg-slate-800",

        variant === "outline" &&
          "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950",

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
