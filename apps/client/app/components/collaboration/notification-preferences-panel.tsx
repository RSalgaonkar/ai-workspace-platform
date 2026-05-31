"use client";

import {
  useState
} from "react";

import {
  Bell
} from "lucide-react";

import {
  getNotificationDigest,
  updateNotificationPreferences
} from "@/features/collaboration/api/collaboration.api";

type Props = {
  workspaceId?: string | null;
};

export default function NotificationPreferencesPanel({
  workspaceId
}: Props) {
  const [digestCount, setDigestCount] =
    useState<number | null>(null);

  const save = async (
    key:
      | "emailEnabled"
      | "pushEnabled"
      | "digestEnabled",
    value: boolean
  ) => {
    await updateNotificationPreferences({
      workspaceId,
      [key]: value
    });
  };

  const loadDigest = async () => {
    const response =
      await getNotificationDigest(
        workspaceId
      );
    setDigestCount(
      response.data.summary.activities
    );
  };

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-4"
      aria-labelledby="notification-preferences-title"
    >
      <div className="flex items-center gap-2">
        <Bell
          size={17}
          className="text-slate-500"
          aria-hidden="true"
        />
        <h2
          id="notification-preferences-title"
          className="text-sm font-semibold text-slate-950"
        >
          Notifications
        </h2>
      </div>

      <fieldset className="mt-4 space-y-3">
        <legend className="sr-only">
          Notification delivery channels
        </legend>
        {[
          ["emailEnabled", "Email"],
          ["pushEnabled", "Push"],
          ["digestEnabled", "Digest"]
        ].map(([key, label]) => (
          <label
            key={key}
            className="flex items-center justify-between text-sm text-slate-600"
          >
            {label}
            <input
              type="checkbox"
              defaultChecked={
                key !== "pushEnabled"
              }
              onChange={(event) =>
                save(
                  key as
                    | "emailEnabled"
                    | "pushEnabled"
                    | "digestEnabled",
                  event.target.checked
                )
              }
              className="h-4 w-4 rounded border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            />
          </label>
        ))}
      </fieldset>

      <button
        type="button"
        onClick={loadDigest}
        className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
      >
        Preview digest
      </button>

      {digestCount !== null && (
        <p
          className="mt-3 text-xs text-slate-500"
          aria-live="polite"
        >
          Digest includes {digestCount} recent activities.
        </p>
      )}
    </section>
  );
}
