import { logger } from "./utils/logger.js";

export async function sigIntHandler(queue) {
  logger.info({ event: "shutdown", message: "Gracefully shutting down..." });

  await queue.shutdown();
  process.exit(0);
}
