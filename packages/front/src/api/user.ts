import { instance } from "./axios-instance";
import { apiUrls } from "./api-configs";

export type Flags =
  | "IS_ONBOARDED"
  | "IS_ALLOW_PUSH_NOTIFICATION"
  | "IS_CANCEL_PUSH_NOTIFICATION"
  | "IS_RECOMMEND_APP"
  | "IS_ALLOW_GROUP_MESSAGES"
  | "IS_JOIN_TO_GROUP"
  | "IS_ADD_TO_FAVOURITE"
  | "IS_ADD_TO_PROFILE";

export interface IUser {
  id: number;
  vkId: number;
  name: string;
  age: number;
  profession: string;
  sex: 0 | 1 | 2; // хз/жен/муж
  photo: string;
  isClosedProfile?: boolean;
  flags: Flags[];
  banned: boolean;
  bannedReason: string | null;
  isDon?: boolean;
}

export interface ILogin {
  vkId: number;
  name: string;
  sex: string;
  photo: string;
  age?: number;
  isClosedProfile: boolean;
}

export const loginFetcher = async (params: ILogin) => {
  const { data } = await instance.post<IUser>(apiUrls.userLogin, params);
  return data;
};

export const usersFetcher = async (id?: number) => {
  const url = id ? apiUrls.users + `/${id}` : apiUrls.users;
  const { data } = await instance.get<IUser>(url);
  return data;
};

export const getUserByVkIdFetcher = async (vkId: string) => {
  const { data } = await instance.get<IUser[]>(apiUrls.users, {
    params: { vkId },
  });
  return data;
};

export type PatchUserInput = Partial<
  Pick<IUser, "age" | "profession" | "sex" | "flags" | "isClosedProfile">
>;

export const patchUserFetcher = async (id: number, user: PatchUserInput) => {
  if (user.flags) {
    user.flags = Array.from(new Set(user.flags));
  }

  const { data } = await instance.patch<IUser>(apiUrls.users + `/${id}`, user);
  return data;
};

export const addUserToHSFetcher = async (id: number) => {
  const { data } = await instance.post<{ response: number }>(
    apiUrls.users + `/${id}/add-to-hs/`
  );
  return data;
};
