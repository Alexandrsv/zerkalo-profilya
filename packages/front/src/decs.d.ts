declare module "eruda" {
  export function init();
  export function add(module: unknown);
}

declare module "eruda-code";
declare module "eruda-dom";
declare module "eruda-fps";

// Декларации для NodeJS namespace
declare namespace NodeJS {
  interface Timeout {}
}

// Объявляем clearTimeout и clearInterval для работы с NodeJS.Timeout
declare function clearTimeout(timeoutId: NodeJS.Timeout | number): void;
declare function clearInterval(intervalId: NodeJS.Timeout | number): void;
