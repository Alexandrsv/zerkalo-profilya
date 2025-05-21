-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banned" TEXT;

-- CreateIndex
CREATE INDEX "User_banned_idx" ON "User"("banned");
