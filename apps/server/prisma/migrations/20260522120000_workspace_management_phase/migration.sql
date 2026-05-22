-- CreateEnum
CREATE TYPE "public"."InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');

-- AlterTable
ALTER TABLE "public"."Channel" ADD COLUMN "description" TEXT,
ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Invite" ADD COLUMN "role" "public"."WorkspaceRole" NOT NULL DEFAULT 'MEMBER',
ADD COLUMN "status" "public"."InviteStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."Workspace" ADD COLUMN "avatarColor" TEXT NOT NULL DEFAULT '#0f172a',
ADD COLUMN "avatarUrl" TEXT,
ADD COLUMN "settings" JSONB;

-- AlterTable
ALTER TABLE "public"."WorkspaceMember" ADD COLUMN "permissions" JSONB;
