import axios from "axios";
import { ENV } from "../config/env";

const ACCESS_TOKEN_APP = ENV.ACCESS_TOKEN_APP;

const instance = axios.create({
  baseURL: `https://api.vk.com/method/`,
});

instance.defaults.params = {
  access_token: ACCESS_TOKEN_APP,
  v: "5.131",
};

export const getApiUserInfo = async (userId: string | number) => {
  const { data } = await instance.get<{ response: IVkApiUser[] }>("users.get", {
    params: {
      user_ids: userId,
      lang: "ru",
      fields: "photo_200,sex",
    },
  });
  console.log(JSON.stringify(data));
  return data.response[0];
};

export type SetAppCounter = {
  (params: {
    user_id: number | string;
    counter: number;
    increment?: 0 | 1;
  }): Promise<{ response: number }>;
};

export const setAppCounter: SetAppCounter = async ({
  user_id,
  counter,
  increment,
}) => {
  const { data } = await instance.get<{ response: number }>(
    "secure.setCounter",
    {
      params: {
        user_id,
        counter,
        increment,
      },
    }
  );
  if (!data?.response) {
    console.log(`setAppCounter error ${user_id}`, data);
  }
  console.log(`setAppCounter ${user_id}`, JSON.stringify(data));
  return data;
};

/**
 * Проверяет статус подписки VK DON для пользователя
 * @param userId - ID пользователя VK
 * @returns true если пользователь имеет активную подписку VK DON
 */
export const checkDonutSubscription = async (
  userId: string | number
): Promise<boolean> => {
  try {
    const { data } = await instance.get<{ response: { is_don: 0 | 1 }[] }>(
      "donut.isDon",
      {
        params: {
          owner_id: userId,
        },
      }
    );

    const isDon = data.response?.[0]?.is_don === 1;
    console.log(`[VK API] DON status for user ${userId}: ${isDon}`);
    return isDon;
  } catch (error) {
    console.error(
      `[VK API] Error checking DON status for user ${userId}:`,
      error
    );
    return false;
  }
};

export interface IVkApiUser {
  id: number;
  photo_200: string;
  first_name: string;
  last_name: string;
  sex: 0 | 1 | 2;
  deactivated: "banned" | "deleted";
  can_access_closed: boolean;
  is_closed: boolean;
}
