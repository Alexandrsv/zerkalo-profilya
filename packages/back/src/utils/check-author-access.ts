import { IVkAppParams } from "../models/vk-app-params";
import { getUserByVkId } from "../modules/services/user.service";

export const checkAuthorAccess = async (
  authorId: number,
  bridgeUser: IVkAppParams
) => {
  const user = await getUserByVkId(bridgeUser.vk_user_id);
  if (!user || !user.id) {
    return false;
  } else if (user.id !== authorId) {
    return false;
  }
  return true;
};
