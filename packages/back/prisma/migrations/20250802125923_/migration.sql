/*
  Warnings:

  - A unique constraint covering the columns `[event_id]` on the table `VkCallbackEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VkCallbackEvent_event_id_key" ON "VkCallbackEvent"("event_id");
