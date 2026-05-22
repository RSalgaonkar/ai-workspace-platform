import {
  NotificationChannel,
  Prisma
} from "@prisma/client";

import prisma from "../../lib/prisma";

export const getPreferences =
  async (
    userId: string,
    workspaceId?: string
  ) => {
    const existing =
      await prisma.notificationPreference.findFirst({
        where: {
          userId,
          workspaceId
        }
      });

    if (existing) return existing;

    return prisma.notificationPreference.create({
      data: {
        userId,
        workspaceId
      }
    });
  };

export const updatePreferences =
  async (
    userId: string,
    data: {
      workspaceId?: string;
      emailEnabled?: boolean;
      pushEnabled?: boolean;
      digestEnabled?: boolean;
      digestFrequency?:
        | "DAILY"
        | "WEEKLY";
      mutedChannels?: Prisma.InputJsonValue;
    }
  ) => {
    const existing =
      await prisma.notificationPreference.findFirst({
        where: {
          userId,
          workspaceId:
            data.workspaceId
        }
      });

    const updateData = {
      emailEnabled:
        data.emailEnabled,
      pushEnabled:
        data.pushEnabled,
      digestEnabled:
        data.digestEnabled,
      digestFrequency:
        data.digestFrequency,
      mutedChannels:
        data.mutedChannels
    };

    if (existing) {
      return prisma.notificationPreference.update({
        where: {
          id: existing.id
        },
        data: updateData
      });
    }

    return prisma.notificationPreference.create({
      data: {
        userId,
        workspaceId:
          data.workspaceId,
        emailEnabled:
          data.emailEnabled ?? true,
        pushEnabled:
          data.pushEnabled ?? false,
        digestEnabled:
          data.digestEnabled ?? true,
        digestFrequency:
          data.digestFrequency ??
          "DAILY",
        mutedChannels:
          data.mutedChannels
      }
    });
  };

export const queueNotification =
  async (data: {
    userId: string;
    workspaceId?: string;
    channels: NotificationChannel[];
    subject: string;
    body: string;
    metadata?: Prisma.InputJsonValue;
  }) => {
  return prisma.notificationDelivery.createMany({
    data: data.channels.map((channel) => ({
      userId: data.userId,
      workspaceId:
        data.workspaceId,
      channel,
      subject: data.subject,
      body: data.body,
      metadata: data.metadata
    }))
  });
};

export const getDigest =
  async (
    userId: string,
    workspaceId?: string
  ) => {
    const since =
      new Date(
        Date.now() -
          1000 * 60 * 60 * 24
      );

    const [
      deliveries,
      activities
    ] = await Promise.all([
      prisma.notificationDelivery.findMany({
        where: {
          userId,
          workspaceId,
          createdAt: {
            gte: since
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 20
      }),
      prisma.activity.findMany({
        where: {
          workspaceId,
          createdAt: {
            gte: since
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 20
      })
    ]);

    return {
      deliveries,
      activities,
      summary: {
        notifications:
          deliveries.length,
        activities:
          activities.length
      }
    };
  };
