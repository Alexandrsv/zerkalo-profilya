-- CreateIndex
CREATE INDEX "Feedback_questionId_idx" ON "Feedback"("questionId");

-- CreateIndex
CREATE INDEX "Feedback_authorId_idx" ON "Feedback"("authorId");

-- CreateIndex
CREATE INDEX "Feedback_isRemoved_authorId_idx" ON "Feedback"("isRemoved", "authorId");

-- CreateIndex
CREATE INDEX "Question_authorId_isActive_idx" ON "Question"("authorId", "isActive");
