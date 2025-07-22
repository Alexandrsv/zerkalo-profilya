import { FastifyReply, FastifyRequest } from "fastify";
import {
  addUserToHs,
  createUser,
  getUserById,
  getUserByVkId,
  getUsers,
  patchUser,
} from "../services/user.service";

import {
  CreateUserInput,
  QueryStringUsersGet,
  PatchUserInput,
} from "../schemas/user.schema";
import { getApiUserInfo, setAppCounter } from "../../api/vk-api";
import { ADMIN_VK_IDS } from "../../const/admin-vk-ids";
import { syncUserDonStatus } from "../services/don.service";

export async function loginOrSignupHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const body = request.body;
  //TODO: требует рефактора. лишняя инфа с фронта

  try {
    let user = await getUserByVkId(request.user.vk_user_id);

    if (user) {
      if (
        typeof body.isClosedProfile === "boolean" &&
        body?.isClosedProfile !== user.isClosedProfile
      ) {
        const updatedUser = await patchUser(user.id, {
          isClosedProfile: body?.isClosedProfile,
        });
        if (updatedUser) {
          user = updatedUser;
        }
      }

      if (body.photo && body.photo !== user.photo) {
        const userInfo = await getApiUserInfo(request.user.vk_user_id);
        const updatedUser = await patchUser(user.id, {
          photo: userInfo.photo_200,
        });
        if (updatedUser) {
          user = updatedUser;
        }
      }

      return reply.code(200).send(user);
    } else {
      const userInfo = await getApiUserInfo(request.user.vk_user_id);

      const userInput: CreateUserInput = {
        name: `${userInfo.first_name} ${userInfo.last_name}`,
        photo: userInfo.photo_200,
        sex: userInfo.sex.toString() as "0" | "1" | "2",
        vkId: request.user.vk_user_id,
        isClosedProfile: userInfo.is_closed,
      };

      if (userInfo.deactivated === "banned") {
        userInput.banned = "Аккаунт заблокирован на стороне ВКонтакте";
      }
      if (userInfo.deactivated === "deleted") {
        userInput.banned = "Аккаунт удален на стороне ВКонтакте";
      }
      try {
        const newUser = await createUser(userInput);
        return reply.code(201).send(newUser);
      } catch (createError) {
        console.error("Ошибка при создании пользователя:", {
          error: createError,
          userInput,
          vkUserId: request.user.vk_user_id,
        });
        return reply.code(500).send({
          error: "Internal Server Error",
          message: "Не удалось создать пользователя",
        });
      }
    }
  } catch (error) {
    console.error("Unexpected error in loginOrSignupHandler:", {
      error,
      vkUserId: request.user.vk_user_id,
    });
    return reply.code(500).send({
      error: "Internal Server Error",
      message: "Произошла неожиданная ошибка",
    });
  }
}

export async function patchUserHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: PatchUserInput;
  }>,
  reply: FastifyReply
) {
  const user = await getUserById(+request.params.id);

  if (!user || !user.vkId) {
    return reply.code(404).send("User not found");
  }
  if (user?.vkId !== request.user.vk_user_id) {
    return reply.code(403).send("Forbidden");
  }
  try {
    const patchedUser = await patchUser(Number(user.id), request.body);
    return reply.code(200).send(patchedUser);
  } catch (error) {
    console.log(error);
    return reply.code(500).send(error);
  }
}

export async function getUsersHandler(
  request: FastifyRequest<{ Querystring: QueryStringUsersGet }>,
  reply: FastifyReply
) {
  if (request.query?.vkId) {
    const user = await getUserByVkId(request.query.vkId);
    return reply.code(200).send([user]);
  }
  if (ADMIN_VK_IDS.includes(request.user.vk_user_id.toString())) {
    return await getUsers();
  } else {
    return reply.code(403).send("Forbidden");
  }
}

export async function getUserHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  _reply: FastifyReply
) {
  if (ADMIN_VK_IDS.includes(request.user.vk_user_id.toString())) {
    return await getUserById(+request.params.id);
  } else {
    return await getUserByVkId(request.user.vk_user_id);
  }
}

export async function addUserToHSHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const rez = await addUserToHs(request.user.vk_user_id);
  return reply.code(200).send(rez.data);
}

export async function setAppCounterHandler(
  request: FastifyRequest<{ Params: { value: number } }>,
  reply: FastifyReply
) {
  const user_id = request.user.vk_user_id;
  const counter = request.params.value;
  if (!user_id || !counter) {
    return reply.code(400).send("Bad request");
  }
  const rez = await setAppCounter({ user_id, counter, increment });
  return reply.code(200).send(rez);
}
const increment = 1;

export async function syncDonStatusHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const userId = request.params.id;
    const user = await getUserById(Number(userId));

    if (!user || !user.vkId) {
      return reply.code(404).send({ error: "User not found" });
    }

    // Проверяем, что пользователь может синхронизировать только свой статус
    // или это админ
    if (
      user.vkId !== request.user.vk_user_id &&
      !ADMIN_VK_IDS.includes(request.user.vk_user_id.toString())
    ) {
      return reply.code(403).send({ error: "Forbidden" });
    }

    const actualDonStatus = await syncUserDonStatus(user.vkId);

    return reply.code(200).send({
      success: true,
      isDon: actualDonStatus,
      message: `DON status synchronized for user ${user.vkId}`,
    });
  } catch (error) {
    console.error("[DON SYNC] Error in syncDonStatusHandler:", error);
    return reply.code(500).send({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
