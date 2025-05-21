-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDon" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Feedback_authorId_questionId_idx" ON "Feedback"("authorId", "questionId");
