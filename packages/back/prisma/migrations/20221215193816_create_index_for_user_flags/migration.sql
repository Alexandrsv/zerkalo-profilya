-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "User_flags_idx" ON "User"("flags");
