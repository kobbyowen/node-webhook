import { EventEmitter } from "node:events";
import { CONCURRENCY_LIMIT, TASK_QUEUE_EVENTS } from "./utils/consts.js";

export class TaskQueue extends EventEmitter {
  constructor(concurrency = 10) {
    super();
    this.queue = [];
    this.active = 0;
    this.concurrency = parseInt(CONCURRENCY_LIMIT || concurrency);
    this.shutDownInitiated = false;
  }

  get length() {
    return this.queue.length;
  }

  enqueue(task) {
    this.queue.push(task);
    this.emit(TASK_QUEUE_EVENTS.TASK_ADDED, task);
  }

  async processQueue() {
    while (!this.shutDownInitiated) {
      if (this.queue.length === 0 || this.active >= this.concurrency) {
        await new Promise((resolve) => setTimeout(resolve, 1));

        continue;
      }

      const availableSlots = this.concurrency - this.active;
      const batch = this.queue.splice(0, availableSlots);
      this.active += batch.length;

      await Promise.allSettled(
        batch.map((task) =>
          this.handleTask(task).finally(() => {
            this.active--;
          })
        )
      );
    }
  }

  async handleTask(task) {
    task.start();
    this.emit(TASK_QUEUE_EVENTS.TASK_STARTED, task);
    try {
      await this.simulateProcessing(task);
      task.complete();
      this.emit(TASK_QUEUE_EVENTS.TASK_COMPLETED, task);
    } catch (err) {
      if (task.retries < 1) {
        task.retry();
        this.emit(TASK_QUEUE_EVENTS.TASK_RETRY, task);
        this.queue.unshift(task);
      } else {
        task.fail();
        this.emit(TASK_QUEUE_EVENTS.TASK_FAILED, task);
      }
    }
  }

  simulateProcessing(task) {
    return new Promise((resolve, reject) => {
      const delay = Math.floor(Math.random() * 200) + 100;
      setTimeout(() => {
        Math.random() < 0.1
          ? reject(new Error(`Simulated failure ${task.id}`))
          : resolve();
      }, delay);
    });
  }

  async shutdown() {
    this.emit(TASK_QUEUE_EVENTS.QUEUE_SHUTDOWN_STARTED, this.queue.length);
    this.shutDownInitiated = true;
    while (this.queue.length > 0 || this.active > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.emit(TASK_QUEUE_EVENTS.QUEUE_SHUTDOWN_COMPLETE);
  }

  resetConcurrencyLimit(newLimit) {
    this.concurrency = newLimit;
  }
}
