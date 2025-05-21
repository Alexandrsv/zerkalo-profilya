-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserFlag" ADD VALUE 'IS_RECOMMEND_APP';
ALTER TYPE "UserFlag" ADD VALUE 'IS_ALLOW_GROUP_MESSAGES';
ALTER TYPE "UserFlag" ADD VALUE 'IS_JOIN_TO_GROUP';
ALTER TYPE "UserFlag" ADD VALUE 'IS_ADD_TO_FAVOURITE';
