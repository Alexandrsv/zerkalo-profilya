import axios from "axios";

const ACCESS_TOKEN_APP = process.env.ACCESS_TOKEN_APP;

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
