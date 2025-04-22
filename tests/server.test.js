import request from "supertest";
import { app, taskQueue } from "../server";
import { MESSAGES, QUEUE_LIMIT } from "../utils/consts.js";
import { Task } from "../task.js";

describe("Rate limiter logic", () => {
  it("should return 429 when queue limit is exceeded", async () => {
    const tasks = [...new Array(QUEUE_LIMIT * 2)].map((_) => new Task({}));
    tasks.forEach((task) => taskQueue.enqueue(task));
    taskQueue.resetConcurrencyLimit(1);

    const response = await request(app)
      .post("/webhook")
      .send({ event: "test" });

    expect(response.statusCode).toBe(429);
    expect(response.body.error).toBe(MESSAGES.TOO_MANY_REQUESTS);
  });

  it("should return 202 when queue is not full", async () => {
    taskQueue.queue = [];

    const response = await request(app)
      .post("/webhook")
      .send({ event: "test" });

    expect(response.statusCode).toBe(202);
    expect(response.body.status).toBe(MESSAGES.ACCEPTED);
  });
});
