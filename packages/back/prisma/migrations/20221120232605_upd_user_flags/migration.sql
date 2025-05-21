/*
  Warnings:

  - The `flags` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserFlag" AS ENUM ('IS_ONBOARDED', 'IS_ALLOW_PUSH_NOTIFICATION', 'IS_CANCEL_PUSH_NOTIFICATION');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "flags",
ADD COLUMN     "flags" "UserFlag"[] DEFAULT ARRAY[]::"UserFlag"[];

-- DropEnum
DROP TYPE "Flag";
