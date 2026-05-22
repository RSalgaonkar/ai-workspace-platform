"use client";

import {
  useEffect,
  useState
} from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import {
  BarChart3
} from "lucide-react";

import {
  getAnalytics
} from "@/features/collaboration/api/collaboration.api";

type Analytics = {
  totals: Record<string, number>;
  activitySeries: Array<{
    date: string;
    activity: number;
    ai: number;
  }>;
  insights: string[];
};

type Props = {
  workspaceId?: string | null;
};

export default function AnalyticsPanel({
  workspaceId
}: Props) {
  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  useEffect(() => {
    if (!workspaceId) return;

    getAnalytics(workspaceId)
      .then((response) =>
        setAnalytics(response.data)
      )
      .catch(() => setAnalytics(null));
  }, [workspaceId]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <BarChart3
          size={17}
          className="text-slate-500"
          aria-hidden="true"
        />
        <h2 className="text-sm font-semibold text-slate-950">
          Analytics
        </h2>
      </div>

      {analytics ? (
        <>
          <div className="mt-4 h-44">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={
                  analytics.activitySeries
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 10
                  }}
                />
                <YAxis
                  tick={{
                    fontSize: 10
                  }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="activity"
                  stroke="#0f172a"
                  fill="#cbd5e1"
                />
                <Area
                  type="monotone"
                  dataKey="ai"
                  stroke="#7c3aed"
                  fill="#ddd6fe"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {Object.entries(
              analytics.totals
            ).map(([key, value]) => (
              <div
                key={key}
                className="rounded-lg bg-slate-50 p-2"
              >
                <p className="text-lg font-bold text-slate-950">
                  {value}
                </p>
                <p className="text-xs capitalize text-slate-500">
                  {key}
                </p>
              </div>
            ))}
          </div>

          <ul className="mt-4 space-y-2">
            {analytics.insights.map(
              (insight) => (
                <li
                  key={insight}
                  className="text-xs leading-5 text-slate-500"
                >
                  {insight}
                </li>
              )
            )}
          </ul>
        </>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          Analytics will appear after workspace activity is recorded.
        </p>
      )}
    </section>
  );
}
