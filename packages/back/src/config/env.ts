// Экспортируем переменные для удобства использования
export const ENV = {
  HIGH_LOAD_THRESHOLD:
    process.env.HIGH_LOAD_THRESHOLD !== undefined
      ? Number(process.env.HIGH_LOAD_THRESHOLD)
      : 5,
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
  NODE_ENV: process.env.NODE_ENV,
  APP_PORT: Number(process.env.APP_PORT) || 3005,
  DATABASE_URL: process.env.DATABASE_URL,
  ACCESS_TOKEN_APP: process.env.ACCESS_TOKEN_APP,
  ACCESS_TOKEN_USER: process.env.ACCESS_TOKEN_USER,
  VK_APP_SECRET: process.env.VK_APP_SECRET,
  VK_CALLBACK_SECRET_KEY: process.env.VK_CALLBACK_SECRET_KEY,
  VK_CALLBACK_CONFIRMATION_CODE: process.env.VK_CALLBACK_CONFIRMATION_CODE,
  ADMIN_VKIDS: process.env.ADMIN_VKIDS,
  HS_API_KEY: process.env.HS_API_KEY,
  VK_AUTH_MOCK: process.env.VK_AUTH_MOCK,
} as const;
