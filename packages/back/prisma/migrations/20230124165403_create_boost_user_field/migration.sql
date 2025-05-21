-- AlterTable
ALTER TABLE "User" ADD COLUMN     "boost" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "User_boost_idx" ON "User"("boost");
