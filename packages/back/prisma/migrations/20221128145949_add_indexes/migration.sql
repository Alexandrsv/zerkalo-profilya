-- CreateIndex
CREATE INDEX "Feedback_isRemoved_idx" ON "Feedback"("isRemoved");

-- CreateIndex
CREATE INDEX "Question_authorId_idx" ON "Question"("authorId");

-- CreateIndex
CREATE INDEX "Question_isActive_idx" ON "Question"("isActive");

-- CreateIndex
CREATE INDEX "Question_createdAt_idx" ON "Question"("createdAt" DESC);
