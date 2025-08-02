import { FastifyReply, FastifyRequest } from "fastify";
import { CallbackEvent } from "../schemas/callback.schema";
import { insertCallbackEvent, selectCallbackEventByEventId } from "../services/callback.service";
import {
  getUserByVkId,
  incrementUserBoost,
  patchUser,
} from "../services/user.service";
import { getCountAnswersByMoney } from "../../utils/get-count-answers-by-money";
import { syncUserDonStatus } from "../services/don.service";

export async function donutBoost(vkId: number, amount: number) {
  const user = await getUserByVkId(vkId.toString());
  if (user) {
    await incrementUserBoost(user.id, amount);
  } else {
    console.log("donutBoost: user not found", vkId);
  }
}

export async function callbackHandler(
  request: FastifyRequest<{ Body: CallbackEvent }>,
  reply: FastifyReply
) {
  const secret = process.env.VK_CALLBACK_SECRET_KEY;

  if (request.body.type === "confirmation") {
    return reply.send(process.env.VK_CALLBACK_CONFIRMATION_CODE);
  }

  if (request.body.secret !== secret) {
    console.error("wrong secret", JSON.stringify(request.body));
    return reply.send("ok");
  }

  // Проверяем, было ли это событие уже обработано
  if (request.body.event_id) {
    const existingEvent = await selectCallbackEventByEventId(request.body.event_id);
    if (existingEvent) {
      console.log(`[CALLBACK] Event ${request.body.event_id} already processed, returning OK`);
      return reply.send("ok");
    }
  }

  // Сохраняем событие в базу
  await insertCallbackEvent(request.body);

  //---------------------------------------------

  if (
    request.body.type === "donut_subscription_create" ||
    request.body.type === "donut_subscription_prolonged"
  ) {
    const { user_id, amount } = request.body.object;

    console.log(
      `[DON] Setting isDon=true for user ${user_id}, type: ${request.body.type}, amount: ${amount}`
    );

    // Получаем пользователя по VK ID, чтобы использовать правильный внутренний ID
    const user = await getUserByVkId(user_id.toString());
    if (user) {
      await patchUser(user.id, {
        isDon: true,
      });

      const purchasedAnswers = getCountAnswersByMoney(amount);
      await donutBoost(user_id, purchasedAnswers);

      setTimeout(() => {
        syncUserDonStatus(user_id).catch(console.error);
      }, 1000);
    } else {
      console.error(`[DON] User with VK ID ${user_id} not found in database`);
    }
  }

  if (request.body.type === "donut_subscription_price_changed") {
    const { user_id, amount_diff } = request.body.object;

    console.log(
      `[DON] Price changed for user ${user_id}, amount_diff: ${amount_diff}`
    );

    const purchasedAnswers = getCountAnswersByMoney(amount_diff);
    await donutBoost(user_id, purchasedAnswers);
  }

  if (
    request.body.type === "donut_subscription_expired" ||
    request.body.type === "donut_subscription_cancelled"
  ) {
    const { user_id } = request.body.object;

    console.log(
      `[DON] Setting isDon=false for user ${user_id}, type: ${request.body.type}`
    );

    // Получаем пользователя по VK ID, чтобы использовать правильный внутренний ID
    const user = await getUserByVkId(user_id.toString());
    if (user) {
      await patchUser(user.id, {
        isDon: false,
      });

      setTimeout(() => {
        syncUserDonStatus(user_id).catch(console.error);
      }, 1000);
    } else {
      console.error(`[DON] User with VK ID ${user_id} not found in database`);
    }
  }

  // console.log(request.body, request.query, request.params);
  return "ok";
}
