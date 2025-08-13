# Next.js Server-Sent Events Example

This is a minimal example showing how to use **Server-Sent Events (SSE)** in a Next.js App Router project.

---

## What is SSE?

**Server-Sent Events** is a way for the server to send real-time, one-way updates to the browser over HTTP.
The browser opens a connection (using `EventSource`) and the server keeps it open, sending messages as they happen.
Unlike WebSockets, SSE is **one-directional** (server → client) and uses normal HTTP streaming.

---

## Where SSE Can Be Useful

SSE is a good choice when you need **real-time updates from the server to the browser**, but don’t need two-way communication. Examples include:

* **Live dashboards** - stock prices, cryptocurrency rates, or IoT sensor readings.
* **System monitoring** - server health, CPU/memory usage, or error logs.
* **Notifications** - instant delivery of alerts, chat messages, or activity feeds.
* **Progress updates** - long-running task status, file upload progress, or build logs.
* **Sports scores & event tracking** - live match scores, race positions, or event timers.

---

## What Each File Does

* **`lib/sse-bus.js`**
  A small in-memory pub/sub system.

  * `subscribe(fn)` → adds a new listener for SSE messages.
  * `publish(payload)` → sends a message to all listeners.
    This allows `/api/publish` to trigger messages and `/api/sse` to deliver them.

* **`app/api/sse/route.js`**
  The SSE endpoint.

  * Sets correct headers (`Content-Type: text/event-stream`)
  * Subscribes the client connection to the event bus.
  * Sends a “hello” event on connect and heartbeat pings to keep the connection alive.

* **`app/api/publish/route.js`**
  A trigger endpoint to send messages to all connected SSE clients.

  * Reads query parameters and request headers (browser info, IP, etc.)
  * Broadcasts them using `publish()` from the event bus.
  * Returns JSON with the published info.

* **`app/page.jsx`**
  The browser client.

  * Uses `EventSource` to connect to `/api/sse`
  * Listens for `hello` and `message` events.
  * Displays received messages in a log area.

---

## Usage

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Run the dev server**

   ```bash
   pnpm dev
   ```

   Visit `http://localhost:3000` - the page will connect to `/api/sse`.

3. **Trigger a message**
   Open another browser tab and visit:

   ```
   http://localhost:3000/api/publish?msg=HelloWorld
   ```

   You’ll see the message instantly appear in the main page log.
