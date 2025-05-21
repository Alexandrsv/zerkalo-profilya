import { IVkAppParams } from "../models/vk-app-params";

export const getVkParamsObject = (params?: string) => {
  if (typeof params !== "string") {
    return {};
  }
  const paramsArray = params.split("&");
  if (paramsArray.length === 0) {
    return {};
  }
  return paramsArray.reduce((acc, item) => {
    const [key, value] = item.split("=");
    return { ...acc, [key]: value };
  }, {}) as Partial<IVkAppParams>;
};
