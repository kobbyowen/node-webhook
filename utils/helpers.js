import { LOG_EVENTS, MESSAGES, TASK_QUEUE_EVENTS } from "./consts.js";
import { logger } from "./logger.js";

export function registerMetricsHandlerToTaskQueueEvents(taskQueue, metrics) {
  taskQueue.on(TASK_QUEUE_EVENTS.TASK_ADDED, (task) => {
    metrics.recordRequest();
    logger.info({
      event: LOG_EVENTS.TASK_ADDED,
      id: task.id,
      reason: MESSAGES.TASK_STARTED,
    });
  });

  taskQueue.on(TASK_QUEUE_EVENTS.TASK_STARTED, (task) => {
    metrics.recordProcessing();
    logger.info({
      event: LOG_EVENTS.TASK_STARTED,
      id: task.id,
      reason: MESSAGES.TASK_STARTED,
    });
  });

  taskQueue.on(TASK_QUEUE_EVENTS.TASK_COMPLETED, (task) => {
    metrics.recordProcessed(task.processingTime);
    logger.info({
      event: LOG_EVENTS.TASK_COMPLETED,
      id: task.id,
      duration: task.processingTime,
      reason: MESSAGES.TASK_COMPLETED,
    });
  });

  taskQueue.on(TASK_QUEUE_EVENTS.TASK_RETRY, (task) => {
    logger.info({
      event: LOG_EVENTS.TASK_RETRY,
      reason: `Retrying task ${task.id}`,
    });
  });

  taskQueue.on(TASK_QUEUE_EVENTS.TASK_FAILED, (task) => {
    logger.error({
      event: LOG_EVENTS.TASK_FAILED,
      reason: `Task failed ${task.id}`,
    });
  });

  taskQueue.on(TASK_QUEUE_EVENTS.QUEUE_SHUTDOWN_STARTED, (remainingTasks) => {
    logger.error({
      event: LOG_EVENTS.SHUTDOWN_WAIT,
      reason: `Shutdown requested. ${remainingTasks} left`,
    });
  });

  taskQueue.on(TASK_QUEUE_EVENTS.QUEUE_SHUTDOWN_COMPLETE, () => {
    logger.error({
      event: LOG_EVENTS.SHUTDOWN_COMPLETE,
      reason: MESSAGES.SHUTDOWN_DONE,
    });
  });
}
