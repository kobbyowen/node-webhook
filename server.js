import bodyParser from "body-parser";
import express from "express";
import { TaskQueue } from "./task-queue.js";
import { Metrics } from "./metrics.js";
import { logger } from "./utils/logger.js";
import { LOG_EVENTS, MESSAGES, PORT, QUEUE_LIMIT } from "./utils/consts.js";
import { sigIntHandler } from "./signal-handlers.js";
import { registerMetricsHandlerToTaskQueueEvents } from "./utils/helpers.js";
import { Task } from "./task.js";

export const app = express();
export const taskQueue = new TaskQueue();
export const metrics = new Metrics();

app.use(bodyParser.json());
registerMetricsHandlerToTaskQueueEvents(taskQueue, metrics);

app.post("/webhook", (req, res) => {
  if (taskQueue.length > QUEUE_LIMIT) {
    logger.warn({
      event: LOG_EVENTS.RATE_LIMIT,
      reason: MESSAGES.QUEUE_OVERLOADED,
    });
    metrics.recordDroppedRequest();
    return res.status(429).json({ error: MESSAGES.TOO_MANY_REQUESTS });
  }

  const data = req.body;
  logger.info({ event: LOG_EVENTS.WEBHOOK_RECEIVED, payload: data });

  taskQueue.enqueue(new Task(data));
  res.status(202).json({ status: MESSAGES.ACCEPTED });
});

app.get("/metrics", (req, res) => {
  const accepts = req.get("Accept") || "";
  if (accepts.includes("text/plain")) {
    res.set("Content-Type", "text/plain");
    res.json(metrics.getPrometheusFormat());
  } else {
    res.send(metrics.getAsJSON());
  }
});

process.on("SIGINT", sigIntHandler);

app.listen(PORT, () => {
  logger.info({ event: LOG_EVENTS.SERVER_START, port: PORT });
  taskQueue.processQueue();
});
