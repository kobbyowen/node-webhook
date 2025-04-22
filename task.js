import { randomUUID } from "crypto";
import { TASK_STATUS } from "./utils/consts.js";

export class Task {
  constructor(payload) {
    this.id = randomUUID();
    this.payload = payload;
    this.retries = 0;
    this.status = TASK_STATUS.PENDING;
    this.processingTime = 0;
    this.createdAt = new Date();
  }

  start() {
    this.status = TASK_STATUS.PROCESSING;
    this.startedAt = Date.now();
  }

  complete() {
    this.status = TASK_STATUS.COMPLETED;
    this.processingTime = Date.now() - this.startedAt;
  }

  fail() {
    this.status = TASK_STATUS.FAILED;
    this.processingTime = Date.now() - this.startedAt;
  }

  retry() {
    this.retries++;
    this.status = TASK_STATUS.PROCESSING;
  }
}
