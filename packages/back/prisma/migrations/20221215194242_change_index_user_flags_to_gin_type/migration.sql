-- DropIndex
DROP INDEX "User_flags_idx";

-- CreateIndex
CREATE INDEX "User_flags_idx" ON "User" USING GIN ("flags");
