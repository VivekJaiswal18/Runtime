-- AlterTable
ALTER TABLE "Fix" ADD COLUMN     "attemptCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "owner" TEXT NOT NULL DEFAULT '';
