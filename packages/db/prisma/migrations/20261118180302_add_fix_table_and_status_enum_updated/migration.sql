-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'built';

-- CreateTable
CREATE TABLE "Fix" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "deploymentId" INTEGER NOT NULL,
    "fixSummary" TEXT NOT NULL,
    "commitHash" TEXT NOT NULL,
    "linesChanged" TEXT NOT NULL,
    "fixDiff" TEXT NOT NULL,
    "fixCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fix_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Fix" ADD CONSTRAINT "Fix_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
