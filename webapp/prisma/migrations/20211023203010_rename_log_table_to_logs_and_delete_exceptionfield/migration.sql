/*
  Warnings:

  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Log";

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);
