import { FastifyReply, FastifyRequest } from "fastify";
import { CallbackEvent } from "../schemas/callback.schema";
import { insertCallbackEvent } from "../services/callback.service";
import {
  getUserByVkId,
  incrementUserBoost,
  patchUser,
} from "../services/user.service";
import { getCountAnswersByMoney } from "../../utils/get-count-answers-by-money";

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

  await insertCallbackEvent(request.body);

  if (request.body.type === "confirmation") {
    return reply.send(process.env.VK_CALLBACK_CONFIRMATION_CODE);
  }

  if (request.body.secret !== secret) {
    console.error("wrong secret", JSON.stringify(request.body));
    return reply.send("ok");
  }

  //---------------------------------------------

  if (
    request.body.type === "donut_subscription_create" ||
    request.body.type === "donut_subscription_prolonged"
  ) {
    const { user_id, amount } = request.body.object;

    await patchUser(user_id, {
      isDon: false,
    });

    const purchasedAnswers = getCountAnswersByMoney(amount);
    await donutBoost(user_id, purchasedAnswers);
  }

  if (request.body.type === "donut_subscription_price_changed") {
    const { user_id, amount_diff } = request.body.object;
    const purchasedAnswers = getCountAnswersByMoney(amount_diff);
    await donutBoost(user_id, purchasedAnswers);
  }

  if (request.body.type === "donut_subscription_expired") {
    const { user_id } = request.body.object;
    await patchUser(user_id, {
      isDon: false,
    });
  }

  // console.log(request.body, request.query, request.params);
  return "ok";
}
