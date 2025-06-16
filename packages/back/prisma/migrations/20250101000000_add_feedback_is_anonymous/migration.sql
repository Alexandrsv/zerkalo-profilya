-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN "isAnonymous" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Feedback_isAnonymous_idx" ON "Feedback"("isAnonymous"); 