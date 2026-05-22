import crypto from "crypto";

import slugify from "slugify";

import {
  Prisma,
  WorkspaceRole
} from "@prisma/client";

import prisma from "../../lib/prisma";

import {
  recordActivity
} from "../activity/activity.service";

const palette = [
  "#0f172a",
  "#2563eb",
  "#059669",
  "#7c3aed",
  "#dc2626",
  "#d97706"
];

const createUniqueSlug = async (
  name: string
) => {
  const base =
    slugify(name, {
      lower: true,
      strict: true
    }) || "workspace";

  let slug = base;
  let index = 1;

  while (
    await prisma.workspace.findUnique({
      where: {
        slug
      }
    })
  ) {
    index += 1;
    slug = `${base}-${index}`;
  }

  return slug;
};

const assertMembership = async (
  workspaceId: string,
  userId: string,
  allowedRoles: WorkspaceRole[] = [
    "OWNER",
    "ADMIN",
    "MEMBER"
  ]
) => {
  const member =
    await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId
        }
      }
    });

  if (
    !member ||
    !allowedRoles.includes(member.role)
  ) {
    throw new Error(
      "Workspace access denied"
    );
  }

  return member;
};

export const createWorkspace =
  async (
    userId: string,
    data: {
      name: string;
      description?: string;
    }
  ) => {
    const slug =
      await createUniqueSlug(data.name);

    const workspace =
      await prisma.workspace.create({
        data: {
          name: data.name,
          description:
            data.description,
          slug,
          avatarColor:
            palette[
              Math.floor(
                Math.random() *
                  palette.length
              )
            ],
          settings: {
            visibility: "private",
            defaultRole: "MEMBER",
            messageRetentionDays: 365
          },
          ownerId: userId,
          members: {
            create: {
              userId,
              role: "OWNER",
              permissions: {
                manageWorkspace: true,
                manageMembers: true,
                manageChannels: true,
                inviteMembers: true
              }
            }
          },
          channels: {
            create: {
              name: "general",
              description:
                "Team-wide updates and decisions",
              position: 0
            }
          }
        },
        include: workspaceInclude
      });

    await recordActivity({
      type: "WORKSPACE_UPDATED",
      title: `Created ${workspace.name}`,
      actorId: userId,
      workspaceId: workspace.id
    });

    return workspace;
  };

const workspaceInclude = {
  members: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  },
  channels: {
    orderBy: {
      position: "asc" as const
    }
  },
  invites: {
    orderBy: {
      createdAt: "desc" as const
    }
  }
};

export const getUserWorkspaces =
  async (userId: string) => {
    return prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      },
      include: workspaceInclude,
      orderBy: {
        updatedAt: "desc"
      }
    });
  };

export const getWorkspace =
  async (
    workspaceId: string,
    userId: string
  ) => {
    await assertMembership(
      workspaceId,
      userId
    );

    return prisma.workspace.findUnique({
      where: {
        id: workspaceId
      },
      include: workspaceInclude
    });
  };

export const updateWorkspaceSettings =
  async (
    workspaceId: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      avatarColor?: string;
      settings?: Prisma.InputJsonValue;
    }
  ) => {
    await assertMembership(
      workspaceId,
      userId,
      ["OWNER", "ADMIN"]
    );

    const workspace =
      await prisma.workspace.update({
        where: {
          id: workspaceId
        },
        data,
        include: workspaceInclude
      });

    await recordActivity({
      type: "WORKSPACE_UPDATED",
      title: `Updated ${workspace.name}`,
      actorId: userId,
      workspaceId
    });

    return workspace;
  };

export const createChannel =
  async (
    workspaceId: string,
    userId: string,
    data: {
      name: string;
      description?: string;
    }
  ) => {
    await assertMembership(
      workspaceId,
      userId,
      ["OWNER", "ADMIN"]
    );

    const count =
      await prisma.channel.count({
        where: {
          workspaceId
        }
      });

    const channel =
      await prisma.channel.create({
        data: {
          workspaceId,
          name: slugify(data.name, {
            lower: true,
            strict: true
          }),
          description:
            data.description,
          position: count
        }
      });

    await recordActivity({
      type: "WORKSPACE_UPDATED",
      title: `Created #${channel.name}`,
      actorId: userId,
      workspaceId
    });

    return channel;
  };

export const reorderChannels =
  async (
    workspaceId: string,
    userId: string,
    channelIds: string[]
  ) => {
    await assertMembership(
      workspaceId,
      userId,
      ["OWNER", "ADMIN"]
    );

    await prisma.$transaction(
      channelIds.map((id, position) =>
        prisma.channel.update({
          where: {
            id
          },
          data: {
            position
          }
        })
      )
    );

    return prisma.channel.findMany({
      where: {
        workspaceId
      },
      orderBy: {
        position: "asc"
      }
    });
  };

export const inviteMember =
  async (
    workspaceId: string,
    userId: string,
    data: {
      email: string;
      role?: WorkspaceRole;
    }
  ) => {
    await assertMembership(
      workspaceId,
      userId,
      ["OWNER", "ADMIN"]
    );

    const invite =
      await prisma.invite.create({
        data: {
          workspaceId,
          email: data.email,
          role: data.role ?? "MEMBER",
          token:
            crypto.randomUUID(),
          expiresAt:
            new Date(
              Date.now() +
                1000 *
                  60 *
                  60 *
                  24 *
                  7
            )
        }
      });

    await recordActivity({
      type: "WORKSPACE_UPDATED",
      title: `Invited ${data.email}`,
      actorId: userId,
      workspaceId
    });

    return invite;
  };

export const updateMemberRole =
  async (
    workspaceId: string,
    userId: string,
    memberId: string,
    role: WorkspaceRole
  ) => {
    await assertMembership(
      workspaceId,
      userId,
      ["OWNER", "ADMIN"]
    );

    return prisma.workspaceMember.update({
      where: {
        id: memberId
      },
      data: {
        role
      },
      include: {
        user: true
      }
    });
  };

export const getWorkspaceAnalytics =
  async (
    workspaceId: string,
    userId: string
  ) => {
    await assertMembership(
      workspaceId,
      userId
    );

    const [
      members,
      channels,
      messages,
      files,
      documents,
      invites
    ] = await Promise.all([
      prisma.workspaceMember.count({
        where: {
          workspaceId
        }
      }),
      prisma.channel.count({
        where: {
          workspaceId
        }
      }),
      prisma.message.count({
        where: {
          channel: {
            workspaceId
          }
        }
      }),
      prisma.fileAsset.count({
        where: {
          workspaceId
        }
      }),
      prisma.collaborativeDocument.count({
        where: {
          workspaceId
        }
      }),
      prisma.invite.count({
        where: {
          workspaceId,
          status: "PENDING"
        }
      })
    ]);

    return {
      members,
      channels,
      messages,
      files,
      documents,
      pendingInvites: invites
    };
  };
