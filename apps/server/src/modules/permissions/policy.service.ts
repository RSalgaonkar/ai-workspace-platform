import {
  WorkspaceRole
} from "@prisma/client";

import prisma from "../../lib/prisma";

export type PermissionAction =
  | "workspace:read"
  | "workspace:update"
  | "member:invite"
  | "member:manage"
  | "channel:create"
  | "channel:manage"
  | "message:read"
  | "message:create"
  | "message:react"
  | "analytics:read"
  | "ai:use";

const rolePermissions: Record<
  WorkspaceRole,
  PermissionAction[]
> = {
  OWNER: [
    "workspace:read",
    "workspace:update",
    "member:invite",
    "member:manage",
    "channel:create",
    "channel:manage",
    "message:read",
    "message:create",
    "message:react",
    "analytics:read",
    "ai:use"
  ],
  ADMIN: [
    "workspace:read",
    "workspace:update",
    "member:invite",
    "channel:create",
    "channel:manage",
    "message:read",
    "message:create",
    "message:react",
    "analytics:read",
    "ai:use"
  ],
  MEMBER: [
    "workspace:read",
    "message:read",
    "message:create",
    "message:react",
    "ai:use"
  ]
};

const objectToActions = (
  value: unknown
) => {
  if (
    !value ||
    typeof value !== "object"
  )
    return [];

  return Object.entries(
    value as Record<string, unknown>
  )
    .filter(([, enabled]) =>
      Boolean(enabled)
    )
    .map(([action]) =>
      action.replaceAll("_", ":")
    ) as PermissionAction[];
};

export const evaluatePolicy =
  async (input: {
    userId: string;
    workspaceId: string;
    action: PermissionAction;
    channelId?: string;
    attributes?: {
      ownerId?: string;
      isBusinessHours?: boolean;
    };
  }) => {
    const member =
      await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: input.userId,
            workspaceId:
              input.workspaceId
          }
        },
        include: {
          customRole: true
        }
      });

    if (!member) {
      return {
        allowed: false,
        reason: "Not a member"
      };
    }

    const permissions = new Set([
      ...rolePermissions[member.role],
      ...objectToActions(
        member.permissions
      ),
      ...objectToActions(
        member.customRole?.permissions
      )
    ]);

    if (
      input.channelId &&
      input.action.startsWith("message")
    ) {
      const channelPolicy =
        await prisma.channelPermission.findFirst({
          where: {
            channelId: input.channelId,
            OR: [
              {
                role: member.role
              },
              {
                customRoleId:
                  member.customRoleId
              }
            ]
          }
        });

      objectToActions(
        channelPolicy?.permissions
      ).forEach((action) =>
        permissions.add(action)
      );
    }

    const ownerOverride =
      input.attributes?.ownerId ===
      input.userId;

    const allowed =
      ownerOverride ||
      permissions.has(input.action);

    return {
      allowed,
      role: member.role,
      reason: allowed
        ? "Allowed by policy"
        : "Missing permission"
    };
  };

export const assertPolicy =
  async (
    input: Parameters<
      typeof evaluatePolicy
    >[0]
  ) => {
    const result =
      await evaluatePolicy(input);

    if (!result.allowed) {
      throw new Error(result.reason);
    }

    return result;
  };
