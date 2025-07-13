import { loadavg } from "os";
import { ENV } from "../config/env";

export function isHighServerLoad(): boolean {
  const [oneMinuteLoad] = loadavg();

  return oneMinuteLoad > ENV.HIGH_LOAD_THRESHOLD;
}
