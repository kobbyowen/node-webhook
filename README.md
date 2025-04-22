# Webhook Processor

A high-throughput Node.js webhook processing service with support for rate limiting, structured logging, observability, and graceful shutdown.

---

## 📦 Installation

```bash
npm install
```

---

## 🛠️ Usage

### Start the server

```bash
npm start
```

### Development mode with auto-reload

```bash
npm run dev
```

### Run tests

```bash
npm test
```

---

## Environment Variables

These can be configured in a `.env` file or directly in your shell.

| Variable      | Default | Description                               |
| ------------- | ------- | ----------------------------------------- |
| `PORT`        | `3005`  | Port the server will listen on            |
| `QUEUE_LIMIT` | `100`   | Max queue size before rejecting requests  |
| `CONCURRENCY` | `10`    | Max number of tasks processed in parallel |

---

## 📬 Webhook Endpoint

Send a JSON payload to `/webhook`:

```bash
curl -X POST http://localhost:3005/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "user.signup", "email": "test@example.com"}'
```

If queue is full, the server will respond with:

```json
{
  "error": "Too Many Requests"
}
```

---

## 📊 Metrics Endpoint

GET `/metrics` supports:

- `Accept: text/plain` → Prometheus text format
- `Accept: application/json` → JSON format

```bash
curl -H "Accept: text/plain" http://localhost:3005/metrics
```

---
