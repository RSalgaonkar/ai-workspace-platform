"use client";

import {
  Hash,
  ShieldCheck
} from "lucide-react";

import ChannelSidebar from "@/components/chat/channel-sidebar";

import ChatView from "@/components/chat/chat-view";

import ActivityFeed from "@/components/collaboration/activity-feed";

import AiAssistantPanel from "@/components/collaboration/ai-assistant-panel";

import AnalyticsPanel from "@/components/collaboration/analytics-panel";

import DocumentPanel from "@/components/collaboration/document-panel";

import NotificationPreferencesPanel from "@/components/collaboration/notification-preferences-panel";

import SearchPanel from "@/components/collaboration/search-panel";

import PresenceIndicators from "@/components/collaboration/presence-indicators";

import NotificationCenter from "@/components/notifications/notification-center";

import WorkspaceSwitcher from "@/components/workspace/workspace-switcher";

import {
  useWorkspaceStore
} from "@/features/workspace/store/workspace.store";

export default function WorkspaceChat() {
  const activeChannelId =
    useWorkspaceStore(
      (state) =>
        state.activeChannelId
    );

  const activeChannelName =
    useWorkspaceStore(
      (state) =>
        state.activeChannelName
    );

  const activeWorkspaceId =
    useWorkspaceStore(
      (state) =>
        state.activeWorkspaceId
    );

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] overflow-hidden rounded-lg border border-slate-200 bg-white">
      <ChannelSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
          <WorkspaceSwitcher />

          <div className="flex items-center gap-3">
            <div
              className="hidden items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 sm:flex"
              aria-label={`Current channel ${activeChannelName ?? "loading"}`}
            >
              <Hash
                size={16}
                aria-hidden="true"
              />
              {activeChannelName ??
                "Loading channel"}
            </div>

            <div className="hidden items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 sm:flex">
              <ShieldCheck
                size={16}
                aria-hidden="true"
              />
              Private team space
            </div>

            <PresenceIndicators
              workspaceId={
                activeWorkspaceId
              }
            />

            <NotificationCenter />
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1">
            {activeChannelId ? (
              <ChatView
                channelId={activeChannelId}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                Preparing your workspace...
              </div>
            )}
          </div>

          <aside
            className="hidden w-80 shrink-0 space-y-4 overflow-y-auto border-l border-slate-200 bg-slate-50 p-4 xl:block"
            aria-label="Workspace intelligence"
          >
            <SearchPanel />
            <AiAssistantPanel
              workspaceId={
                activeWorkspaceId
              }
            />
            <AnalyticsPanel
              workspaceId={
                activeWorkspaceId
              }
            />
            <NotificationPreferencesPanel
              workspaceId={
                activeWorkspaceId
              }
            />
            <DocumentPanel
              workspaceId={
                activeWorkspaceId
              }
            />
            <ActivityFeed
              workspaceId={
                activeWorkspaceId
              }
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
