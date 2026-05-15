import slugify from "slugify";

import prisma from "../../lib/prisma";

export const createWorkspace =
  async (
    userId: string,
    data: {
      name: string;
      description?: string;
    }
  ) => {
    const slug = slugify(data.name, {
      lower: true
    });

    const workspace =
      await prisma.workspace.create({
        data: {
          name: data.name,

          description:
            data.description,

          slug,

          ownerId: userId,

          members: {
            create: {
              userId,
              role: "OWNER"
            }
          },

          channels: {
            create: {
              name: "general"
            }
          }
        },

        include: {
          members: true,
          channels: true
        }
      });

    return workspace;
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

      include: {
        members: true,
        channels: true
      }
    });
  };
