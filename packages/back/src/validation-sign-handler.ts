import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import { checkVkSignature } from "./utils/check-vk-sign";
import { getVkParamsObject } from "./utils/get-vk-params-object";
import { IVkAppParams } from "./models/vk-app-params";

function sendSignError(reply: FastifyReply) {
  return reply
    .status(401)
    .send({ statusCode: 401, error: "Sign is not valid", value: null });
}

export function validationSignHandler(
  request: FastifyRequest,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) {
  const excludePaths = ["/callback"];
  const isExcludedRoute = excludePaths.some(
    (path) => request.url.indexOf(path) === 0
  );
  if (isExcludedRoute) {
    return done();
  } else {
    const vkUrl = request.headers["auth"] as string;
    const vkAppSecret = process.env.VK_APP_SECRET as string;
    const vkAppParams = getVkParamsObject(vkUrl);
    if (!vkAppParams?.vk_user_id) {
      return sendSignError(reply);
    }
    const isSignValid = checkVkSignature("?" + vkUrl, vkAppSecret);

    request.user = vkAppParams as IVkAppParams;
    if (!isSignValid) {
      return sendSignError(reply);
    }

    done();
  }
}
