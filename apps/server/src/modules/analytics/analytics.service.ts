import prisma from "../../lib/prisma";

const lastNDays = (days: number) =>
  Array.from({
    length: days
  }).map((_, index) => {
    const date = new Date();
    date.setDate(
      date.getDate() -
        (days - index - 1)
    );
    date.setHours(0, 0, 0, 0);
    return date;
  });

export const getWorkspaceAnalytics =
  async (workspaceId: string) => {
    const days = lastNDays(14);

    const [
      members,
      channels,
      messages,
      files,
      documents,
      aiUsage,
      activities
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
      prisma.activity.count({
        where: {
          workspaceId,
          type: "AI_ASSISTANT_USED"
        }
      }),
      prisma.activity.findMany({
        where: {
          workspaceId,
          createdAt: {
            gte: days[0]
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      })
    ]);

    const activitySeries = days.map(
      (day) => {
        const next = new Date(day);
        next.setDate(
          next.getDate() + 1
        );

        return {
          date: day.toLocaleDateString(
            "en",
            {
              month: "short",
              day: "numeric"
            }
          ),
          activity:
            activities.filter(
              (item) =>
                item.createdAt >= day &&
                item.createdAt < next
            ).length,
          ai:
            activities.filter(
              (item) =>
                item.type ===
                  "AI_ASSISTANT_USED" &&
                item.createdAt >= day &&
                item.createdAt < next
            ).length
        };
      }
    );

    return {
      totals: {
        members,
        channels,
        messages,
        files,
        documents,
        aiUsage
      },
      activitySeries,
      insights: [
        messages > 25
          ? "High message velocity this period."
          : "Message activity is warming up.",
        documents > 0
          ? "Documents are being used for shared memory."
          : "Create docs to capture decisions.",
        aiUsage > 0
          ? "AI assistant usage is active."
          : "Try AI summaries to speed up standups."
      ]
    };
  };
