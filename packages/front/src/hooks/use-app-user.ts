import { useLogin } from "./use-login";
import useSWR from "swr";
import {
  IUser,
  patchUserFetcher,
  PatchUserInput,
  usersFetcher,
} from "../api/user";
import { useCallback } from "react";

export type UpdateUser = (user: PatchUserInput) => Promise<IUser | undefined>;

export const useAppUser = () => {
  const { data: login } = useLogin();
  const { data: user, mutate: userMutate } = useSWR(
    login?.id ? `/users/${login.id}` : null,
    () => usersFetcher(login?.id)
  );

  const updateUser: UpdateUser = useCallback(
    async (newUserParams) => {
      if (user) {
        const patchResponse = await patchUserFetcher(user.id, newUserParams);
        if (patchResponse) await userMutate();

        return patchResponse;
      }
    },
    [user, userMutate]
  );

  return {
    user,
    updateUser,
  };
};
