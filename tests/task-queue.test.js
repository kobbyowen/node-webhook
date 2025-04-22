import { TaskQueue } from "../task-queue.js";
import { TASK_QUEUE_EVENTS, TASK_STATUS } from "../utils/consts.js";

jest.useFakeTimers();

class DummyTask {
  constructor() {
    this.status = TASK_STATUS.PENDING;
    this.retries = 0;
  }
  start() {
    this.status = TASK_STATUS.PROCESSING;
  }
  complete() {
    this.status = TASK_STATUS.COMPLETED;
  }
  retry() {
    this.status = TASK_STATUS.RETRY;
    this.retries++;
  }
  fail() {
    this.status = TASK_STATUS.FAILED;
  }
}

describe("TaskQueue", () => {
  it("processes a task and marks it complete", async () => {
    const queue = new TaskQueue(1);
    queue.processQueue();
    const task = new DummyTask();
    const promise = new Promise((resolve) => {
      queue.on(TASK_QUEUE_EVENTS.TASK_COMPLETED, (t) => {
        expect(t).toBe(task);
        expect(t.status).toBe(TASK_STATUS.COMPLETED);
        resolve();
      });
    });

    queue.simulateProcessing = () => Promise.resolve();
    queue.enqueue(task);

    queue.shutdown();
  });

  it("retries a failed task once and then fails", async () => {
    const queue = new TaskQueue(1);
    queue.processQueue();
    const task = new DummyTask();
    let firstCall = true;

    const promise = new Promise((resolve) => {
      queue.on(TASK_QUEUE_EVENTS.TASK_FAILED, (t) => {
        expect(t).toBe(task);
        expect(t.retries).toBe(1);
        expect(t.status).toBe(TASK_STATUS.FAILED);
        resolve();
      });
    });

    queue.simulateProcessing = () =>
      firstCall ? ((firstCall = false), Promise.reject()) : Promise.reject();
    queue.enqueue(task);
    queue.shutdown();
  });
});
