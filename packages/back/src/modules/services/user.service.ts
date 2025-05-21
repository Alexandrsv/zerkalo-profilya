import prisma from "../../utils/prisma";
import { CreateUserInput, PatchUserInput } from "../schemas/user.schema";
import axios from "axios";
import { UserFlag } from "@prisma/client";

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUserByVkId(vkId: string | number) {
  if (!vkId) {
    return null;
  }
  // Убеждаемся, что vkId точно строка для запроса к базе данных
  const vkIdStr = String(vkId);

  try {
    return await prisma.user.findUnique({
      where: {
        vkId: vkIdStr,
      },
    });
  } catch (error) {
    console.error("Ошибка при поиске пользователя по vkId:", error);
    return null;
  }
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function createUser(user: CreateUserInput) {
  try {
    // Обеспечиваем, что все поля имеют правильный формат
    return await prisma.user.create({
      data: {
        vkId: String(user.vkId),
        name: user.name || "",
        photo: user.photo,
        age: user.age,
        sex: String(user.sex).charAt(0),
        isClosedProfile: user.isClosedProfile ?? false,
        isDon: false,
        banned: user.banned,
        flags: [] as UserFlag[],
      },
    });
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    throw error;
  }
}

export async function patchUser(id: number, user: PatchUserInput) {
  if (!user) {
    return getUserById(id);
  }
  if (user.flags) {
    user.flags = Array.from(new Set(user.flags));
  }
  return prisma.user.update({
    where: {
      id,
    },
    data: user,
  });
}

export async function addUserToHs(vkUserId: number | string) {
  const token = process.env.HS_API_KEY;

  return await axios.put(
    `https://broadcast.vkforms.ru/api/v2/list/1260939?token=${token}`,
    {
      list: {
        to_add: [vkUserId],
      },
    }
  );
}

export async function decrementUserBoost(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user || user?.boost === 0) {
    return user;
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      boost: {
        decrement: 1,
      },
    },
  });
}

export async function incrementUserBoost(userId: number, boost = 1) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      boost: {
        increment: boost,
      },
    },
  });
}

export async function setUserBoost(userId: number, boost: number) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      boost,
    },
  });
}
