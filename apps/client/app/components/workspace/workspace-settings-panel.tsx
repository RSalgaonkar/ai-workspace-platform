"use client";

import {
  useEffect,
  useState
} from "react";

import {
  BarChart3,
  MailPlus,
  Save,
  Shield
} from "lucide-react";

import Card from "@/components/ui/card";

import {
  getWorkspaceAnalytics,
  inviteMember,
  updateMemberRole,
  updateWorkspace
} from "@/features/workspace/api/workspace.api";

import {
  useWorkspaceStore
} from "@/features/workspace/store/workspace.store";

const colors = [
  "#0f172a",
  "#2563eb",
  "#059669",
  "#7c3aed",
  "#dc2626",
  "#d97706"
];

type Analytics = {
  members: number;
  channels: number;
  messages: number;
  files: number;
  documents: number;
  pendingInvites: number;
};

export default function WorkspaceSettingsPanel() {
  const activeWorkspace =
    useWorkspaceStore(
      (state) =>
        state.activeWorkspace
    );
  const setWorkspace =
    useWorkspaceStore(
      (state) =>
        state.setWorkspace
    );
  const members =
    useWorkspaceStore(
      (state) => state.members
    );
  const invites =
    useWorkspaceStore(
      (state) => state.invites
    );

  const [name, setName] =
    useState("");
  const [description, setDescription] =
    useState("");
  const [avatarColor, setAvatarColor] =
    useState("#0f172a");
  const [inviteEmail, setInviteEmail] =
    useState("");
  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  useEffect(() => {
    if (!activeWorkspace) return;

    const timeout =
      window.setTimeout(() => {
        setName(activeWorkspace.name);
        setDescription(
          activeWorkspace.description ?? ""
        );
        setAvatarColor(
          activeWorkspace.avatarColor ??
            "#0f172a"
        );
      }, 0);

    getWorkspaceAnalytics(
      activeWorkspace.id
    )
      .then((response) =>
        setAnalytics(response.data)
      )
      .catch(() => setAnalytics(null));

    return () =>
      window.clearTimeout(timeout);
  }, [activeWorkspace]);

  if (!activeWorkspace) {
    return (
      <Card>
        <p className="text-sm text-slate-500">
          Select a workspace to manage settings.
        </p>
      </Card>
    );
  }

  const saveSettings = async () => {
    const response =
      await updateWorkspace(
        activeWorkspace.id,
        {
          name,
          description,
          avatarColor,
          settings: {
            visibility: "private",
            defaultRole: "MEMBER",
            messageRetentionDays: 365
          }
        }
      );

    setWorkspace(response.data);
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return;

    await inviteMember(
      activeWorkspace.id,
      {
        email: inviteEmail,
        role: "MEMBER"
      }
    );

    setInviteEmail("");
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <Card>
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold text-white"
              style={{
                backgroundColor:
                  avatarColor
              }}
            >
              {name
                .slice(0, 1)
                .toUpperCase()}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Workspace profile
              </h2>
              <p className="text-sm text-slate-500">
                Name, description, avatar, and tenant defaults.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="text-sm font-medium text-slate-700">
              Workspace name
              <input
                id="workspace-settings-name"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:ring-2 focus:ring-slate-900"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Description
              <textarea
                id="workspace-settings-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                className="mt-2 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:ring-2 focus:ring-slate-900"
              />
            </label>

            <fieldset>
              <legend className="text-sm font-medium text-slate-700">
                Avatar color
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setAvatarColor(color)
                    }
                    className={`h-8 w-8 rounded-lg border-2 ${
                      avatarColor === color
                        ? "border-slate-950"
                        : "border-white"
                    }`}
                    style={{
                      backgroundColor: color
                    }}
                    aria-label={`Use ${color} avatar color`}
                    aria-pressed={
                      avatarColor === color
                    }
                  />
                ))}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={saveSettings}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              <Save size={16} />
              Save settings
            </button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <Shield
              size={18}
              className="text-slate-500"
            />
            <h2 className="text-lg font-semibold text-slate-950">
              Members and permissions
            </h2>
          </div>

          <div className="mt-4 space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {member.user.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {member.user.email}
                  </p>
                </div>

                <label
                  className="sr-only"
                  htmlFor={`member-role-${member.id}`}
                >
                  Role for {member.user.name}
                </label>
                <select
                  id={`member-role-${member.id}`}
                  value={member.role}
                  onChange={(event) =>
                    updateMemberRole(
                      activeWorkspace.id,
                      member.id,
                      event.target.value as
                        | "OWNER"
                        | "ADMIN"
                        | "MEMBER"
                    )
                  }
                  className="rounded-lg border border-slate-300 px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  <option value="OWNER">
                    Owner
                  </option>
                  <option value="ADMIN">
                    Admin
                  </option>
                  <option value="MEMBER">
                    Member
                  </option>
                </select>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <div className="flex items-center gap-2">
            <MailPlus
              size={18}
              className="text-slate-500"
            />
            <h2 className="text-lg font-semibold text-slate-950">
              Invitations
            </h2>
          </div>

          <div className="mt-4 flex gap-2">
            <label
              htmlFor="workspace-invite-email"
              className="sr-only"
            >
              Teammate email address
            </label>
            <input
              id="workspace-invite-email"
              type="email"
              value={inviteEmail}
              onChange={(event) =>
                setInviteEmail(
                  event.target.value
                )
              }
              placeholder="teammate@example.com"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button
              type="button"
              onClick={sendInvite}
              className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              Invite
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {invites.length === 0 ? (
              <p className="text-sm text-slate-500">
                Pending invitations will appear here.
              </p>
            ) : (
              invites.map((invite) => (
                <div
                  key={invite.id}
                  className="rounded-lg bg-slate-50 p-3"
                >
                  <p className="text-sm font-medium text-slate-800">
                    {invite.email}
                  </p>
                  <p className="text-xs text-slate-500">
                    {invite.status} - {invite.role}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <BarChart3
              size={18}
              className="text-slate-500"
            />
            <h2 className="text-lg font-semibold text-slate-950">
              Analytics
            </h2>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3">
            {Object.entries(
              analytics ?? {}
            ).map(([key, value]) => (
              <div
                key={key}
                className="rounded-lg bg-slate-50 p-3"
              >
                <dt className="text-xl font-bold text-slate-950">
                  {value}
                </dt>
                <dd className="text-xs capitalize text-slate-500">
                  {key.replace(
                    /([A-Z])/g,
                    " $1"
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}
