export const routes = {
  profile: "/profile",
  otherProfile: "/profile/:profileId",
  feed: "/feed",
  settings: "/settings",
  question: "/question/:questionId",
  onboarding_1: "/onboarding_1",
  onboarding_2: "/onboarding_2",
  onboarding_3: "/onboarding_3",
  onboarding_4: "/onboarding_4",
  apple: "/apple",
  banned: "/banned",
  "404": "/404",
  "no-more-questions": "/no-more-questions",
} as const;

export type PageNames = keyof typeof routes;
export type PagePath = typeof routes[PageNames];
