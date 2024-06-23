import express from "express";
import http from "http";
import { Server as WebSocketServer, WebSocket } from "ws";
import { HumeClient } from "hume";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server, path: "/video" });

const hume = new HumeClient({
  apiKey: process.env.HUME_API_KEY,
  secretKey: process.env.HUME_SECRET_KEY,
});

function safeStringify(obj: any) {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        return; // Discard key if circular reference found
      }
      cache.add(value);
    }
    return value;
  });
}

wsServer.on("connection", (ws: WebSocket) => {
  console.log("Client connected to /video WebSocket endpoint");

  ws.on("message", async (message: Buffer) => {
    console.log("Received frame from client");

    try {
      // Convert buffer to base64 string; necessary if the model expects image data in this format
      const base64data = message.toString("base64");
      console.log(message);
      // Process the data for emotion prediction
      const stream = await hume.start({
        models: {
          face: {},
        },
        rawInput: true,
        streamWindowMs: 1000, // Adjust as needed
      });

      stream.on("message", (message) => {
        console.log(
          "Prediction result from Hume:",
          JSON.stringify(message, null, 2)
        );
        ws.send(JSON.stringify(message));
      });

      stream.on("error", (error) => {
        console.error("Stream error:", error);
        ws.send(JSON.stringify({ error: "Stream error" }));
      });

      stream.write(base64data);
    } catch (error) {
      console.error("Error processing frame:", error);
      if (error instanceof Error) {
        console.error(error.message);
        console.error(error.stack);
      }
      ws.send(JSON.stringify({ error: "Error processing frame" }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected from /video WebSocket endpoint");
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
