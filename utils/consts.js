export const PORT = parseInt(process.env.PORT || 3005);

export const QUEUE_LIMIT = parseInt(process.env.QUEUE_LIMIT || 100);

export const CONCURRENCY_LIMIT = parseInt(process.env.CONCURRENCY || 10);

export const TASK_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  RETRY: "retry",
};

export const TASK_QUEUE_EVENTS = {
  TASK_ADDED: "task-added",
  TASK_COMPLETED: "task-completed",
  TASK_STARTED: "task-started",
  TASK_RETRY: "task-retry",
  TASK_FAILED: "task-failed",
  TASK_DROPPED: "task-dropped",
  QUEUE_LIMIT_FULL: "queue-limit-full",
  QUEUE_SHUTDOWN_STARTED: "queue-shutdown-started",
  QUEUE_SHUTDOWN_COMPLETE: "queue-shutdown-completed",
};

export const LOG_EVENTS = {
  SERVER_START: "server_start",
  SHUTDOWN: "shutdown",
  SHUTDOWN_WAIT: "shutdown_wait",
  SHUTDOWN_COMPLETE: "shutdown_complete",
  WEBHOOK_RECEIVED: "webhook_received",
  PROCESSED: "processed",
  RETRYING: "retrying",
  FAILED: "failed",
  RATE_LIMIT: "rate-limit",
  TASK_STARTED: "task-started",
  TASK_RETRY: "task-retry",
  TASK_FAILED: "task-failed",
};

export const MESSAGES = {
  QUEUE_OVERLOADED: "Queue limit exceeded",
  INVALID_JSON: "Invalid JSON payload received",
  SHUTTING_DOWN: "Gracefully shutting down...",
  SHUTDOWN_WAITING: "Waiting for queue to drain before shutdown",
  SHUTDOWN_DONE: "Shutdown complete",
  WEBHOOK_ACCEPTED: "Webhook payload accepted and enqueued",
  TASK_PROCESSING: "Started processing task",
  TASK_COMPLETED: "Completed processing task",
  TASK_FAILED_FINAL: "Task failed after retry",
  TASK_RETRYING: "Retrying task due to failure",
  TOO_MANY_REQUESTS: "Too Many Requests",
  ACCEPTED: "accepted",
  TASK_STARTED: "Started task",
};
