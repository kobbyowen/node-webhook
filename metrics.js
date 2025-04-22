export class Metrics {
  constructor() {
    this.totalRequests = 0;
    this.processedRequests = 0;
    this.droppedRequests = 0;
    this.totalProcessingTime = 0;
    this.processingCount = 0;
  }

  recordRequest() {
    this.totalRequests++;
  }

  recordProcessed(ms) {
    this.processedRequests++;
    this.processingCount === 0 ? 0 : this.processingCount--;
    this.totalProcessingTime += ms;
  }

  recordProcessing() {
    this.processingCount++;
  }

  recordDroppedRequest() {
    this.droppedRequests++;
  }

  getPrometheusFormat() {
    const avg = this.processingCount
      ? (this.totalProcessingTime / this.processingCount).toFixed(2)
      : 0;

    return (
      `# HELP webhook_total_requests Total webhook requests received\n` +
      `# TYPE webhook_total_requests counter\nwebhook_total_requests ${this.totalRequests}\n` +
      `# HELP webhook_processed_requests Total webhooks processed\n` +
      `# TYPE webhook_processed_requests counter\nwebhook_processed_requests ${this.processedRequests}\n` +
      `# HELP webhook_dropped_requests Total 429 responses returned\n` +
      `# TYPE webhook_dropped_requests counter\nwebhook_dropped_requests ${this.droppedRequests}\n` +
      `# HELP webhook_average_processing_time_ms Average processing time\n` +
      `# TYPE webhook_average_processing_time_ms gauge\nwebhook_average_processing_time_ms ${avg}\n`
    );
  }

  getAsJSON() {
    const averageTime =
      this.processedRequests > 0
        ? this.totalProcessingTime / this.processedRequests
        : 0;
    return {
      totalRequests: this.totalRequests,
      processedRequests: this.processedRequests,
      droppedRequests: this.droppedRequests,
      averageProcessingTime: parseFloat(averageTime.toFixed(2)),
      processingCount: this.processingCount,
    };
  }
}
