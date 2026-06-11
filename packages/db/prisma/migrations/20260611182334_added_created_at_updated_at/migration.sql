/*
  Warnings:

  - Added the required column `branch` to the `Deployment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commitHash` to the `Deployment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Deployment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Deployment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "commitHash" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
