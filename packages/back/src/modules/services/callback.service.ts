import { CallbackEvent } from "../schemas/callback.schema";
import prisma from "../../utils/prisma";

export async function insertCallbackEvent(callbackEvent: CallbackEvent) {
  return prisma.vkCallbackEvent.create({
    data: {
      type: callbackEvent.type,
      object: (callbackEvent.object as any) || {},
      event_id:
        callbackEvent.event_id ||
        "MR_" + Math.random().toString(36).substring(7),
    },
  });
}

export async function selectCallbackEventByEventId(eventId: string) {
  try {
    return prisma.vkCallbackEvent.findFirst({
      where: {
        event_id: eventId,
        createdAt: {
          gte: new Date(new Date().getTime() - 1000 * 60 * 2),
        },
      },
    });
  } catch (e) {
    return null;
  }
}
