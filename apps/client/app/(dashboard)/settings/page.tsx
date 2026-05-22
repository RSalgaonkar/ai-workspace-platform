import WorkspaceSettingsPanel from "@/components/workspace/workspace-settings-panel";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Workspace control center
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Manage workspace identity, invitations, members, permissions, tenant settings, and analytics.
        </p>
      </div>

      <WorkspaceSettingsPanel />
    </section>
  );
}
