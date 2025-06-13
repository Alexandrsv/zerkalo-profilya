-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "targetSex" CHAR(1) NOT NULL DEFAULT '0';

-- CreateIndex
CREATE INDEX "Question_targetSex_idx" ON "Question"("targetSex");

-- CreateIndex
CREATE INDEX "Question_isActive_targetSex_idx" ON "Question"("isActive", "targetSex");
