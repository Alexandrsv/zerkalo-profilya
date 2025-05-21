type SocialNetwork = "instagram" | "vk" | "ok" | "youtube" | null;

export const getTargetUrlInfo = (url: string) => {
  let socialNetwork: SocialNetwork = null;
  let logo: string = "/link.svg";
  if (url.includes("instagram.com/")) {
    socialNetwork = "instagram";
  }
  if (url.includes("vk.com/")) {
    logo = "/vk-logo.svg";
    socialNetwork = "vk";
  }
  if (url.includes("ok.ru/")) {
    logo = "/ok-logo.svg";
    socialNetwork = "ok";
  }
  if (url.includes("youtube.com/")) {
    socialNetwork = "youtube";
  }
  return { socialNetwork, logo };
};
