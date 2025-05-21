import { getUserByVkIdFetcher, IUser } from "../api/user";
import useSWR from "swr";

export const useUser = (vkId: string) => {
  const { data: users, error } = useSWR<IUser[] | null, Error>(
    vkId ? "/users/" + vkId : null,
    () => getUserByVkIdFetcher(vkId)
  );
  const loading = !users && !error;
  let user: IUser | null = null;
  if (users && users.length > 0) {
    user = users[0];
  }
  return {
    user,
    loading,
    error,
  };
};
