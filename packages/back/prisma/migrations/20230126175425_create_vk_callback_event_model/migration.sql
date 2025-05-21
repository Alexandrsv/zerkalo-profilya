-- CreateTable
CREATE TABLE "VkCallbackEvent" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "object" JSONB NOT NULL,
    "event_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VkCallbackEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VkCallbackEvent_type_idx" ON "VkCallbackEvent"("type");

-- CreateIndex
CREATE INDEX "VkCallbackEvent_event_id_idx" ON "VkCallbackEvent"("event_id");
