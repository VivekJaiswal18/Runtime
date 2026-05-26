/*
  Warnings:

  - Added the required column `logs` to the `Deployment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Deployment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('queued', 'failed', 'deployed');

-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "logs" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL;
