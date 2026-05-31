"use client";

import {
  useEffect,
  useState
} from "react";

import {
  Activity,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

import Card from "@/components/ui/card";

import api from "@/lib/axios";

type HealthState =
  | "checking"
  | "online"
  | "offline";

export default function SystemHealthCard() {
  const [status, setStatus] =
    useState<HealthState>("checking");
  const [latency, setLatency] =
    useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkHealth = async () => {
      const startedAt =
        performance.now();

      try {
        await api.get("/health");

        if (!isMounted) return;

        setStatus("online");
        setLatency(
          Math.round(
            performance.now() -
              startedAt
          )
        );
      } catch {
        if (!isMounted) return;

        setStatus("offline");
        setLatency(null);
      }
    };

    checkHealth();

    const interval =
      window.setInterval(
        checkHealth,
        60000
      );

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const isOnline = status === "online";
  const isChecking =
    status === "checking";
  const Icon = isOnline
    ? CheckCircle2
    : isChecking
      ? Activity
      : AlertCircle;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            API health
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">
            {isChecking
              ? "Checking"
              : isOnline
                ? "Operational"
                : "Needs attention"}
          </h2>
        </div>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            isOnline
              ? "bg-emerald-100 text-emerald-700"
              : isChecking
                ? "bg-slate-100 text-slate-600"
                : "bg-rose-100 text-rose-700"
          }`}
        >
          <Icon
            size={19}
            aria-hidden="true"
          />
        </span>
      </div>

      <div
        className="rounded-lg bg-slate-50 p-3"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-semibold text-slate-800">
          {isOnline
            ? `${latency ?? 0} ms response`
            : isChecking
              ? "Pinging /api/health"
              : "Backend unavailable"}
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Health checks help demonstrate production observability and deployment readiness.
        </p>
      </div>
    </Card>
  );
}
