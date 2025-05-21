export const shuffle = <T extends Array<unknown>>(array: T): T => {
  return array.sort(() => Math.random() - 0.5);
};
